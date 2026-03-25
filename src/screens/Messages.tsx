import { useState, useEffect } from 'react';
import { Bell, Clock, Edit3 } from 'lucide-react';
import MessageItem from '../components/MessageItem';
import { Message } from '../types';
import * as api from '../services/api';

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getMessages();
        setMessages(data);
      } catch (e) {
        console.error('Failed to load messages:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = messages.reduce((sum, m) => sum + (m.unreadCount || 0), 0);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-32">
      {/* Header Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight mb-2">消息通知</h2>
        <p className="text-on-surface-variant font-body">
          {unreadCount > 0 ? `您有 ${unreadCount} 条未读消息待处理` : '暂无未读消息'}
        </p>
      </section>

      {/* Quick Categories (Bento Style) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary-container p-5 rounded-3xl flex flex-col justify-between aspect-square md:aspect-auto md:h-32 transition-transform active:scale-95 cursor-pointer">
          <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <span className="text-on-primary font-headline font-bold block">系统公告</span>
            <span className="text-on-primary-container/80 text-xs">
              {messages.filter(m => m.sender.role === 'system').length} 条通知
            </span>
          </div>
        </div>
        <div className="bg-secondary-container p-5 rounded-3xl flex flex-col justify-between aspect-square md:aspect-auto md:h-32 transition-transform active:scale-95 cursor-pointer">
          <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-on-secondary-container fill-current" />
          </div>
          <div>
            <span className="text-on-secondary-container font-headline font-bold block">任务动态</span>
            <span className="text-on-secondary-container/80 text-xs">
              {messages.filter(m => m.status === 'ongoing').length} 项任务待确认
            </span>
          </div>
        </div>
      </div>

      {/* Message List Container */}
      <div className="bg-surface-container-low rounded-[32px] overflow-hidden">
        {loading ? (
          <p className="text-center text-on-surface-variant py-12">加载中...</p>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <MessageItem key={msg.id} message={msg} />
          ))
        ) : (
          <p className="text-center text-on-surface-variant py-12">暂无消息</p>
        )}
      </div>

      {/* Contextual FAB - New Message */}
      <div className="fixed bottom-28 right-6">
        <button className="bg-primary text-on-primary w-14 h-14 rounded-2xl shadow-[0_4px_24px_rgba(0,61,166,0.2)] flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group">
          <Edit3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
}
