import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function Support() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Support</h1>
          <p className="mt-2 text-gray-400">
            Wir sind für Sie da. Wählen Sie einen Kommunikationskanal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Support */}
          <div className="bg-[#25262b] rounded-xl p-6 hover:bg-[#2c2d31] transition-all transform hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mb-4">
              <MessageCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">WhatsApp Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Direkter Chat-Support über WhatsApp für schnelle Hilfe.
            </p>
            <a
              href="https://wa.me/+491234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp öffnen
            </a>
          </div>

          {/* Telefon Support */}
          <div className="bg-[#25262b] rounded-xl p-6 hover:bg-[#2c2d31] transition-all transform hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-400/10 rounded-lg mb-4">
              <Phone className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Telefon Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Persönliche Beratung von Mo-Fr, 9-17 Uhr.
            </p>
            <a
              href="tel:+491234567890"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              +49 123 456 7890
            </a>
          </div>

          {/* E-Mail Support */}
          <div className="bg-[#25262b] rounded-xl p-6 hover:bg-[#2c2d31] transition-all transform hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mb-4">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">E-Mail Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Detaillierte Anfragen per E-Mail mit 24h Reaktionszeit.
            </p>
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              E-Mail senden
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Häufig gestellte Fragen</h2>
          <div className="space-y-4">
            <div className="bg-[#25262b] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Wie kann ich mein Passwort zurücksetzen?
              </h3>
              <p className="text-gray-400">
                Klicken Sie auf der Login-Seite auf "Passwort vergessen" und folgen Sie den Anweisungen.
              </p>
            </div>
            <div className="bg-[#25262b] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Wie lange dauert das Onboarding?
              </h3>
              <p className="text-gray-400">
                Das Onboarding dauert in der Regel 30-45 Minuten. Sie können es jederzeit unterbrechen und später fortsetzen.
              </p>
            </div>
            <div className="bg-[#25262b] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Wie kann ich meine Rechnung einsehen?
              </h3>
              <p className="text-gray-400">
                Ihre Rechnungen finden Sie im Bereich "Einstellungen" unter dem Punkt "Rechnungen & Abonnement".
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}