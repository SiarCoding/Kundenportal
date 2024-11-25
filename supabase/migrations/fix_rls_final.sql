-- Drop all existing policies
DROP POLICY IF EXISTS "Public registration access" ON users;
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Disable RLS temporarily to ensure admin creation works
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Ensure admin user exists
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

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for users based on email"
ON users FOR UPDATE
TO authenticated
USING (
    auth.uid() = id OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);