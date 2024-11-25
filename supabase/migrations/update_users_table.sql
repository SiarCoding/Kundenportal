-- Add is_admin column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update existing admin user
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@example.com';