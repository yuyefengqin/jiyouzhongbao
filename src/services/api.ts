import { supabase } from '../lib/supabase';
import { Task, Transaction, Message } from '../types';

const API_BASE = '/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { 'Authorization': `Bearer ${session.access_token}` };
  }
  return {};
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ===== Auth API =====

export async function register(username: string, phone: string, password: string) {
  return apiRequest<{ message: string; userId: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, phone, password }),
  });
}

export async function login(phone: string, password: string) {
  const result = await apiRequest<{ token: string; refreshToken: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
  
  // 使用返回的 token 设置 Supabase session
  await supabase.auth.setSession({
    access_token: result.token,
    refresh_token: result.refreshToken,
  });

  return result;
}

export async function getProfile() {
  return apiRequest<{
    id: string;
    username: string;
    phone: string;
    avatar_url: string;
    rating: number;
    task_count: number;
    role: string;
    bio: string;
  }>('/auth/profile');
}

export async function logout() {
  await supabase.auth.signOut();
}

// ===== Tasks API =====

export async function getTasks(category?: string, sort?: string): Promise<Task[]> {
  const params = new URLSearchParams();
  if (category && category !== '全部') params.set('category', category);
  if (sort) params.set('sort', sort);
  const queryStr = params.toString();
  return apiRequest<Task[]>(`/tasks${queryStr ? `?${queryStr}` : ''}`);
}

export async function getMyTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks/my');
}

export async function grabTask(taskId: string) {
  return apiRequest<{ message: string }>(`/tasks/${taskId}/grab`, {
    method: 'POST',
  });
}

export async function submitTask(taskId: string, summary: string) {
  return apiRequest<{ message: string }>(`/tasks/${taskId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ summary }),
  });
}

// ===== Wallet API =====

export async function getWallet() {
  return apiRequest<{
    balance: number;
    totalEarnings: number;
    frozenFunds: number;
  }>('/wallet');
}

export async function getTransactions(): Promise<Transaction[]> {
  return apiRequest<Transaction[]>('/wallet/transactions');
}

// ===== Messages API =====

export async function getMessages(): Promise<Message[]> {
  return apiRequest<Message[]>('/messages');
}

// ===== Seed API =====

export async function seedData() {
  return apiRequest<{ message: string }>('/seed', { method: 'POST' });
}
