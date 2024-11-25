import React, { useState, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const [uploading, setUploading] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('logo_url')
        .single();
      
      if (data?.logo_url) {
        setLogo(data.logo_url);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage(null);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Bitte wählen Sie eine Datei aus.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `company-logo-${Date.now()}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('admin')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('admin')
        .getPublicUrl(fileName);

      // Update settings
      const { error: updateError } = await supabase
        .from('admin_settings')
        .upsert({ 
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      setLogo(publicUrl);
      setMessage({
        type: 'success',
        text: 'Logo wurde erfolgreich aktualisiert.'
      });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: 'Fehler beim Hochladen des Logos.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Einstellungen</h1>
          <p className="mt-2 text-gray-400">
            Verwalten Sie die Portaleinstellungen
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-[#25262b] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Unternehmenslogo
            </h2>

            {message && (
              <div className={`p-4 mb-6 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <p className={`text-sm ${
                  message.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {logo && (
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={logo}
                    alt="Unternehmenslogo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Logo hochladen
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-500">
                        <span>Datei auswählen</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG oder GIF bis 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}