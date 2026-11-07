'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Trash2, Pencil, Eye, EyeOff, FileText, ImageOff, ExternalLink,
} from 'lucide-react';
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
    <div className="group relative flex flex-col rounded-3xl border border-border/60 bg-card overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      {/* Aperçu */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-secondary to-background">
        {catalogue.image ? (
          <img
            src={catalogue.image || '/placeholder.svg'}
            alt={catalogue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="w-10 h-10 opacity-40" />
            <span className="text-xs">Aucune image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur shadow-sm ${
              catalogue.visible
                ? 'bg-emerald-500/90 text-white'
                : 'bg-zinc-600/90 text-white'
            }`}
          >
            {catalogue.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {catalogue.visible ? 'Visible' : 'Masqué'}
          </span>
          {catalogue.pdfUrl && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur shadow-sm">
              <FileText className="w-3.5 h-3.5" />
              PDF
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="font-bold text-foreground leading-snug line-clamp-1">{catalogue.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">
          {catalogue.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/60">
          <Button
            onClick={() => onToggleVisibility(catalogue.id)}
            size="sm"
            variant={catalogue.visible ? 'outline' : 'default'}
            className={`flex-1 rounded-full gap-2 text-xs ${
              catalogue.visible
                ? 'text-muted-foreground hover:text-foreground'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-md shadow-emerald-600/25'
            }`}
          >
            {catalogue.visible ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Masquer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Afficher
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(catalogue.id)}
            className="rounded-full w-9 h-9 p-0 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            aria-label="Modifier"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(catalogue.id)}
              className="rounded-full w-9 h-9 p-0 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          {catalogue.pdfUrl && (
            <a
              href={catalogue.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border w-9 h-9 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Ouvrir le PDF"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
