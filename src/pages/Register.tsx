import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
      });
      navigate('/registration-success');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#1a1b1e] to-[#2d2e32]">
      {/* Left side */}
      <div className="flex-1 flex flex-col px-16 py-16">
        <div className="flex items-center space-x-3 mb-20">
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <Shield className="h-6 w-6 text-yellow-400" />
          </div>
          <span className="text-yellow-400 text-2xl font-bold tracking-tight">Kundenportal</span>
        </div>

        <div className="flex-1 flex flex-col justify-center -mt-16">
          <div className="mb-16">
            <h1 className="text-3xl font-bold text-gray-100 mb-3 leading-tight whitespace-nowrap">
              Kundenportal Registrierung
            </h1>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-gray-300 transition-colors duration-200">AGB</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors duration-200">Datenschutz</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors duration-200">Docs</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors duration-200">Hilfe</Link>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center px-12 mt-32">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#25262b] rounded-xl p-8 shadow-2xl border border-gray-800/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    Vorname
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1b1e] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Nachname
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1b1e] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

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
                  minLength={8}
                />
                <p className="mt-2 text-sm text-gray-500">Mindestens 8 Zeichen</p>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#25262b] transition-all duration-300"
              >
                Registrieren
              </button>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Mit der Erstellung eines Kontos stimmen Sie den{' '}
                  <Link to="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                    Nutzungsbedingungen
                  </Link>{' '}
                  zu.
                </p>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Bereits registriert?{' '}
                    <Link to="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                      Anmelden
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