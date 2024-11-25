-- Create CMS tables
CREATE TABLE IF NOT EXISTS cms_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('tutorial', 'document', 'video')),
    content JSONB NOT NULL,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cms_content_type ON cms_content(content_type);
CREATE INDEX IF NOT EXISTS idx_cms_content_status ON cms_content(status);
CREATE INDEX IF NOT EXISTS idx_cms_content_created_by ON cms_content(created_by);

-- Enable RLS
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow admins to manage content"
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

-- Create storage bucket for CMS content
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-content', 'cms-content', true)
ON CONFLICT (id) DO NOTHING;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_cms_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_cms_content_timestamp
    BEFORE UPDATE ON cms_content
    FOR EACH ROW
    EXECUTE FUNCTION update_cms_content_updated_at();