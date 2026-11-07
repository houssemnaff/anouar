'use client';

import { Button } from '@/components/ui/button';
import { Megaphone, Plus } from 'lucide-react';

interface EmptyCataloguesProps {
  onAddCatalogue: () => void;
}

export function EmptyCatalogues({ onAddCatalogue }: EmptyCataloguesProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
      <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-600/25 flex items-center justify-center">
        <Megaphone className="w-9 h-9 text-white" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1.5">Aucun catalogue pour le moment</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        Créez votre premier catalogue promotionnel — image ou PDF complet — et rendez-le visible côté client en un clic.
      </p>
      <Button
        onClick={onAddCatalogue}
        className="bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white shadow-lg shadow-violet-600/25 rounded-full gap-2 px-6"
      >
        <Plus className="w-4 h-4" />
        Créer le premier catalogue
      </Button>
    </div>
  );
}
