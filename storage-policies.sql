-- Drop existing policies first
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users Can Upload Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users Can Update Own Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users Can Delete Own Avatars" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users Can Upload Avatars"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users Can Update Own Avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Users Can Delete Own Avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');