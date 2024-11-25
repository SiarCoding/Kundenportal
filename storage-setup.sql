-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, ensure the storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users Can Upload Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users Can Update Own Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users Can Delete Own Avatars" ON storage.objects;

-- Create new policies with simplified conditions
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