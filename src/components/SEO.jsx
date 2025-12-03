import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const SEO = ({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website',
  author,
  noindex = false
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const siteName = 'xrpTip';
  
  // Titres et descriptions par défaut selon la langue
  const defaultTitles = {
    en: 'xrpTip - Instant XRP Tips for Creators',
    fr: 'xrpTip - Tips XRP Instantanés pour Créateurs'
  };

  const defaultDescriptions = {
    en: 'Accept XRP tips instantly on XRPL. Fast, secure, and low-cost tipping platform for content creators, streamers, and artists.',
    fr: 'Acceptez des tips XRP instantanément sur XRPL. Plateforme de pourboires rapide, sécurisée et économique pour créateurs de contenu, streamers et artistes.'
  };

  const defaultTitle = defaultTitles[lang] || defaultTitles.en;
  const defaultDescription = defaultDescriptions[lang] || defaultDescriptions.en;
  const defaultImage = `${window.location.origin}/og-image.png`;
  const defaultUrl = window.location.origin;

  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || window.location.href;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'profile' ? 'ProfilePage' : 'WebSite',
    "name": siteName,
    "url": defaultUrl,
    "description": defaultDescription,
    "inLanguage": lang,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${defaultUrl}/u/{search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:creator" content="@xrptip" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1a8cff" />
      <meta name="application-name" content={siteName} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};