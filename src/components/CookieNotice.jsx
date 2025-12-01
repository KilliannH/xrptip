import { useState, useEffect } from 'react';

export const CookieNotice = () => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      // Attendre 1 seconde avant d'afficher (meilleure UX)
      setTimeout(() => setShowNotice(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowNotice(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-xrpBlue/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🍪 Cookies & Confidentialité
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Nous utilisons des cookies essentiels pour faire fonctionner xrpTip (authentification, préférences). 
                  Aucun cookie de tracking ou publicitaire. En continuant, vous acceptez notre utilisation des cookies.
                  {' '}
                  <a 
                    href="/privacy" 
                    className="text-xrpBlue hover:text-cyan-400 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    En savoir plus
                  </a>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleReject}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 transition-all text-sm font-medium"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-gradient-to-r from-xrpBlue to-cyan-500 text-white hover:shadow-lg hover:shadow-xrpBlue/50 transition-all text-sm font-semibold"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-white/5 px-6 py-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Cookies essentiels uniquement</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Aucun tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};