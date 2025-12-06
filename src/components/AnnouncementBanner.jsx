import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const AnnouncementBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  
  // Clé unique pour cette bannière (changer si vous voulez réafficher)
  const BANNER_KEY = 'banner_giveaway_50xrp_2024';

  useEffect(() => {
    // Vérifier si la bannière a été fermée
    const dismissed = localStorage.getItem(BANNER_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-xrpBlue via-cyan-500 to-blue-600">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Icon & Text */}
          <div className="flex flex-1 items-center justify-center gap-3">
            {/* Icon */}
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm animate-bounce">
              <span className="text-2xl">🎁</span>
            </div>

            {/* Text content */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-white">
                {t('banner.giveaway.title')}
              </span>
              <span className="text-xs sm:text-sm text-white/90">
                {t('banner.giveaway.subtitle')}
              </span>
            </div>

            {/* CTA Button */}
            
             <a href="https://x.com/xrptipcom" // Remplacer par votre lien
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-xrpBlue transition-all hover:scale-105 hover:shadow-lg"
            >
              <span>{t('banner.giveaway.cta')}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Right side - Close button */}
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
            aria-label={t('banner.close')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile CTA */}
        <div className="mt-2 md:hidden">
          
           <a href="https://x.com/xrptipcom" // Remplacer par votre lien
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-xrpBlue transition-all hover:scale-105"
          >
            <span>{t('banner.giveaway.cta')}</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};