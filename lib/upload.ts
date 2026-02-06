import { supabase } from './supabase';

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder path in storage (e.g., 'products', 'catalogues')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, folder: string = 'images'): Promise<string> {
  try {
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Upload attempt - User authenticated:', !!session);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      
      // More specific error messages
      if (uploadError.message.includes('row-level security')) {
        throw new Error('Permission denied. Please configure Storage policies in Supabase. See SUPABASE_STORAGE_SETUP.md');
      }
      if (uploadError.message.includes('not found')) {
        throw new Error('Bucket "uploads" not found. Please create it in Supabase Dashboard.');
      }
      
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload a PDF file to Supabase Storage
 * @param file - The PDF file to upload
 * @param folder - The folder path in storage (e.g., 'catalogues')
 * @returns The public URL of the uploaded PDF
 */
export async function uploadPDF(file: File, folder: string = 'pdfs'): Promise<string> {
  try {
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Upload attempt - User authenticated:', !!session);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      
      // More specific error messages
      if (uploadError.message.includes('row-level security')) {
        throw new Error('Permission denied. Please configure Storage policies in Supabase. See SUPABASE_STORAGE_SETUP.md');
      }
      if (uploadError.message.includes('not found')) {
        throw new Error('Bucket "uploads" not found. Please create it in Supabase Dashboard.');
      }
      
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param url - The public URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // Extract the file path from the public URL
    const urlParts = url.split('/uploads/');
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
