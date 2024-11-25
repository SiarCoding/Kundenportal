-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure users table exists with required columns
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    onboarding_complete BOOLEAN DEFAULT false,
    admin_id UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Create admin user
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
) ON CONFLICT (email) DO UPDATE 
SET 
    is_admin = true,
    is_approved = true,
    onboarding_complete = true;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own record"
ON users FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    admin_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
);

CREATE POLICY "Admins can update users"
ON users FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
);