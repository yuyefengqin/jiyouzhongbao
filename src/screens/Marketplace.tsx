import { useState, useEffect } from 'react';
import { Bolt, LayoutGrid, Palette, Bike, GraduationCap, Wrench } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { Task } from '../types';
import * as api from '../services/api';

interface MarketplaceProps {
  onTaskClick: (task: Task) => void;
}

export default function Marketplace({ onTaskClick }: MarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState<'distance' | 'budget'>('distance');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: '全部', label: '全部', icon: LayoutGrid },
    { id: '设计', label: '设计', icon: Palette },
    { id: '跑腿', label: '跑腿', icon: Bike },
    { id: '家教', label: '家教', icon: GraduationCap },
    { id: '维修', label: '维修', icon: Wrench },
  ] as const;

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const data = await api.getTasks(activeCategory, sortBy);
        setTasks(data);
      } catch (e) {
        console.error('Failed to load tasks:', e);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [activeCategory, sortBy]);

  // 前端也做一层排序保证即时响应
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'distance') {
      return parseFloat(a.distance) - parseFloat(b.distance);
    } else {
      return b.budget - a.budget;
    }
  });

  return (
    <div className="pt-20 pb-32 px-6 max-w-md mx-auto relative min-h-screen">
      {/* Hero Section: Earnings Overview */}
      <section className="mb-8">
        <div className="signature-gradient rounded-[32px] p-6 text-white shadow-[0_20px_40px_rgba(0,61,166,0.15)] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <p className="font-label text-sm font-medium opacity-80 mb-1">当前任务总金额</p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-6">
            ${sortedTasks.reduce((sum, t) => sum + t.budget, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h1>
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                <Bolt className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">今日热门</p>
                <p className="text-sm font-semibold">{sortedTasks.length} 项新任务</p>
              </div>
            </div>
            <button className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform">
              查看数据
            </button>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="mb-8 overflow-x-auto hide-scrollbar flex gap-3 -mx-6 px-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </section>

      {/* Marketplace List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-extrabold text-on-surface tracking-tight">活跃任务</h2>
          <button 
            onClick={() => setSortBy(sortBy === 'distance' ? 'budget' : 'distance')}
            className="text-primary text-sm font-bold flex items-center gap-1 active:opacity-70 transition-opacity"
          >
            排序：{sortBy === 'distance' ? '距离最近' : '报酬最高'}
          </button>
        </div>
        
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant font-medium">加载中...</p>
            </div>
          ) : sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-on-surface-variant font-medium">该分类下暂无任务</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
