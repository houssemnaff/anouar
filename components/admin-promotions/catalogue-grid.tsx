'use client';

import React from 'react';
import { Catalogue } from '@/lib/types';
import { CatalogueCard } from './catalogue-card';

interface CatalogueGridProps {
  catalogues: Catalogue[];
  onToggleVisibility: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CatalogueGrid({
  catalogues,
  onToggleVisibility,
  onEdit,
  onDelete,
}: CatalogueGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {catalogues.map((catalogue) => (
        <CatalogueCard
          key={catalogue.id}
          catalogue={catalogue}
          onToggleVisibility={onToggleVisibility}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
