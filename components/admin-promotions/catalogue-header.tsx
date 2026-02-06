'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CatalogueHeaderProps {
  onAddCatalogue: () => void;
}

export function CatalogueHeader({ onAddCatalogue }: CatalogueHeaderProps) {
  return (
   <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
      Catalogue Management
    </h1>
    <p className="text-blue-900/70 text-sm md:text-base">
      Create and manage store catalogues
    </p>
  </div>
  <Button 
    onClick={onAddCatalogue} 
    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg gap-2 w-full md:w-auto"
  >
    <Plus className="w-4 h-4" />
    Add Catalogue
  </Button>
</div>
  
  );
}
