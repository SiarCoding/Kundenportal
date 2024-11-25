import React, { useState, useEffect } from 'react';
import { Copy, Share2, Check } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function PartnerProgram() {
  const { user } = useAuth();
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingReferrals: 0
  });

  useEffect(() => {
    if (user) {
      // Generate or fetch referral link
      const baseUrl = window.location.origin;
      const uniqueCode = btoa(user.id).substring(0, 8); // Simple encoding of user ID
      setReferralLink(`${baseUrl}/register?ref=${uniqueCode}`);

      // Fetch referral statistics
      fetchReferralStats();
    }
  }, [user]);

  const fetchReferralStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('status')
        .eq('referrer_id', user.id);

      if (error) throw error;

      const stats = {
        totalReferrals: data.length,
        activeReferrals: data.filter(ref => ref.status === 'active').length,
        pendingReferrals: data.filter(ref => ref.status === 'pending').length
      };

      setReferralStats(stats);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Partnerprogramm</h1>
            <p className="mt-2 text-gray-400">
              Empfehlen Sie uns weiter und profitieren Sie von unserem Partnerprogramm
            </p>
          </div>

          {/* Referral Link Section */}
          <div className="bg-[#25262b] rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Ihr persönlicher Empfehlungslink
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-[#1a1b1e] rounded-lg p-3 border border-gray-700">
                <code className="text-yellow-400">{referralLink}</code>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Kopieren</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  // Open share dialog if available
                  if (navigator.share) {
                    navigator.share({
                      title: 'Mein Empfehlungslink',
                      text: 'Registrieren Sie sich über meinen Empfehlungslink',
                      url: referralLink
                    });
                  }
                }}
                className="p-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#25262b] rounded-xl p-6">
              <div className="text-sm text-gray-400">Gesamt Empfehlungen</div>
              <div className="mt-2 text-3xl font-bold text-yellow-400">
                {referralStats.totalReferrals}
              </div>
            </div>
            <div className="bg-[#25262b] rounded-xl p-6">
              <div className="text-sm text-gray-400">Aktive Empfehlungen</div>
              <div className="mt-2 text-3xl font-bold text-green-400">
                {referralStats.activeReferrals}
              </div>
            </div>
            <div className="bg-[#25262b] rounded-xl p-6">
              <div className="text-sm text-gray-400">Ausstehende Empfehlungen</div>
              <div className="mt-2 text-3xl font-bold text-gray-400">
                {referralStats.pendingReferrals}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}