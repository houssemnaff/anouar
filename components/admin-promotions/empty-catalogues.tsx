'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';

interface EmptyCataloguesProps {
  onAddCatalogue: () => void;
}

export function EmptyCatalogues({ onAddCatalogue }: EmptyCataloguesProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-12 text-center">
      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-4">No catalogues yet</p>
      <Button onClick={onAddCatalogue} className="rounded-lg">
        Create First Catalogue
      </Button>
    </div>
  );
}
