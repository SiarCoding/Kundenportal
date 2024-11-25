import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle, XCircle, Search } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Callback {
  id: string;
  user_id: string;
  user_email: string;
  phone_number: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export default function Callbacks() {
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCallbacks();
  }, []);

  const loadCallbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('callbacks')
        .select(`
          *,
          users (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCallbacks(data || []);
    } catch (error) {
      console.error('Error loading callbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'completed') => {
    try {
      const { error } = await supabase
        .from('callbacks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await loadCallbacks();
    } catch (error) {
      console.error('Error updating callback:', error);
    }
  };

  const filteredCallbacks = callbacks.filter(callback =>
    callback.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    callback.phone_number.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Rückrufanfragen</h1>
          <p className="mt-2 text-gray-400">
            Verwalten Sie eingehende Rückrufanfragen
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-xs">
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#25262b] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-[#25262b] rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Benutzer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Telefonnummer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Anfragedatum
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCallbacks.map((callback) => (
                <tr key={callback.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <PhoneCall className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">
                          {callback.user_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">
                      {callback.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {format(new Date(callback.created_at), 'PPp', { locale: de })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {callback.status === 'pending' ? (
                      <button
                        onClick={() => handleStatusChange(callback.id, 'completed')}
                        className="text-green-400 hover:text-green-300"
                        title="Als erledigt markieren"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(callback.id, 'pending')}
                        className="text-gray-400 hover:text-gray-300"
                        title="Als ausstehend markieren"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}