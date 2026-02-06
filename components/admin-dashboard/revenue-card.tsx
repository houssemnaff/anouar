interface RevenueCardProps {
  totalRevenue: number;
  totalOrders: number;
}

export function RevenueCard({ totalRevenue, totalOrders }: RevenueCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold text-primary mb-4">Revenue</h2>
      <div className="text-5xl font-bold text-primary mb-2">
        {totalRevenue.toFixed(3)} DT
      </div>
      <p className="text-muted-foreground">
        Total revenue from {totalOrders} orders
      </p>
    </div>
  );
}
