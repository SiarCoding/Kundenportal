-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "enable_registration" ON users;
    DROP POLICY IF EXISTS "enable_read_access" ON users;
    DROP POLICY IF EXISTS "enable_update_access" ON users;
END $$;

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions
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
USING (true);

-- Ensure admin exists with proper permissions
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);