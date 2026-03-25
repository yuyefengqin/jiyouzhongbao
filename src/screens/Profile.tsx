import { useState, useEffect } from 'react';
import { Settings, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import * as api from '../services/api';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function Profile({ onBack, onLogout }: ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { label: '完成任务', value: profile?.task_count?.toString() || '0', icon: CheckCircle2, color: 'text-secondary' },
    { label: '综合评分', value: profile?.rating?.toString() || '5.0', icon: Star, color: 'text-primary' },
    { label: '加入天数', value: profile ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000).toString() : '0', icon: Clock, color: 'text-on-surface-variant' },
  ];

  const menuItems = [
    { label: '实名认证', icon: Shield, badge: '已认证' },
    { label: '我的钱包', icon: CreditCard },
    { label: '设置', icon: Settings },
    { label: '帮助与反馈', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-surface pb-12">
      <Header title="个人中心" showBack onBack={onBack} />
      
      <div className="pt-24 px-6">
        {/* Profile Card */}
        <div className="bg-surface-container-low rounded-[2.5rem] p-8 mb-6 border border-outline-variant/10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest overflow-hidden border-4 border-primary/10 mb-4">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url}
                  alt="User" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                  {profile?.username?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-headline font-black text-on-surface mb-1">
              {loading ? '加载中...' : (profile?.username || '未知用户')}
            </h2>
            <p className="text-sm text-on-surface-variant font-medium mb-6">
              {profile?.bio || '众包新人'}
            </p>
            
            <div className="grid grid-cols-3 gap-4 w-full">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                  <span className="text-lg font-headline font-black text-on-surface">{stat.value}</span>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-8">
          {menuItems.map((item, i) => (
            <button 
              key={i}
              className="w-full flex items-center justify-between p-5 bg-surface-container-low rounded-3xl border border-outline-variant/10 hover:bg-surface-container transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-surface-container-highest flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-on-surface">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-outline" />
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-5 bg-error-container/10 text-error font-black rounded-3xl border border-error/20 hover:bg-error-container/20 transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
