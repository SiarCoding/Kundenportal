import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { CMSService } from '../../services/cms.service';

interface ContentFormProps {
  onSuccess: () => void;
  contentType: 'tutorial' | 'document' | 'video';
}

export default function ContentForm({ onSuccess, contentType }: ContentFormProps) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Onboarding',
    content: '',
    thumbnailUrl: '',
    requiredForOnboarding: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      await CMSService.createContent({
        title: formData.title,
        content_type: contentType,
        content: {
          description: formData.description,
          category: formData.category,
          url: formData.content,
          thumbnailUrl: formData.thumbnailUrl,
          requiredForOnboarding: formData.requiredForOnboarding
        },
        status: 'draft'
      });

      setFormData({
        title: '',
        description: '',
        category: 'Onboarding',
        content: '',
        thumbnailUrl: '',
        requiredForOnboarding: false
      });

      onSuccess();
    } catch (error) {
      console.error('Fehler beim Erstellen des Inhalts:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Titel
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-[#1a1b1e] border border-gray-700 rounded-md text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Beschreibung
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-[#1a1b1e] border border-gray-700 rounded-md text-gray-100"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Kategorie
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 bg-[#1a1b1e] border border-gray-700 rounded-md text-gray-100"
        >
          <option value="Onboarding">Onboarding</option>
          <option value="Fortgeschritten">Fortgeschritten</option>
          <option value="Experte">Experte</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Content URL
        </label>
        <input
          type="url"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 bg-[#1a1b1e] border border-gray-700 rounded-md text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Thumbnail
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-400">
              <label className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-500">
                <span>Datei auswählen</span>
                <input type="file" className="sr-only" accept="image/*" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="requiredForOnboarding"
          checked={formData.requiredForOnboarding}
          onChange={(e) => setFormData({ ...formData, requiredForOnboarding: e.target.checked })}
          className="h-4 w-4 text-yellow-400 focus:ring-yellow-500 border-gray-700 rounded"
        />
        <label htmlFor="requiredForOnboarding" className="ml-2 text-sm text-gray-400">
          Pflicht für Onboarding
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium disabled:opacity-50"
      >
        {uploading ? 'Wird hochgeladen...' : 'Content erstellen'}
      </button>
    </form>
  );
}