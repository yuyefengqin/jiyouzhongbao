export type TaskStatus = 'urgent' | 'new' | 'high-reward' | 'ongoing' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  distance: string;
  timeLeft?: string;
  category: string;
  status: TaskStatus;
  imageUrl?: string;
  delegator: {
    name: string;
    avatar: string;
    rating: number;
    taskCount: number;
  };
  location: string;
  date: string;
  attachments: {
    name: string;
    url: string;
    type: 'image' | 'file';
  }[];
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  status: string;
}

export interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  time: string;
  unreadCount?: number;
  taskTitle?: string;
  status?: 'ongoing' | 'completed';
}
