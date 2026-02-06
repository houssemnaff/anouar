import { Order } from '@/lib/types';
import { CheckCircle, Clock } from 'lucide-react';

interface OrderDetailCardProps {
  order: Order;
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Order ID</p>
          <p className="font-semibold text-foreground font-mono text-sm">
            {order.id}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Customer</p>
          <p className="font-semibold text-foreground">{order.customerName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Phone</p>
          <p className="font-semibold text-foreground">{order.customerPhone}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Date</p>
          <p className="font-semibold text-foreground">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-6 pb-6 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground mb-2">Delivery Address</p>
        <p className="text-foreground">{order.deliveryAddress}</p>
      </div>

      {/* Items */}
      <div className="mb-6 pb-6 border-t border-border pt-6">
        <h4 className="font-semibold text-primary mb-4">Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm p-2 bg-secondary rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{item.productName}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total & Status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold text-primary">
            ${order.totalPrice.toFixed(2)}
          </p>
        </div>
        <div>
          {order.status === 'pending' ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold">
              <Clock className="w-5 h-5" />
              Pending
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              <CheckCircle className="w-5 h-5" />
              Delivered
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
