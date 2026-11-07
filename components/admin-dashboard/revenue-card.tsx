interface RevenueCardProps {
  totalRevenue: number;
  totalOrders: number;
}

export function RevenueCard({ totalRevenue, totalOrders }: RevenueCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
      <h2 className="text-lg font-bold text-primary mb-4">Revenu</h2>
      <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
        {totalRevenue.toFixed(3)} DT
      </div>
      <p className="text-muted-foreground text-sm md:text-base">
        Revenu total de {totalOrders} commandes
      </p>
    </div>
  );
}
