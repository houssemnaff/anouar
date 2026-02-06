import { Order } from '@/lib/types';
import { RecentOrders } from './recent-orders';
import { QuickStats } from './quick-stats';

interface RecentActivityProps {
  orders: Order[];
  inStockProducts: number;
  totalProducts: number;
  pendingOrders: number;
}

export function RecentActivity({
  orders,
  inStockProducts,
  totalProducts,
  pendingOrders,
}: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentOrders orders={orders} />
      <QuickStats
        inStockProducts={inStockProducts}
        totalProducts={totalProducts}
        totalOrders={orders.length}
        pendingOrders={pendingOrders}
      />
    </div>
  );
}
