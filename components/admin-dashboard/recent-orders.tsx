import { Order } from '@/lib/types';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 md:p-6">
      <h2 className="text-lg font-bold text-primary mb-4">Commandes Récentes</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucune commande</p>
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
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-semibold text-foreground truncate">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.items.length} produit{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary">
                    {order.totalPrice.toFixed(3)} DT
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {order.status === 'pending' ? 'En attente' : 'Livré'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
