'use client';

import { useStore } from '@/lib/store-context';
import { DashboardHeader } from './admin-dashboard/dashboard-header';
import { StatsGrid } from './admin-dashboard/stats-grid';
import { KeyMetrics } from './admin-dashboard/key-metrics';
import { RecentActivity } from './admin-dashboard/recent-activity';
import { ChartsSection } from './admin-dashboard/charts-section';

export function AdminDashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { products, orders, catalogues } = useStore();

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const activeCatalogues = catalogues.filter((c) => c.visible).length;
  
  // Calcul de la valeur totale du stock (Prix * Quantité)
  // Utilise 'quantity' si disponible, sinon 0
  const totalStockValue = products.reduce((sum, product) => {
    const qty = product.quantity ?? 0;
    return sum + (product.price * qty);
  }, 0);

  return (
    <div className="space-y-8">
      <DashboardHeader onNavigate={onNavigate} />

      <StatsGrid
        totalProducts={totalProducts}
        inStockProducts={inStockProducts}
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
      />

      <KeyMetrics
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        activeCatalogues={activeCatalogues}
        totalStockValue={totalStockValue}
        totalProducts={totalProducts}
      />

      <ChartsSection products={products} orders={orders} />

      <RecentActivity
        orders={orders}
        inStockProducts={inStockProducts}
        totalProducts={totalProducts}
        pendingOrders={pendingOrders}
      />
    </div>
  );
}
