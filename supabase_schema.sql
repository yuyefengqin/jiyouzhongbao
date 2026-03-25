-- ============================================
-- 集友众包 Supabase 数据库建表脚本
-- 请在 Supabase Dashboard > SQL Editor 中执行
-- ============================================

-- 1. 用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 5.0,
  task_count INTEGER DEFAULT 0,
  role TEXT DEFAULT 'worker' CHECK (role IN ('worker', 'employer', 'both')),
  bio TEXT DEFAULT '众包新人',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 任务表
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC(10,2) NOT NULL,
  distance TEXT DEFAULT '0km',
  time_left TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('urgent', 'new', 'high-reward', 'ongoing', 'completed')),
  image_url TEXT,
  delegator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  location TEXT DEFAULT '',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 任务附件表
CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'file'))
);

-- 4. 用户接单记录表
CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
  summary TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- 5. 钱包表
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) DEFAULT 0,
  total_earnings NUMERIC(12,2) DEFAULT 0,
  frozen_funds NUMERIC(12,2) DEFAULT 0
);

-- 6. 交易记录表
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  status TEXT DEFAULT '处理中',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name TEXT,
  sender_avatar TEXT DEFAULT '',
  sender_role TEXT DEFAULT 'system' CHECK (sender_role IN ('system', 'employer', 'provider')),
  content TEXT NOT NULL,
  task_title TEXT,
  status TEXT CHECK (status IN ('ongoing', 'completed', NULL)),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- RLS 策略（行级安全）
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- profiles: 所有人可读，本人可改
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- tasks: 所有人可读
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (auth.uid() = delegator_id);

-- task_attachments: 所有人可读
CREATE POLICY "attachments_select" ON task_attachments FOR SELECT USING (true);

-- user_tasks: 本人可读写
CREATE POLICY "user_tasks_select" ON user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_tasks_insert" ON user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tasks_update" ON user_tasks FOR UPDATE USING (auth.uid() = user_id);

-- wallets: 本人可读
CREATE POLICY "wallets_select" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wallets_insert" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- transactions: 本人可读
CREATE POLICY "transactions_select" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- messages: 收件人可读
CREATE POLICY "messages_select" ON messages FOR SELECT USING (auth.uid() = receiver_id OR sender_role = 'system');

-- ============================================
-- 插入种子数据（示例任务）
-- ============================================

-- 创建一个系统用户用于种子数据的 delegator
-- 注意：你需要先注册一个真实用户，然后替换下面的 UUID
-- 或者直接在 Supabase Auth 中创建用户后使用其 ID

-- 以下使用 INSERT ... ON CONFLICT DO NOTHING 以便重复执行不报错
-- 种子数据将在后端 seed 接口中处理
