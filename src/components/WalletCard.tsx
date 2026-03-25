interface WalletCardProps {
  balance: number;
  totalEarnings: number;
  frozenFunds: number;
}

export default function WalletCard({ balance, totalEarnings, frozenFunds }: WalletCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] signature-gradient p-8 text-white shadow-[0_20px_40px_rgba(0,61,166,0.15)] mb-8">
      <div className="relative z-10">
        <p className="font-label text-primary-fixed-dim text-sm font-medium mb-1">当前余额</p>
        <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-8">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <p className="text-[11px] font-medium text-primary-fixed-dim uppercase tracking-wider mb-1">总收益</p>
            <p className="font-headline text-lg font-bold">${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <p className="text-[11px] font-medium text-primary-fixed-dim uppercase tracking-wider mb-1">冻结中资金</p>
            <p className="font-headline text-lg font-bold">${frozenFunds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl"></div>
    </section>
  );
}
