import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1b1e] p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#25262b] rounded-xl p-8 shadow-xl">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-yellow-400/10 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-yellow-400" strokeWidth={2.5} />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              Registrierung erfolgreich!
            </h2>
            <div className="space-y-4">
              <p className="text-gray-400 leading-relaxed">
                Vielen Dank für Ihre Registrierung. Ein Administrator wird Ihren Account
                in Kürze freischalten.
              </p>
              <div className="bg-[#1a1b1e] rounded-lg p-4 border border-gray-700">
                <p className="text-sm text-gray-400">
                  Status: <span className="text-yellow-400">Warten auf Freigabe</span>
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Sie werden per E-Mail benachrichtigt, sobald Ihr Zugang aktiviert wurde.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <Link
              to="/login"
              className="block w-full py-3 px-4 rounded-lg text-center text-black bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-[#25262b]"
            >
              Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}