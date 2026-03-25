import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Marketplace from './screens/Marketplace';
import WalletScreen from './screens/Wallet';
import MessagesScreen from './screens/Messages';
import TaskDetail from './screens/TaskDetail';
import TaskSubmit from './screens/TaskSubmit';
import Profile from './screens/Profile';
import Login from './screens/Login';
import Register from './screens/Register';
import { Task } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import * as api from './services/api';

type AppTab = 'marketplace' | 'tasks' | 'messages' | 'wallet';
type AppView = 'main' | 'detail' | 'submit' | 'login' | 'register' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('marketplace');
  const [view, setView] = useState<AppView>('login');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 检查是否已登录
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setView('main');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 加载我的任务
  const loadMyTasks = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const tasks = await api.getMyTasks();
      setMyTasks(tasks);
    } catch (e) {
      console.error('Failed to load my tasks:', e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'tasks') {
      loadMyTasks();
    }
  }, [isLoggedIn, activeTab, loadMyTasks]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView('detail');
  };

  const handleGrabOrder = async (task: Task) => {
    try {
      await api.grabTask(task.id);
      setSelectedTask(task);
      setView('submit');
      loadMyTasks(); // 刷新我的任务
    } catch (e: any) {
      alert(e.message || '抢单失败');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('main');
  };

  const handleRegister = () => {
    alert('注册成功，请登录！');
    setView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-primary font-headline font-bold text-xl">加载中...</div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace onTaskClick={handleTaskClick} />;
      case 'wallet':
        return <WalletScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'tasks':
        return (
          <div className="pt-24 px-6 pb-32">
            {myTasks.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-bold text-on-surface-variant">暂无进行中的任务</h2>
                <p className="text-sm text-outline mt-2">去广场看看吧！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant/10 shadow-sm"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        task.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
                      }`}>
                        {task.status === 'completed' ? '已完成' : '进行中'}
                      </span>
                      <span className="text-primary font-headline font-black text-lg">${task.budget.toFixed(2)}</span>
                    </div>
                    <h3 className="font-headline font-bold text-on-surface mb-1">{task.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{task.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <Marketplace onTaskClick={handleTaskClick} />;
    }
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} onGoToRegister={() => setView('register')} />;
  }

  if (view === 'register') {
    return <Register onRegister={handleRegister} onBackToLogin={() => setView('login')} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <AnimatePresence mode="wait">
        {view === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header 
              title={activeTab === 'marketplace' ? '集友众包' : activeTab === 'wallet' ? '钱包' : activeTab === 'messages' ? '消息' : '我的任务'} 
              showProfile={activeTab === 'marketplace'}
              onAvatarClick={() => setView('profile')}
            />
            {renderMainContent()}
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}

        {view === 'profile' && (
          <motion.div
            key="profile"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120] bg-surface overflow-y-auto"
          >
            <Profile 
              onBack={() => setView('main')} 
              onLogout={async () => {
                await api.logout();
                setIsLoggedIn(false);
                setView('login');
              }}
            />
          </motion.div>
        )}

        {view === 'detail' && selectedTask && (
          <motion.div
            key="detail"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-surface overflow-y-auto"
          >
            <TaskDetail 
              task={selectedTask} 
              onBack={() => setView('main')} 
              onGrab={handleGrabOrder}
            />
          </motion.div>
        )}

        {view === 'submit' && selectedTask && (
          <motion.div
            key="submit"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-surface overflow-y-auto"
          >
            <TaskSubmit 
              task={selectedTask} 
              onBack={() => setView('detail')} 
              onSubmit={() => {
                loadMyTasks(); // 刷新我的任务
                setView('main');
                setActiveTab('tasks');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
