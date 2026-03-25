import { MapPin, Clock, Layers } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  key?: string | number;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const isBento = task.imageUrl !== undefined;

  if (isBento) {
    return (
      <div 
        onClick={() => onClick(task)}
        className="bg-surface-container-low rounded-[28px] overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
      >
        <div className="h-40 w-full relative">
          <img 
            src={task.imageUrl} 
            alt={task.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              高额报酬
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-headline text-lg font-bold text-on-surface mb-2 leading-tight">{task.title}</h3>
          <p className="text-on-surface-variant text-sm mb-5 font-body leading-relaxed line-clamp-2">{task.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">预算</span>
              <span className="text-2xl font-black text-primary">${task.budget}</span>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform">
              立即抢单
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(task)}
      className="bg-surface-container-low rounded-[28px] p-5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
          task.status === 'urgent' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed-variant'
        }`}>
          {task.status === 'urgent' ? '加急' : '新发布'}
        </span>
        <span className="text-on-surface-variant text-xs font-semibold flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          距离 {task.distance}
        </span>
      </div>
      <h3 className="font-headline text-lg font-bold text-on-surface mb-2 leading-tight">{task.title}</h3>
      <p className="text-on-surface-variant text-sm mb-5 line-clamp-2 font-body leading-relaxed">{task.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">预算</span>
          <span className="text-2xl font-black text-primary">${task.budget}</span>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-md shadow-primary/10 active:scale-95 transition-transform relative overflow-hidden">
          <span className="relative z-10">立即抢单</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-4">
        <div className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant">
          <Clock className="w-3 h-3" />
          {task.timeLeft ? `剩余 ${task.timeLeft}` : task.date}
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant">
          <Layers className="w-3 h-3" />
          {task.category}
        </div>
      </div>
    </div>
  );
}
