import { Router, Request, Response } from 'express';
import { supabase, authMiddleware } from '../supabase.js';

const router = Router();

// GET /api/tasks - 获取任务列表
router.get('/', async (req: Request, res: Response) => {
  const { category, sort } = req.query;

  let query = supabase
    .from('tasks')
    .select(`
      *,
      delegator:profiles!delegator_id(id, username, avatar_url, rating, task_count),
      attachments:task_attachments(*)
    `);

  if (category && category !== '全部') {
    query = query.eq('category', category);
  }

  if (sort === 'budget') {
    query = query.order('budget', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // 转换数据格式以匹配前端 Task 接口
  const tasks = (data || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    budget: Number(t.budget),
    distance: t.distance,
    timeLeft: t.time_left,
    category: t.category,
    status: t.status,
    imageUrl: t.image_url,
    delegator: t.delegator ? {
      name: t.delegator.username,
      avatar: t.delegator.avatar_url || '',
      rating: Number(t.delegator.rating),
      taskCount: t.delegator.task_count,
    } : {
      name: '匿名用户',
      avatar: '',
      rating: 5.0,
      taskCount: 0,
    },
    location: t.location,
    date: t.date,
    attachments: (t.attachments || []).map((a: any) => ({
      name: a.name,
      url: a.url,
      type: a.type,
    })),
  }));

  res.json(tasks);
});

// GET /api/tasks/my - 获取我接的任务
router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks(
        *,
        delegator:profiles!delegator_id(id, username, avatar_url, rating, task_count),
        attachments:task_attachments(*)
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const tasks = (data || []).map((ut: any) => {
    const t = ut.task;
    return {
      id: t.id,
      title: t.title,
      description: t.description,
      budget: Number(t.budget),
      distance: t.distance,
      timeLeft: t.time_left,
      category: t.category,
      status: ut.status, // 使用 user_tasks 的状态
      imageUrl: t.image_url,
      delegator: t.delegator ? {
        name: t.delegator.username,
        avatar: t.delegator.avatar_url || '',
        rating: Number(t.delegator.rating),
        taskCount: t.delegator.task_count,
      } : {
        name: '匿名用户',
        avatar: '',
        rating: 5.0,
        taskCount: 0,
      },
      location: t.location,
      date: t.date,
      attachments: (t.attachments || []).map((a: any) => ({
        name: a.name,
        url: a.url,
        type: a.type,
      })),
    };
  });

  res.json(tasks);
});

// POST /api/tasks/:id/grab - 抢单
router.post('/:id/grab', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const taskId = req.params.id;

  // 检查是否已经接过这个任务
  const { data: existing } = await supabase
    .from('user_tasks')
    .select('id')
    .eq('user_id', user.id)
    .eq('task_id', taskId)
    .single();

  if (existing) {
    res.status(400).json({ error: '您已接过此任务' });
    return;
  }

  const { error } = await supabase.from('user_tasks').insert({
    user_id: user.id,
    task_id: taskId,
    status: 'ongoing',
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ message: '抢单成功' });
});

// POST /api/tasks/:id/submit - 提交任务
router.post('/:id/submit', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const taskId = req.params.id;
  const { summary } = req.body;

  const { error } = await supabase
    .from('user_tasks')
    .update({
      status: 'completed',
      summary: summary || '',
      submitted_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('task_id', taskId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // 更新用户任务完成数
  try {
    const { error: rpcError } = await supabase.rpc('increment_task_count', { user_id_input: user.id });
    if (rpcError) {
      console.warn('RPC increment_task_count failed, falling back to profile update:', rpcError);
      // 获取当前值并递增（简单降级逻辑）
      const { data: profile } = await supabase.from('profiles').select('task_count').eq('id', user.id).single();
      await supabase
        .from('profiles')
        .update({ task_count: (profile?.task_count || 0) + 1 })
        .eq('id', user.id);
    }
  } catch (e) {
    console.error('Increment task count failed:', e);
  }

  res.json({ message: '提交成功' });
});

export default router;
