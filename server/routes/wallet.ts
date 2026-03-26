import { Router, Request, Response } from 'express';
import { supabase, authMiddleware } from '../supabase.js';

const router = Router();

// GET /api/wallet - 获取钱包信息
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    // 如果钱包不存在，返回默认值
    res.json({ balance: 0, totalEarnings: 0, frozenFunds: 0 });
    return;
  }

  res.json({
    balance: Number(data.balance),
    totalEarnings: Number(data.total_earnings),
    frozenFunds: Number(data.frozen_funds),
  });
});

// GET /api/wallet/transactions - 获取交易记录
router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const transactions = (data || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    amount: Number(t.amount),
    date: new Date(t.created_at).toLocaleDateString('zh-CN'),
    type: t.type,
    status: t.status,
  }));

  res.json(transactions);
});

export default router;
