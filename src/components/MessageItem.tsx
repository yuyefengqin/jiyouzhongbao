import { Megaphone } from 'lucide-react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  key?: string | number;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isSystem = message.sender.role === 'system';

  return (
    <div className="group flex items-center gap-4 p-5 hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant/10 last:border-0">
      <div className="relative">
        {isSystem ? (
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <Megaphone className="w-8 h-8 text-white fill-current" />
          </div>
        ) : (
          <img 
            src={message.sender.avatar} 
            alt={message.sender.name} 
            className="w-14 h-14 rounded-2xl object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        {message.unreadCount && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-container border-2 border-surface-container-low rounded-full flex items-center justify-center text-[10px] font-bold text-on-secondary-container">
            {message.unreadCount}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-headline font-bold text-on-surface truncate">{message.sender.name}</h3>
            {message.status === 'ongoing' && (
              <span className="px-2 py-0.5 bg-primary-fixed text-[10px] font-bold text-on-primary-fixed-variant rounded-full uppercase">进行中</span>
            )}
            {message.status === 'completed' && (
              <span className="px-2 py-0.5 bg-surface-variant text-[10px] font-bold text-on-surface-variant rounded-full uppercase">已结束</span>
            )}
          </div>
          <span className="text-xs text-on-surface-variant">{message.time}</span>
        </div>
        {message.taskTitle && (
          <p className="text-sm text-on-surface truncate font-semibold">任务：{message.taskTitle}</p>
        )}
        <p className="text-sm text-on-surface-variant truncate font-medium">{message.content}</p>
      </div>
    </div>
  );
}
