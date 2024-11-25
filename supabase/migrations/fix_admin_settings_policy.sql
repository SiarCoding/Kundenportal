-- Drop existing policies
DROP POLICY IF EXISTS "Admin settings are viewable by all users" ON admin_settings;
DROP POLICY IF EXISTS "Admin settings are editable by admins" ON admin_settings;

-- Create new, more permissive policies
CREATE POLICY "Allow public read access"
ON admin_settings FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Allow admin write access"
ON admin_settings FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

CREATE POLICY "Allow admin update access"
ON admin_settings FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

-- Ensure default settings exist
INSERT INTO admin_settings (company_name, primary_color)
VALUES ('Kundenportal', '#EAB308')
ON CONFLICT DO NOTHING;