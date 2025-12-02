import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

export const LanguageSwitcher = ({ variant = 'default' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Variant compact (pour la navbar mobile)
  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-gradient-to-br from-xrpDark to-black p-2 shadow-xl backdrop-blur-xl z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  lang.code === i18n.language
                    ? 'bg-xrpBlue/10 text-xrpBlue'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === i18n.language && (
                  <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Variant par défaut
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <svg className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-gradient-to-br from-xrpDark to-black p-2 shadow-xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                lang.code === i18n.language
                  ? 'bg-xrpBlue/10 text-xrpBlue font-semibold'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.name}</span>
              {lang.code === i18n.language && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};