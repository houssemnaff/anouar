import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';

interface ProductHeaderProps {
  onAddProduct: () => void;
  products?: Product[];
}

export function ProductHeader({ onAddProduct, products = [] }: ProductHeaderProps) {
  const onSale = products.filter((p) => (p.discount ?? 0) > 0).length;
  const outOfStock = products.filter((p) => !p.inStock).length;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-background to-card p-6 md:p-7 shadow-sm">
      <div className="pointer-events-none absolute -top-20 -right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              <span className="text-foreground">Gestion des </span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Produits
              </span>
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {products.length} produit{products.length !== 1 ? 's' : ''}
              </span>
              {onSale > 0 && (
                <span className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 text-xs font-semibold">
                  {onSale} en promotion
                </span>
              )}
              {outOfStock > 0 && (
                <span className="rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 text-xs font-semibold">
                  {outOfStock} en rupture
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={onAddProduct}
          className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all duration-300 rounded-full gap-2 px-6 h-11 w-full md:w-auto"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Ajouter un produit
        </Button>
      </div>
    </div>
  );
}
