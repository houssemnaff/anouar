import { Order } from '@/lib/types';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold text-primary mb-4">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No orders yet</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {orders
            .slice(-5)
            .reverse()
            .map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
