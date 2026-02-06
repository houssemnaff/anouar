import { Product } from '@/lib/types';

interface ProductSummaryProps {
  products: Product[];
}

export function ProductSummary({ products }: ProductSummaryProps) {
  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-6">
      <p className="text-foreground">
        <span className="font-semibold">Total Products:</span> {products.length}
      </p>
      <p className="text-foreground">
        <span className="font-semibold">In Stock:</span> {inStockCount}
      </p>
    </div>
  );
}
