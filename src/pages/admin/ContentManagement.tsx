import React, { useState, useEffect } from 'react';
import { Upload, Plus, FileText, Video, Image, Search } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { CMSService, CMSContent } from '../../services/cms.service';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type ContentType = 'tutorial' | 'document' | 'video';

export default function ContentManagement() {
  const [selectedType, setSelectedType] = useState<ContentType>('tutorial');
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Onboarding',
    content: '',
    thumbnailUrl: '',
    requiredForOnboarding: false
  });

  useEffect(() => {
    loadContent();
  }, [selectedType]);

  const loadContent = async () => {
    try {
      const data = await CMSService.fetchContents({ type: selectedType });
      setContents(data);
    } catch (error) {
      console.error('Fehler beim Laden der Inhalte:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      await CMSService.createContent({
        title: formData.title,
        content_type: selectedType,
        content: {
          description: formData.description,
          category: formData.category,
          url: formData.content,
          thumbnailUrl: formData.thumbnailUrl,
          requiredForOnboarding: formData.requiredForOnboarding
        },
        status: 'draft',
        created_by: (await supabase.auth.getUser()).data.user?.id || ''
      });

      setFormData({
        title: '',
        description: '',
        category: 'Onboarding',
        content: '',
        thumbnailUrl: '',
        requiredForOnboarding: false
      });

      await loadContent();
    } catch (error) {
      console.error('Fehler beim Erstellen des Inhalts:', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rest of the component remains the same...
  return (
    <AdminLayout>
      {/* Existing JSX remains the same... */}
    </AdminLayout>
  );
}