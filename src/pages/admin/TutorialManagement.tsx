import React, { useState } from 'react';
import { Upload, Plus, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TutorialService } from '../../services/tutorial.service';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function TutorialManagement() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Onboarding',
    videoUrl: '',
    thumbnailUrl: '',
    duration: 0,
    requiredForOnboarding: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload thumbnail if selected
      let thumbnailUrl = formData.thumbnailUrl;
      if (selectedFile) {
        const { data, error } = await supabase.storage
          .from('tutorial-thumbnails')
          .upload(`${Date.now()}-${selectedFile.name}`, selectedFile);

        if (error) throw error;
        thumbnailUrl = supabase.storage
          .from('tutorial-thumbnails')
          .getPublicUrl(data.path).data.publicUrl;
      }

      // Create tutorial
      await TutorialService.createTutorial({
        ...formData,
        thumbnailUrl,
        content: [{
          type: 'video',
          videoUrl: formData.videoUrl,
          duration: formData.duration,
          thumbnailUrl
        }]
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Onboarding',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 0,
        requiredForOnboarding: false,
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error creating tutorial:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Tutorial-Verwaltung</h1>
          <p className="mt-2 text-gray-400">
            Erstellen und verwalten Sie Tutorials für Ihre Kunden
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tutorial Form */}
          <div className="bg-[#25262b] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Neues Tutorial erstellen
            </h2>

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
                  <option value="Advanced">Fortgeschritten</option>
                  <option value="Expert">Experte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Video-URL
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1a1b1e] border border-gray-700 rounded-md text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Dauer (in Minuten)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
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
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
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
                {uploading ? 'Wird hochgeladen...' : 'Tutorial erstellen'}
              </button>
            </form>
          </div>

          {/* Tutorial List */}
          <div className="bg-[#25262b] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Vorhandene Tutorials
            </h2>
            {/* Tutorial list will be implemented here */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}