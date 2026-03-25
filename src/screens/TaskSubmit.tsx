import { useState } from 'react';
import { Info, Camera, X, Mic, ChevronRight, Send, ArrowLeft, ShieldCheck, Store, ClipboardList, MessageSquare, Wallet, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import * as api from '../services/api';

interface TaskSubmitProps {
  task: Task;
  onBack: () => void;
  onSubmit: () => void;
}

export default function TaskSubmit({ task, onBack, onSubmit }: TaskSubmitProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitTask(task.id, summary);
      setShowSuccess(true);
    } catch (e: any) {
      alert(e.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col overflow-hidden relative">
      <header className="bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 py-4 w-full z-50 border-b border-outline-variant/5 flex-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-highest active:scale-95 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-outline">进行中任务</span>
            <h1 className="font-headline font-bold tracking-tight text-primary text-lg leading-tight">{task.title}</h1>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-fixed">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmdGthlnatvIBjoGp5gDVH5ZtZdGtD2UdQ5a7DBDxKq-lF7Y-5Gaxg5XnaON1R98R6fC1fJa21fNAnT7AMWpjQ8i2P_TLNzZAiT2uo-xS5Ce-ZF_E3TwKFOPh-adECPDp7amrDl28BdhI0p0y9ztCjwMwwXHT8p1JN0yqyDEBxFRE4lzt2_FUoDVxutUm1rZlZ9rM9CCXxZj_wqFNOlYxdX_MIUyI1y6SGdyuO0pkSj3-qcfbW19P70wcQ7dLyOIq_7mJ0A297Vhc" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-md mx-auto w-full">
        <section className="space-y-8">
          <div className="relative overflow-hidden rounded-[32px] signature-gradient p-6 text-white shadow-lg">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">进行中</span>
                <Info className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1 font-body">预计收入</p>
              <div className="font-headline font-extrabold text-3xl mb-4">${task.budget.toFixed(2)}</div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container w-3/4 rounded-full"></div>
              </div>
              <p className="text-[11px] mt-2 opacity-80 font-medium">第3步/共4步：提交执行凭证</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-4">
            <h2 className="font-headline font-bold text-lg px-1">工作证明</h2>
            <div className="bg-surface-container-low rounded-[24px] p-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-on-surface-variant mb-2 block px-1">任务总结</span>
                <textarea 
                  className="w-full bg-surface-container-lowest border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline h-32 resize-none" 
                  placeholder="请详细描述已完成的工作内容及更换的配件..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                ></textarea>
              </label>

              <div className="space-y-3">
                <span className="text-sm font-bold text-on-surface-variant block px-1">图片证据</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square rounded-2xl bg-surface-container-highest flex items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary transition-colors cursor-pointer group">
                    <Camera className="w-6 h-6 text-outline group-hover:text-primary" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden relative group">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD5vvPLNuR_HfDCkwRr8FG6n16HKi7FzUhJxZK1ZJmGuSgV1ANyyzHlxspG2un_LVRbmamlP5hWNLftpopGf6sKx8qQfTw8yXhD5XiNv8Oc-pP7BKRsilxaVS6SiKbUCXxXk3ZOXoOG0QTNc5bO3g42Wm-8EwDDOsIrxTVu4eHfgNShidL5yj9ka_RS56BQ7MdbAiheoU3LsDbly1DWgiqtWoQ6EL4BbgmhDlU6HwxKExWTROfnS4kPU9TjACAXWE2AYyUcumwXjk" 
                      alt="Proof 1" 
                      referrerPolicy="no-referrer"
                    />
                    <button className="absolute top-1 right-1 bg-error text-white rounded-full p-1 scale-75">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden relative group">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh5M0f9bCRjGUxpvrpVqExm62cjfV_38ysludgVWS83HwKkXjd83MmlGTp4-gzq_mzAK_sZ3uF-G0vu1BFu-iSI_qST3Uhs55RfZUoL_iWKwP4voAXspHGA_E6WCSxDl1x3RNO3-mjJ-_dLcKDN5-gkD9_Z6HBlPwBfefQHxa6FgeuQuTUI2rAGNfxepHvP0efRPge_l1n9UfNcfvuM7Umq4qIekVUQZpyZOtjV3jbnt5QOhkN3JRIk3Z9Pt-t0QIBu6hSYEPahV8" 
                      alt="Proof 2" 
                      referrerPolicy="no-referrer"
                    />
                    <button className="absolute top-1 right-1 bg-error text-white rounded-full p-1 scale-75">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-sm font-bold text-on-surface-variant block px-1 mb-3">语音备注</span>
                <button className="w-full py-4 px-6 bg-surface-container-highest rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary fill-current" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface">录制详细说明</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-secondary-fixed/30 p-4 rounded-2xl flex gap-3 border border-secondary-container/10">
            <ShieldCheck className="w-5 h-5 text-secondary fill-current" />
            <p className="text-xs font-medium text-on-secondary-fixed-variant leading-relaxed">
              提交即视为您确认所使用的所有零件均已通过集优认证，且工作区域已清理完毕。
            </p>
          </div>
        </section>
      </main>

      <div className="z-50 px-6 pb-8 pt-4 glass-panel border-t border-outline-variant/15 bg-surface/80 backdrop-blur-xl flex-none">
        <button 
          onClick={handleFinalSubmit}
          disabled={submitting}
          className="w-full bg-primary text-white py-5 rounded-[20px] font-headline font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {submitting ? '提交中...' : '确认提交凭证'}
          {!submitting && <Send className="w-5 h-5 fill-current" />}
        </button>
        <nav className="flex justify-around items-center mt-6">
          <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all">
            <Store className="w-6 h-6 mb-1" />
            <span className="font-body text-[11px] font-medium">广场</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-primary text-white rounded-2xl px-5 py-2.5 active:scale-90 transition-all duration-300">
            <ClipboardList className="w-6 h-6 mb-1 fill-current" />
            <span className="font-body text-[11px] font-bold">任务</span>
          </div>
          <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all">
            <MessageSquare className="w-6 h-6 mb-1" />
            <span className="font-body text-[11px] font-medium">消息</span>
          </div>
          <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all">
            <Wallet className="w-6 h-6 mb-1" />
            <span className="font-body text-[11px] font-medium">钱包</span>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">提交成功</h2>
              <p className="text-on-surface-variant text-sm mb-8">您的任务凭证已提交，请等待审核。订单已同步至您的任务菜单。</p>
              
              <div className="space-y-3">
                <button 
                  onClick={onSubmit}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  查看任务列表
                </button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-surface-container text-on-surface py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  留在本页
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
