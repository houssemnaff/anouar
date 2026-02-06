import { supabase } from './supabase';

/**
 * Initialize Supabase Storage bucket if it doesn't exist
 * This should be called once during app initialization
 */
export async function initializeStorage() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'uploads');

    if (!bucketExists) {
      console.log('Creating uploads bucket...');
      
      
    } else {
      console.log('✅ Uploads bucket already exists');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}
