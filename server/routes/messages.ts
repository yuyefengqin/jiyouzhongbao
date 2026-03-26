import { Router, Request, Response } from 'express';
import { supabase, authMiddleware } from '../supabase.js';

const router = Router();

// GET /api/messages - 获取消息列表
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`receiver_id.eq.${user.id},sender_role.eq.system`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const messages = (data || []).map((m: any) => ({
    id: m.id,
    sender: {
      name: m.sender_name || '系统',
      avatar: m.sender_avatar || '',
      role: m.sender_role,
    },
    content: m.content,
    time: new Date(m.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    unreadCount: m.unread_count || 0,
    taskTitle: m.task_title,
    status: m.status,
  }));

  res.json(messages);
});

export default router;
