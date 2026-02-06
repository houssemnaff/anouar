interface StockValueCardProps {
  totalStockValue: number;
  totalProducts: number;
}

export function StockValueCard({ totalStockValue, totalProducts }: StockValueCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold text-primary mb-4">Valeur du stock</h2>
      <div className="text-5xl font-bold text-primary mb-2">
        {totalStockValue.toFixed(3)} DT
      </div>
      <p className="text-muted-foreground">
        Valeur estimée des {totalProducts} produits en stock
      </p>
    </div>
  );
}
