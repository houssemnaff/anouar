interface QuickStatsProps {
  inStockProducts: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

export function QuickStats({
  inStockProducts,
  totalProducts,
  totalOrders,
  pendingOrders,
}: QuickStatsProps) {
  const stockPercentage =
    totalProducts === 0
      ? 0
      : Math.round((inStockProducts / totalProducts) * 100);

  const fulfillmentPercentage =
    totalOrders === 0
      ? 0
      : Math.round(((totalOrders - pendingOrders) / totalOrders) * 100);

  return (
    <div className="bg-primary text-primary-foreground rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm opacity-90">Stock Level</p>
          <p className="text-2xl font-bold">{stockPercentage}%</p>
          <p className="text-xs opacity-75">
            {inStockProducts} / {totalProducts} products
          </p>
        </div>
        <div className="pt-4 border-t border-primary-foreground/20">
          <p className="text-sm opacity-90">Order Fulfillment</p>
          <p className="text-2xl font-bold">{fulfillmentPercentage}%</p>
          <p className="text-xs opacity-75">
            {totalOrders - pendingOrders} / {totalOrders} completed
          </p>
        </div>
      </div>
    </div>
  );
}
