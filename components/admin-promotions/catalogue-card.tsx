'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Catalogue } from '@/lib/types';

interface CatalogueCardProps {
  catalogue: Catalogue;
  onToggleVisibility: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CatalogueCard({
  catalogue,
  onToggleVisibility,
  onEdit,
  onDelete,
}: CatalogueCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Catalogue Image */}
      <div className="relative w-full h-48 bg-secondary">
        {catalogue.image ? (
          <img
            src={catalogue.image || "/placeholder.svg"}
            alt={catalogue.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          {catalogue.visible ? (
            <Eye className="w-5 h-5 text-green-600 bg-white rounded-full p-1" />
          ) : (
            <EyeOff className="w-5 h-5 text-muted-foreground bg-white rounded-full p-1" />
          )}
        </div>
      </div>

      {/* Catalogue Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-primary mb-2">{catalogue.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {catalogue.description}
        </p>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              catalogue.visible
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {catalogue.visible ? 'Visible' : 'Hidden'}
          </span>
          {catalogue.pdfUrl && (
            <span className="ml-2 text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
              PDF Available
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleVisibility(catalogue.id)}
            className="flex-1 rounded-lg gap-2 bg-transparent"
          >
            {catalogue.visible ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(catalogue.id)}
            className="rounded-lg gap-2"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(catalogue.id)}
              className="text-destructive hover:text-destructive rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
