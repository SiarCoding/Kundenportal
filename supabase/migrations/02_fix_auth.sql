-- Reset policies
DROP POLICY IF EXISTS "Enable public registration" ON users;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users and admins" ON users;

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create more permissive policies for registration and auth
CREATE POLICY "Allow public registration"
ON users FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Allow email existence check"
ON users FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Allow authenticated read"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow self update"
ON users FOR UPDATE
TO authenticated
USING (
    auth.uid() = id OR
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = true
    )
);

-- Ensure admin exists with proper permissions
INSERT INTO users (
    id,
    email,
    password,
    first_name,
    last_name,
    is_admin,
    is_approved,
    onboarding_complete
) VALUES (
    gen_random_uuid(),
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