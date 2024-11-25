import { supabase } from './supabase';

export async function setupSupabase() {
  try {
    // Create storage buckets
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Setup admin bucket
    const adminBucket = buckets?.find(bucket => bucket.name === 'admin');
    if (!adminBucket) {
      await supabase.storage.createBucket('admin', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });
    }

    // Setup avatars bucket
    const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
    if (!avatarBucket) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });
    }

    // Setup CMS content bucket
    const cmsBucket = buckets?.find(bucket => bucket.name === 'cms-content');
    if (!cmsBucket) {
      await supabase.storage.createBucket('cms-content', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 500,
        allowedMimeTypes: [
          'video/mp4',
          'video/webm',
          'image/jpeg',
          'image/png',
          'application/pdf'
        ]
      });
    }

    // Ensure admin settings exist
    const { data: existingSettings } = await supabase
      .from('admin_settings')
      .select('id')
      .limit(1);

    if (!existingSettings?.length) {
      await supabase
        .from('admin_settings')
        .insert([{
          company_name: 'Kundenportal',
          primary_color: '#EAB308'
        }]);
    }

    console.log('Supabase setup completed successfully');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    throw error;
  }
}