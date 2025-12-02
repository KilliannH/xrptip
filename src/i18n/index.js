import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';

const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  }
};

i18n
  .use(LanguageDetector) // Détecte la langue du navigateur
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Langue par défaut
    debug: false, // Mettre à true pour déboguer
    
    interpolation: {
      escapeValue: false // React échappe déjà les valeurs
    },
    
    detection: {
      order: ['localStorage', 'navigator'], // Ordre de détection
      caches: ['localStorage'], // Où sauvegarder la langue choisie
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;