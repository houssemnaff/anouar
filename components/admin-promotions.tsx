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
          title: "Uploading image...",
          description: "Please wait while we upload the image.",
        });
        imageUrl = await uploadImage(imageFile, 'catalogues');
      }

      if (pdfFile) {
        toast({
          title: "Uploading PDF...",
          description: "Please wait while we upload the PDF file.",
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
          title: "Catalogue updated",
          description: "The catalogue has been updated successfully.",
        });
      } else {
        await addCatalogue(catalogueData);
        toast({
          title: "Catalogue added",
          description: "The new catalogue has been added successfully.",
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving catalogue:', error);
      
      let errorMessage = "Failed to upload files or save catalogue. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('row-level security') || error.message.includes('Permission denied')) {
          errorMessage = "Permission denied. Please configure Storage policies in Supabase Dashboard (see SUPABASE_STORAGE_SETUP.md)";
        } else if (error.message.includes('not found')) {
          errorMessage = 'Bucket "uploads" not found. Please create it in Supabase Dashboard.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (catalogueId: string) => {
    toast({
      title: "Confirm deletion",
      description: "Are you sure you want to delete this catalogue?",
      action: (
        <button
          onClick={async () => {
            try {
              await deleteCatalogue(catalogueId);
              toast({
                title: "Catalogue deleted",
                description: "The catalogue has been deleted successfully.",
                variant: "destructive",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to delete catalogue. Please try again.",
                variant: "destructive",
              });
            }
          }}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Delete
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
        title: "Visibility Updated",
        description: `Catalogue is now ${catalogue?.visible ? 'hidden' : 'visible'}.`,
      });
    } catch (error) {
      console.error('Error toggling catalogue visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update catalogue visibility. Please try again.",
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
      <CatalogueHeader onAddCatalogue={handleAddCatalogue} />

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
