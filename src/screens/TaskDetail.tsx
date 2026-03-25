import { Share2, MoreVertical, Timer, Bolt, Star, MapPin, Calendar, FileText, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Task } from '../types';

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
  onGrab: (task: Task) => void;
}

export default function TaskDetail({ task, onBack, onGrab }: TaskDetailProps) {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-32">
      <header className="bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 py-4 w-full sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors active:scale-95 duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl text-primary">任务详情</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <Share2 className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <MoreVertical className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </header>

      <main className="px-6 space-y-8 mt-4 max-w-md mx-auto">
        {/* Hero Section: Budget & Status */}
        <section className="relative overflow-hidden rounded-[32px] signature-gradient p-8 text-white shadow-[0_20px_40px_rgba(0,61,166,0.12)]">
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-on-primary-container/80 font-label font-semibold text-sm tracking-wider uppercase">当前报酬</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-4xl font-extrabold">${task.budget.toFixed(2)}</span>
              <span className="text-on-primary-container/70 text-sm font-medium">已托管</span>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
              <Timer className="w-4.5 h-4.5 fill-current" />
              <span className="text-xs font-semibold">距离结束 {task.timeLeft || '12h 00m'}</span>
            </div>
            {task.status === 'urgent' && (
              <div className="bg-secondary-container text-on-secondary-container rounded-xl px-4 py-2 flex items-center gap-2">
                <Bolt className="w-4.5 h-4.5 fill-current" />
                <span className="text-xs font-bold uppercase tracking-tight">加急</span>
              </div>
            )}
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Delegator Profile */}
        <section className="bg-surface-container-low rounded-[24px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-white shadow-sm">
              <img 
                src={task.delegator.avatar} 
                alt={task.delegator.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg text-on-surface">{task.delegator.name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-secondary fill-current" />
                <span className="text-sm font-bold text-on-surface">{task.delegator.rating}</span>
                <span className="text-xs text-on-surface-variant ml-1">({task.delegator.taskCount}个任务)</span>
              </div>
            </div>
          </div>
          <button className="bg-surface-container-highest text-primary font-bold px-4 py-2 rounded-xl text-sm transition-transform active:scale-95">
            查看个人主页
          </button>
        </section>

        {/* Task Content */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface leading-tight">{task.title}</h2>
          <div className="flex flex-wrap gap-4 text-on-surface-variant">
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full">
              <MapPin className="w-4.5 h-4.5 text-primary" />
              <span className="text-sm font-medium">{task.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full">
              <Calendar className="w-4.5 h-4.5 text-primary" />
              <span className="text-sm font-medium">{task.date}</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-3xl p-6">
            <h3 className="font-headline text-sm font-bold text-primary uppercase tracking-widest mb-3">任务描述</h3>
            <p className="text-on-surface-variant leading-relaxed font-medium whitespace-pre-line">
              {task.description}
            </p>
          </div>
        </section>

        {/* Attachment Previews */}
        {task.attachments.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-on-surface">附件</h3>
              <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-md">{task.attachments.length}个文件</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {task.attachments.map((file, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer">
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {file.type === 'file' && (
                    <div className="absolute inset-0 bg-surface-container-highest/50 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location/Map Section */}
        <section className="space-y-4">
          <h3 className="font-headline text-lg font-bold text-on-surface">地理位置</h3>
          <div className="rounded-[24px] overflow-hidden h-48 relative shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWa3ux-oRAZb_V8T3R99aIfpW0OiVjEMUv2YQdzZLRMKYy9b-Pwf1w2vPoLpMWKgLbd_Ql8oI0T2byLQUuRC8KNN6Fh7dMhVnBaVAXDlD9BBo_NDjLGawUgJq4s8OHPNEPCAHj-eA0fDygRFC3dnaflYU_WV0NObQudB-Oybc4L5twZJo3IkhYbzb9_RTJonke5qMSDf10HVeRBxHex7aOeUDinMIbni-K_33tfSRi4p14Zk8D9_Hs69RRBObD4MfZh568Q6VA9EM" 
              alt="Map" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <MapPin className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-6 glass-panel border-t border-outline-variant/30 z-[60]">
        <div className="max-w-md mx-auto flex gap-4">
          <button className="w-16 h-14 bg-surface-container-highest text-on-surface flex items-center justify-center rounded-2xl active:scale-90 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onGrab(task)}
            className="flex-1 h-14 bg-primary text-white font-headline font-bold text-lg rounded-2xl shadow-[0_8px_24px_rgba(0,61,166,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 relative overflow-hidden group"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10"></div>
            <span>立即抢单</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
