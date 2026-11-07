'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Megaphone, X, FileText, ImageIcon, Upload, Save, RotateCcw, CheckCircle2,
} from 'lucide-react';

interface CatalogueFormProps {
  formData: {
    title: string;
    description: string;
    image: string;
    pdfUrl: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CatalogueForm({
  formData,
  isEditing,
  onInputChange,
  onFileChange,
  onSubmit,
  onCancel,
}: CatalogueFormProps) {
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [pdfName, setPdfName] = useState<string>('');

  const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2';
  const inputCls =
    'w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all placeholder:text-muted-foreground/60';

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const dt = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFileChange(dt, 'image');
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setPdfName(file.name);
    const dt = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFileChange(dt, 'pdf');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />

      {/* En-tête */}
      <div className="relative flex items-center justify-between px-5 md:px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-md shadow-violet-600/25 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight">
              {isEditing ? 'Modifier le catalogue' : 'Nouveau catalogue'}
            </h2>
            <p className="text-xs text-muted-foreground">
              Image + PDF optionnel, visible côté client après création
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="relative p-5 md:p-6 space-y-5">
        <div>
          <label className={labelCls}>Titre du catalogue</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Ex. : Catalogue Hum 2026"
            className={inputCls}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Zone image */}
          <div>
            <label className={labelCls}>Image du catalogue</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
              onDragLeave={() => setIsDraggingImage(false)}
              onDrop={handleImageDrop}
              className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-colors overflow-hidden ${
                isDraggingImage ? 'border-violet-500 bg-violet-500/5' : 'border-border bg-secondary/40'
              }`}
            >
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Aperçu du catalogue"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-9 h-9 opacity-40 mb-2" />
                  <span className="text-xs font-medium">Glissez une image ou cliquez</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-center gap-2 text-white text-xs font-medium pointer-events-none">
                <Upload className="w-3.5 h-3.5" />
                Téléverser une image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFileChange(e, 'image')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WEBP — affiché sur la fiche du catalogue</p>
          </div>

          {/* Zone PDF */}
          <div>
            <label className={labelCls}>PDF du catalogue (optionnel)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingPdf(true); }}
              onDragLeave={() => setIsDraggingPdf(false)}
              onDrop={handlePdfDrop}
              className={`relative w-full h-[calc(100%-1.75rem)] min-h-[120px] rounded-2xl border-2 border-dashed transition-colors ${
                isDraggingPdf ? 'border-violet-500 bg-violet-500/5' : 'border-border bg-secondary/40'
              }`}
            >
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer px-4 text-center">
                {formData.pdfUrl ? (
                  <>
                    <CheckCircle2 className="w-9 h-9 text-emerald-500 mb-1" />
                    <span className="text-xs font-semibold text-foreground break-all max-w-full">
                      {pdfName || 'PDF actuel conservé'}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Cliquez pour remplacer le fichier
                    </span>
                  </>
                ) : (
                  <>
                    <FileText className="w-9 h-9 opacity-40 text-muted-foreground mb-1" />
                    <span className="text-xs font-medium text-muted-foreground">Glissez un PDF ou cliquez</span>
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setPdfName(e.target.files?.[0]?.name || '');
                    onFileChange(e, 'pdf');
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Les clients pourront lire le PDF complet depuis la boutique
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Décrivez le catalogue, la période, les offres..."
            rows={3}
            className={`${inputCls} resize-none`}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/60">
          <Button
            type="submit"
            size="lg"
            className="flex-1 sm:flex-none bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white shadow-lg shadow-violet-600/25 rounded-full gap-2 px-6 font-semibold"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Enregistrer les modifications' : 'Créer le catalogue'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="rounded-full gap-2 px-6 text-muted-foreground hover:text-foreground w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
