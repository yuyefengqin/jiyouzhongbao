import { Store, ClipboardList, MessageSquare, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'marketplace' | 'tasks' | 'messages' | 'wallet';
  onTabChange: (tab: 'marketplace' | 'tasks' | 'messages' | 'wallet') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'marketplace', label: '广场', icon: Store },
    { id: 'tasks', label: '任务', icon: ClipboardList },
    { id: 'messages', label: '消息', icon: MessageSquare },
    { id: 'wallet', label: '钱包', icon: Wallet },
  ] as const;

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-end px-4 pb-8 pt-4 glass-panel border-t border-outline-variant/20 rounded-t-[32px] shadow-[0_-4px_24px_rgba(0,61,166,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
              isActive 
                ? 'bg-primary text-on-primary px-5 py-2.5 rounded-2xl shadow-lg shadow-primary/20' 
                : 'text-on-surface-variant hover:text-primary px-4 py-2'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            <span className={`text-[10px] mt-1 font-label ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
