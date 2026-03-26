import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import walletRoutes from './routes/wallet.js';
import messageRoutes from './routes/messages.js';
import seedRoutes from './routes/seed.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/seed', seedRoutes);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 集友众包 API 服务器运行在 http://localhost:${PORT}`);
  });
}
