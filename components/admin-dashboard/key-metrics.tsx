import { RevenueCard } from './revenue-card';
import { CataloguesCard } from './catalogues-card';
import { StockValueCard } from './stock-value-card';

interface KeyMetricsProps {
  totalRevenue: number;
  totalOrders: number;
  activeCatalogues: number;
  totalStockValue: number;
  totalProducts: number;
}

export function KeyMetrics({
  totalRevenue,
  totalOrders,
  activeCatalogues,
  totalStockValue,
  totalProducts,
}: KeyMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <RevenueCard totalRevenue={totalRevenue} totalOrders={totalOrders} />
      <StockValueCard totalStockValue={totalStockValue} totalProducts={totalProducts} />
      <CataloguesCard activeCatalogues={activeCatalogues} />
    </div>
  );
}
