import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';

interface OrderRowProps {
  order: Order;
  onMarkAsDelivered: (orderId: string) => void;
}

export function OrderRow({ order, onMarkAsDelivered }: OrderRowProps) {
  return (
    <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
      <td className="px-6 py-4">
        <p className="font-mono text-sm text-primary">
          {order.id.substring(0, 12)}...
        </p>
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-foreground">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-foreground">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-lg font-bold text-primary">
          ${order.totalPrice.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4">
        {order.status === 'pending' ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Delivered
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {order.status === 'pending' && (
          <Button
            onClick={() => onMarkAsDelivered(order.id)}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            Mark Delivered
          </Button>
        )}
      </td>
    </tr>
  );
}
