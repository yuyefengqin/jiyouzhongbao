import { useState, useEffect } from 'react';
import { Wallet, PlusCircle } from 'lucide-react';
import WalletCard from '../components/WalletCard';
import TransactionItem from '../components/TransactionItem';
import { Transaction } from '../types';
import * as api from '../services/api';

export default function WalletScreen() {
  const [wallet, setWallet] = useState({ balance: 0, totalEarnings: 0, frozenFunds: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [walletData, txData] = await Promise.all([
          api.getWallet(),
          api.getTransactions(),
        ]);
        setWallet(walletData);
        setTransactions(txData);
      } catch (e) {
        console.error('Failed to load wallet:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="pt-24 pb-32 px-6 max-w-md mx-auto">
      <WalletCard 
        balance={wallet.balance} 
        totalEarnings={wallet.totalEarnings} 
        frozenFunds={wallet.frozenFunds} 
      />

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl shadow-[0_8px_16px_rgba(0,61,166,0.1)] active:scale-95 transition-all duration-200 border-t border-white/10">
          <Wallet className="w-5 h-5 fill-current" />
          <span>提现</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-white text-primary font-bold py-4 rounded-xl border border-primary/10 shadow-sm active:scale-95 transition-all duration-200">
          <PlusCircle className="w-5 h-5" />
          <span>充值</span>
        </button>
      </div>

      {/* Transaction History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-lg font-bold text-on-surface">最近账单</h3>
          <button className="text-primary font-bold text-sm">查看全部</button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-on-surface-variant py-8">加载中...</p>
          ) : transactions.length > 0 ? (
            transactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          ) : (
            <p className="text-center text-on-surface-variant py-8">暂无交易记录</p>
          )}
        </div>
      </section>
    </div>
  );
}
