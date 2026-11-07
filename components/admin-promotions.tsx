'use client';

import React from "react"

import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, uploadPDF } from '@/lib/upload';
import { CatalogueHeader } from './admin-promotions/catalogue-header';
import { CatalogueForm } from './admin-promotions/catalogue-form';
import { CatalogueGrid } from './admin-promotions/catalogue-grid';
import { EmptyCatalogues } from './admin-promotions/empty-catalogues';

interface NewCatalogue {
  title: string;
  description: string;
  image: string;
  pdfUrl: string;
}

export function AdminPromotions() {
  const { catalogues, toggleCatalogueVisibility, addCatalogue, updateCatalogue, deleteCatalogue } = useStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCatalogueId, setEditingCatalogueId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewCatalogue>({
    title: '',
    description: '',
    image: '',
    pdfUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image') {
        setImageFile(file);
        // Create preview URL for display
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        setPdfFile(file);
        // Store the file, actual upload happens on submit
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, pdfUrl: previewUrl }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload files to Supabase Storage if new files are selected
      let imageUrl = formData.image;
      let pdfUrl = formData.pdfUrl;

      if (imageFile) {
        toast({
          title: "Téléversement de l'image...",
          description: "Veuillez patienter pendant le téléchargement.",
        });
        imageUrl = await uploadImage(imageFile, 'catalogues');
      }

      if (pdfFile) {
        toast({
          title: "Téléversement du PDF...",
          description: "Veuillez patienter pendant le téléchargement.",
        });
        pdfUrl = await uploadPDF(pdfFile, 'catalogues');
      }

      const catalogueData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        pdfUrl: pdfUrl || undefined,
      };

      if (editingCatalogueId) {
        await updateCatalogue(editingCatalogueId, catalogueData);
        toast({
          title: "Catalogue modifié",
          description: "Le catalogue a été mis à jour avec succès.",
        });
      } else {
        await addCatalogue(catalogueData);
        toast({
          title: "Catalogue ajouté",
          description: "Le nouveau catalogue a été ajouté avec succès.",
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving catalogue:', error);
      
      let errorMessage = "Échec du téléversement des fichiers ou de l'enregistrement. Veuillez réessayer.";
      
      if (error instanceof Error) {
        if (error.message.includes('row-level security') || error.message.includes('Permission denied')) {
          errorMessage = "Autorisation refusée. Veuillez configurer les règles de Stockage dans The Supabase Dashboard.";
        } else if (error.message.includes('not found')) {
          errorMessage = 'Bucket "uploads" introuvable. Veuillez le créer dans le Dashboard Supabase.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (catalogueId: string) => {
    toast({
      title: "Confirmer la suppression",
      description: "Voulez-vous vraiment supprimer ce catalogue ?",
      action: (
        <button
          onClick={async () => {
            try {
              await deleteCatalogue(catalogueId);
              toast({
                title: "Catalogue supprimé",
                description: "Le catalogue a été supprimé avec succès.",
                variant: "destructive",
              });
            } catch (error) {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le catalogue. Veuillez réessayer.",
                variant: "destructive",
              });
            }
          }}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Supprimer
        </button>
      ),
    });
  };

  const handleEdit = (catalogueId: string) => {
    const catalogue = catalogues.find(c => c.id === catalogueId);
    if (catalogue) {
      setFormData({
        title: catalogue.title,
        description: catalogue.description,
        image: catalogue.image,
        pdfUrl: catalogue.pdfUrl || '',
      });
      setImageFile(null);
      setPdfFile(null);
      setEditingCatalogueId(catalogueId);
      setShowForm(true);
    }
  };

  const handleToggleVisibility = async (catalogueId: string) => {
    try {
      await toggleCatalogueVisibility(catalogueId);
      const catalogue = catalogues.find(c => c.id === catalogueId);
      toast({
        title: "Visibilité mise à jour",
        description: catalogue?.visible
          ? 'Le catalogue est maintenant visible pour les clients.'
          : 'Le catalogue est maintenant masqué pour les clients.',
      });
    } catch (error) {
      console.error('Error toggling catalogue visibility:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleAddCatalogue = () => {
    if (showForm && !editingCatalogueId) {
      setShowForm(false);
    } else {
      resetForm();
      setShowForm(true);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      pdfUrl: '',
    });
    setImageFile(null);
    setPdfFile(null);
    setShowForm(false);
    setEditingCatalogueId(null);
  };

  return (
    <div className="space-y-8">
      <CatalogueHeader onAddCatalogue={handleAddCatalogue} catalogues={catalogues} />

      {showForm && (
        <CatalogueForm
          formData={formData}
          isEditing={!!editingCatalogueId}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {catalogues.length > 0 ? (
        <CatalogueGrid
          catalogues={catalogues}
          onToggleVisibility={handleToggleVisibility}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyCatalogues onAddCatalogue={() => setShowForm(true)} />
      )}
    </div>
  );
}
