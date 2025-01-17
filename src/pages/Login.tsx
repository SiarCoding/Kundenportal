import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.isAdmin) {
        // Admin goes to admin dashboard
        navigate('/admin/dashboard');
      } else {
        // Regular user goes to user dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#1a1b1e] to-[#2d2e32]">
      {/* Left side */}
      <div className="flex-1 flex flex-col px-16 pt-16 pb-12">
        <div className="flex items-center space-x-4 mb-24">
          <div className="p-3 bg-yellow-400/10 rounded-xl">
            <Shield className="h-10 w-10 text-yellow-400" />
          </div>
          <span className="text-yellow-400 text-3xl font-bold tracking-tight">Kundenportal</span>
        </div>

        <div className="mb-20">
          <h1 className="text-4xl font-bold text-gray-100 mb-4 leading-tight whitespace-nowrap">
            Willkommen zum Kundenportal
          </h1>
          <p className="text-lg text-gray-400">
            Melden Sie sich an, um fortzufahren
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-5 bg-[#25262b]/50 p-5 rounded-xl border border-gray-800/50 hover:bg-[#25262b]/70 transition-all duration-300">
            <div className="flex-shrink-0 p-3 bg-yellow-400/10 rounded-lg">
              <Shield className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-100 mb-1">Sicherer Zugang</h3>
              <p className="text-sm text-gray-500">Ihre Daten sind bei uns sicher</p>
            </div>
          </div>

          <div className="flex items-center space-x-5 bg-[#25262b]/50 p-5 rounded-xl border border-gray-800/50 hover:bg-[#25262b]/70 transition-all duration-300">
            <div className="flex-shrink-0 p-3 bg-yellow-400/10 rounded-lg">
              <Globe className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-100 mb-1">24/7 Verfügbar</h3>
              <p className="text-sm text-gray-500">Zugriff rund um die Uhr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-end px-12 pb-32">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#25262b] rounded-xl p-8 shadow-2xl border border-gray-800/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1b1e] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Passwort
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1b1e] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#25262b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Wird geladen...' : 'Anmelden'}
              </button>

              <div className="space-y-4 text-center">
                <div>
                  <Link to="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                    Passwort vergessen?
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Noch kein Konto?{' '}
                    <Link to="/register" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                      Jetzt registrieren
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}