-- Drop existing tables if they exist
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS cms_content CASCADE;

-- Create admin_settings table
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT,
    company_name TEXT DEFAULT 'Kundenportal',
    primary_color TEXT DEFAULT '#EAB308',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_content table
CREATE TABLE cms_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('tutorial', 'document', 'video')),
    content JSONB NOT NULL,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Allow public read access to admin_settings"
ON admin_settings FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Allow admin write access to admin_settings"
ON admin_settings FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

-- Create policies for cms_content
CREATE POLICY "Allow admin access to cms_content"
ON cms_content FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

CREATE POLICY "Allow users to view published content"
ON cms_content FOR SELECT
TO authenticated
USING (status = 'published');

-- Insert default admin settings
INSERT INTO admin_settings (company_name, primary_color)
VALUES ('Kundenportal', '#EAB308')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX idx_cms_content_type ON cms_content(content_type);
CREATE INDEX idx_cms_content_status ON cms_content(status);
CREATE INDEX idx_cms_content_created_by ON cms_content(created_by);