import { ArrowDown, ReceiptText } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  key?: string | number;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isIncome ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container-highest text-on-surface-variant'
        }`}>
          {isIncome ? <ArrowDown className="w-6 h-6" /> : <ReceiptText className="w-6 h-6" />}
        </div>
        <div>
          <p className="font-bold text-on-surface">{transaction.title}</p>
          <p className="text-sm text-on-surface-variant">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isIncome ? 'text-primary' : 'text-on-surface-variant'}`}>
          {isIncome ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
        </p>
        <p className="text-[10px] text-on-surface-variant font-medium">{transaction.status}</p>
      </div>
    </div>
  );
}
