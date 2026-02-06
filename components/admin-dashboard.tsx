'use client';

import { useStore } from '@/lib/store-context';
import { DashboardHeader } from './admin-dashboard/dashboard-header';
import { StatsGrid } from './admin-dashboard/stats-grid';
import { KeyMetrics } from './admin-dashboard/key-metrics';
import { RecentActivity } from './admin-dashboard/recent-activity';
import { ChartsSection } from './admin-dashboard/charts-section';

export function AdminDashboard() {
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
    const qty = (product as any).quantity || 0; // Cast to any because quantity might not be in the type def yet strictly everywhere
    return sum + (product.price * qty);
  }, 0);

  return (
    <div className="space-y-8">
      <DashboardHeader />

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

      <ChartsSection products={products} />

      <RecentActivity
        orders={orders}
        inStockProducts={inStockProducts}
        totalProducts={totalProducts}
        pendingOrders={pendingOrders}
      />
    </div>
  );
}
