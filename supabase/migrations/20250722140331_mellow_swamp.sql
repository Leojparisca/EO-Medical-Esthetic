/*
  # Create Storage Bucket for Avatars

  1. Storage
    - Create `avatars` bucket for user profile pictures
    - Enable public access for avatar images
    - Add RLS policies for avatar uploads

  2. Security
    - Users can upload their own avatars
    - Anyone can view avatar images (public bucket)
*/

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create policy to allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow anyone to view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'avatars');