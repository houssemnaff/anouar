import { ShoppingBag, Truck } from 'lucide-react';
import { Order } from '@/lib/types';

interface OrderHeaderProps {
  orders?: Order[];
}

export function OrderHeader({ orders = [] }: OrderHeaderProps) {
  const pending = orders.filter((o) => o.status === 'pending').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-background to-card p-6 md:p-7 shadow-sm">
      <div className="pointer-events-none absolute -top-20 -right-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            <span className="text-foreground">Gestion des </span>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Commandes
            </span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {orders.length} commande{orders.length !== 1 ? 's' : ''}
            </span>
            <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 text-xs font-semibold inline-flex items-center gap-1.5">
              <Truck className="w-3 h-3" />
              {pending} en attente
            </span>
            <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
              {delivered} livrées
            </span>
            <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-semibold">
              {revenue.toFixed(3)} DT encaissés
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
