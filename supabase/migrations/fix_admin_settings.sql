-- Drop existing admin_settings table and related objects
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP FUNCTION IF EXISTS update_admin_settings_updated_at CASCADE;

-- Recreate admin_settings table
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT,
    company_name TEXT DEFAULT 'Kundenportal',
    primary_color TEXT DEFAULT '#EAB308',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin settings are viewable by all users"
ON admin_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin settings are editable by admins"
ON admin_settings FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

-- Create storage bucket for admin assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin', 'admin', true)
ON CONFLICT (id) DO NOTHING;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_admin_settings_timestamp
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_settings_updated_at();

-- Insert default settings
INSERT INTO admin_settings (company_name)
VALUES ('Kundenportal')
ON CONFLICT DO NOTHING;