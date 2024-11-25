-- Reset everything first
DROP POLICY IF EXISTS "Enable registration" ON users;
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "Enable update for users and admins" ON users;

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions
CREATE POLICY "Enable insert for registration"
ON users FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Enable select for all"
ON users FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Enable update for own record or admin"
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