import { Boxes } from 'lucide-react';

interface StockValueCardProps {
  totalStockValue: number;
  totalProducts: number;
}

export function StockValueCard({ totalStockValue, totalProducts }: StockValueCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-card border border-border/60 shadow-sm">
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Boxes className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
      </div>

      <p className="relative text-sm text-muted-foreground mb-1">Valeur du stock</p>
      <p className="relative text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        {totalStockValue.toFixed(3)} DT
      </p>
      <p className="relative text-sm text-muted-foreground mt-2">
        Valeur estimée des {totalProducts} produits en stock
      </p>
    </div>
  );
}
