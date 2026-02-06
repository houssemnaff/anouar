'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold text-primary mb-6">
        {isEditing ? 'Edit Catalogue' : 'Create New Catalogue'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Catalogue Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="E.g., Spring Catalogue 2026"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Describe the catalogue..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Catalogue Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, 'image')}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {formData.image && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-border"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Upload an image for the catalogue (JPG, PNG, etc.)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            PDF Catalogue (Optional)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => onFileChange(e, 'pdf')}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {formData.pdfUrl && (
            <p className="text-xs text-green-600 mt-2">✓ PDF file selected</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Optional: Upload a PDF version of the catalogue
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="rounded-lg">
            {isEditing ? 'Update Catalogue' : 'Create Catalogue'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
