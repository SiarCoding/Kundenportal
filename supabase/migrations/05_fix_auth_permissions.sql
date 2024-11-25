-- Drop ALL existing policies first
DO $$ 
BEGIN
    -- Drop all policies from users table
    DROP POLICY IF EXISTS "Enable insert for registration" ON users;
    DROP POLICY IF EXISTS "Enable select for all" ON users;
    DROP POLICY IF EXISTS "Enable update for own record or admin" ON users;
    DROP POLICY IF EXISTS "Enable registration" ON users;
    DROP POLICY IF EXISTS "Enable read for all" ON users;
    DROP POLICY IF EXISTS "Enable update for own record or admin" ON users;
    DROP POLICY IF EXISTS "Users can view own record" ON users;
    DROP POLICY IF EXISTS "Admins can update users" ON users;
    DROP POLICY IF EXISTS "Allow public registration" ON users;
    DROP POLICY IF EXISTS "Allow email existence check" ON users;
    DROP POLICY IF EXISTS "Allow authenticated read" ON users;
    DROP POLICY IF EXISTS "Allow self update" ON users;
    DROP POLICY IF EXISTS "Enable public registration" ON users;
    DROP POLICY IF EXISTS "Enable read access" ON users;
    DROP POLICY IF EXISTS "Enable update for users and admins" ON users;
END $$;

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create fresh policies with proper permissions
CREATE POLICY "users_insert_policy"
ON users FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "users_select_policy"
ON users FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "users_update_policy"
ON users FOR UPDATE
TO PUBLIC
USING (
    auth.uid() = id OR
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = true
    )
);

-- Make sure admin exists with proper permissions
DELETE FROM users WHERE email = 'admin@example.com';
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

-- Drop existing indexes first
DROP INDEX IF EXISTS idx_users_email_password;
DROP INDEX IF EXISTS idx_users_is_admin;
DROP INDEX IF EXISTS idx_users_is_approved;

-- Recreate indexes for better performance
CREATE INDEX idx_users_email_password ON users(email, password);
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_users_is_approved ON users(is_approved);