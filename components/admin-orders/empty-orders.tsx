import { ShoppingBag } from 'lucide-react';

export function EmptyOrders() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
      <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/25 flex items-center justify-center">
        <ShoppingBag className="w-9 h-9 text-white" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1.5">Aucune commande pour le moment</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Les commandes de vos clients apparaîtront ici automatiquement dès qu'elles seront passées depuis la boutique.
      </p>
    </div>
  );
}
