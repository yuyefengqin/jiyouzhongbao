import { useState } from 'react';
import { Rocket, Smartphone, ShieldCheck, ArrowRight, MessageCircle, Wallet, User, Lock } from 'lucide-react';
import * as api from '../services/api';

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export default function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !phone || !password) {
      setError('请填写所有必填字段');
      return;
    }
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.register(username, phone, password);
      onRegister();
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-secondary-container/10 blur-[80px] opacity-40 rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] bg-primary-container/10 blur-[80px] opacity-40 rounded-full"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-16 pb-12 max-w-md mx-auto w-full">
        <header className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
            <Rocket className="w-10 h-10 text-on-secondary fill-current rotate-45" />
          </div>
          <h1 className="text-3xl font-headline font-black text-secondary tracking-tighter">加入集友</h1>
          <p className="text-on-surface-variant font-medium mt-1">开启您的自由赚金之旅</p>
        </header>

        <main className="flex-grow">
          <div className="flex p-1 bg-surface-container rounded-xl mb-8">
            <button 
              onClick={onBackToLogin}
              className="flex-1 py-3 text-sm font-bold rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
            >
              登录
            </button>
            <button className="flex-1 py-3 text-sm font-bold rounded-lg bg-surface-container-lowest text-secondary shadow-sm">
              注册
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 text-error text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">用户名</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-secondary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 text-on-surface placeholder:text-outline transition-all" 
                  placeholder="请输入您的用户名" 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">手机号码</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-secondary transition-colors">
                  <Smartphone className="w-5 h-5" />
                </div>
                <input 
                  className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 text-on-surface placeholder:text-outline transition-all" 
                  placeholder="请输入您的手机号" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">设置密码</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-secondary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 text-on-surface placeholder:text-outline transition-all" 
                  placeholder="请输入登录密码（至少6位）" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center px-1 text-xs">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20" type="checkbox" required />
                <span>我已阅读并同意相关协议</span>
              </label>
            </div>

            <button 
              className="w-full py-4 bg-secondary text-on-secondary font-bold text-lg rounded-xl shadow-xl shadow-secondary/20 hover:bg-secondary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              {loading ? '注册中...' : '立即注册'}
              {!loading && <ArrowRight className="w-6 h-6" />}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-grow bg-surface-variant"></div>
            <span className="text-xs font-bold text-outline uppercase tracking-widest">其他方式</span>
            <div className="h-px flex-grow bg-surface-variant"></div>
          </div>

          <div className="flex justify-center gap-8 mt-8">
            <button className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-[#07C160] hover:scale-110 active:scale-95 transition-transform">
              <MessageCircle className="w-8 h-8 fill-current" />
            </button>
            <button className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-[#1677FF] hover:scale-110 active:scale-95 transition-transform">
              <Wallet className="w-8 h-8 fill-current" />
            </button>
          </div>
        </main>

        <footer className="mt-auto text-center">
          <p className="text-[10px] text-on-surface-variant leading-relaxed px-4">
            注册即代表您已阅读并同意
            <a className="text-secondary font-bold" href="#">《用户协议》</a>
            与
            <a className="text-secondary font-bold" href="#">《隐私政策》</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
