import { Order } from '@/lib/types';

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
        <p className="text-4xl font-bold text-primary">{orders.length}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-2">Pending Orders</p>
        <p className="text-4xl font-bold text-orange-600">{pendingCount}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-2">Delivered Orders</p>
        <p className="text-4xl font-bold text-green-600">{deliveredCount}</p>
      </div>
    </div>
  );
}
