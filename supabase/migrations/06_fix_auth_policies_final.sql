-- Drop ALL existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "users_insert_policy" ON users;
    DROP POLICY IF EXISTS "users_select_policy" ON users;
    DROP POLICY IF EXISTS "users_update_policy" ON users;
END $$;

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create fresh policies with proper permissions
CREATE POLICY "allow_registration"
ON users FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "allow_read_own_or_admin"
ON users FOR SELECT
TO PUBLIC
USING (
    email = current_user OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.email = current_user
        AND users.is_admin = true
    )
);

CREATE POLICY "allow_update_own_or_admin"
ON users FOR UPDATE
TO PUBLIC
USING (
    email = current_user OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.email = current_user
        AND users.is_admin = true
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

-- Drop and recreate indexes
DROP INDEX IF EXISTS idx_users_email_password;
DROP INDEX IF EXISTS idx_users_is_admin;
DROP INDEX IF EXISTS idx_users_is_approved;

CREATE INDEX idx_users_email_password ON users(email, password);
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_users_is_approved ON users(is_approved);