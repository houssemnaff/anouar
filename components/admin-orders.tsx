'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { OrderHeader } from './admin-orders/order-header';
import { OrderStats } from './admin-orders/order-stats';
import { EmptyOrders } from './admin-orders/empty-orders';
import { OrdersTable } from './admin-orders/orders-table';
import { OrderDetailCard } from './admin-orders/order-detail-card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const { toast } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'delivered');
      toast({
        title: 'Order Updated',
        description: 'Order has been marked as delivered successfully.',
      });
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
  };

  const selectedOrder = selectedOrderId
    ? orders.find(order => order.id === selectedOrderId)
    : null;

  return (
    <div className="space-y-8">
      <OrderHeader />

      <OrderStats orders={orders} />

      {selectedOrder ? (
        <div className="space-y-4">
          <Button
            onClick={handleBackToList}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
          <OrderDetailCard order={selectedOrder} />
        </div>
      ) : (
        <>
          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <OrdersTable
              orders={orders}
              onMarkAsDelivered={handleMarkAsDelivered}
              onViewDetails={handleViewDetails}
            />
          )}
        </>
      )}
    </div>
  );
}
