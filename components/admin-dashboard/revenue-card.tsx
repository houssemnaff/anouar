import { Wallet, ArrowUpRight } from 'lucide-react';

interface RevenueCardProps {
  totalRevenue: number;
  totalOrders: number;
}

export function RevenueCard({ totalRevenue, totalOrders }: RevenueCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white shadow-lg shadow-blue-600/25">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
          <Wallet className="w-5 h-5" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
          {totalOrders} commande{totalOrders !== 1 ? 's' : ''}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <p className="relative text-sm text-blue-100 mb-1">Revenu total</p>
      <p className="relative text-3xl md:text-4xl font-bold tracking-tight">
        {totalRevenue.toFixed(3)} DT
      </p>
    </div>
  );
}
