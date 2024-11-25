-- Reset everything first
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_activity CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with all required fields
CREATE TABLE users (
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
    last_login TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Create user activity tracking
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user first (so it can be referenced as admin_id)
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
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users table policies
CREATE POLICY "Enable public registration"
ON users FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users"
ON users FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    admin_id = auth.uid() OR 
    is_admin = true
);

CREATE POLICY "Enable update for users and admins"
ON users FOR UPDATE
TO authenticated
USING (
    id = auth.uid() OR 
    is_admin = true
);

-- User activity policies
CREATE POLICY "Enable activity read for users and admins"
ON user_activity FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

CREATE POLICY "Enable activity insert for authenticated users"
ON user_activity FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_admin_id ON users(admin_id);
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_users_is_approved ON users(is_approved);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);