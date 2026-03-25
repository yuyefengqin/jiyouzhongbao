import { Router, Request, Response } from 'express';
import { supabase, authMiddleware } from '../supabase';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password) {
    res.status(400).json({ error: '请填写所有必填字段' });
    return;
  }

  // 使用手机号作为邮箱格式注册（Supabase Auth 需要邮箱）
  const email = `${phone}@jiyouzhongbao.app`;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // 自动确认
  });

  if (authError) {
    res.status(400).json({ error: authError.message });
    return;
  }

  // 创建用户资料
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username,
    phone,
    avatar_url: '',
    rating: 5.0,
    task_count: 0,
    role: 'both',
    bio: '众包新人',
  });

  if (profileError) {
    console.error('Profile creation error:', profileError);
  }

  // 创建钱包
  await supabase.from('wallets').insert({
    user_id: authData.user.id,
    balance: 0,
    total_earnings: 0,
    frozen_funds: 0,
  });

  res.json({ message: '注册成功', userId: authData.user.id });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400).json({ error: '请填写手机号和密码' });
    return;
  }

  const email = `${phone}@jiyouzhongbao.app`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    res.status(401).json({ error: '手机号或密码错误' });
    return;
  }

  res.json({
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    res.status(404).json({ error: '用户资料不存在' });
    return;
  }

  res.json(data);
});

export default router;
