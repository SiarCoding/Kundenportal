-- First, remove the existing foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_admin_id_fkey;

-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "allow_registration" ON users;
    DROP POLICY IF EXISTS "allow_read_own_or_admin" ON users;
    DROP POLICY IF EXISTS "allow_update_own_or_admin" ON users;
END $$;

-- Recreate the users table with correct structure
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT,
    is_admin BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    onboarding_complete BOOLEAN DEFAULT false,
    admin_id UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Add the foreign key with ON DELETE SET NULL
ALTER TABLE users
ADD CONSTRAINT fk_admin_id
FOREIGN KEY (admin_id)
REFERENCES users(id)
ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "enable_registration"
ON users FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "enable_read_access"
ON users FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "enable_update_access"
ON users FOR UPDATE
TO PUBLIC
USING (
    id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = true
    )
);

-- Ensure admin exists
INSERT INTO users (
    email,
    password,
    first_name,
    last_name,
    is_admin,
    is_approved,
    onboarding_complete
) VALUES (
    'admin@example.com',
    'admin123',
    'Admin',
    'User',
    true,
    true,
    true
) ON CONFLICT (email) 
DO UPDATE SET 
    is_admin = true,
    is_approved = true,
    onboarding_complete = true;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON users(admin_id);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);