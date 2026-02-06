import { Order } from '@/lib/types';
import { OrderDetailCard } from './order-detail-card';

interface OrderDetailsSectionProps {
  orders: Order[];
}

export function OrderDetailsSection({ orders }: OrderDetailsSectionProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Order Details</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderDetailCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
