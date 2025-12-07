import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { creatorsAPI } from "../api";

export const Creators = () => {
  const { t } = useTranslation();
  const [creators, setCreators] = useState([]); // ✅ Initialisé avec un tableau vide
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const response = await creatorsAPI.getAll();
      // ✅ Vérifier que response.data est bien un tableau
      setCreators(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      setCreators([]); // ✅ En cas d'erreur, mettre un tableau vide
    } finally {
      setLoading(false);
    }
  };

  // Filtrer et trier les créateurs
  const filteredCreators = creators
    .filter(creator => 
      creator.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.stats?.totalTips || 0) - (a.stats?.totalTips || 0);
        case 'alphabetical':
          return (a.displayName || '').localeCompare(b.displayName || '');
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  return (
    <>
      <SEO
        title={t('creators.seo.title')}
        description={t('creators.seo.description')}
        keywords="XRP creators, crypto tipping, XRPL creators, content creators, streamers"
      />

      <div className="relative min-h-screen overflow-hidden py-12">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-xrpBlue/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-xrpBlue/30 bg-xrpBlue/10 px-4 py-2 text-sm font-medium text-xrpBlue backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-xrpBlue opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-xrpBlue" />
              </span>
              {t('creators.badge')}
            </div>

            <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              {t('creators.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/70">
              {t('creators.subtitle')}
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
                <div className="text-3xl font-bold text-xrpBlue">{creators.length}</div>
                <div className="text-sm text-white/60">{t('creators.stats.totalCreators')}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
                <div className="text-3xl font-bold text-green-400">
                  {creators.reduce((sum, c) => sum + (c.stats?.totalTips || 0), 0)}
                </div>
                <div className="text-sm text-white/60">{t('creators.stats.totalTips')}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
                <div className="text-3xl font-bold text-purple-400">
                  {creators.reduce((sum, c) => sum + (c.stats?.totalAmount || 0), 0).toFixed(2)} XRP
                </div>
                <div className="text-sm text-white/60">{t('creators.stats.totalVolume')}</div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-md">
              <svg 
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('creators.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-white/40 backdrop-blur-xl transition-all focus:border-xrpBlue/50 focus:outline-none focus:ring-2 focus:ring-xrpBlue/50"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              {['newest', 'popular', 'alphabetical'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    sortBy === sort
                      ? 'bg-xrpBlue text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {t(`creators.sort.${sort}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Creators grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner" style={{ width: '40px', height: '40px' }} />
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
              <svg className="mx-auto h-16 w-16 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg text-white/70">{t('creators.noResults')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator._id} creator={creator} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Composant Card pour chaque créateur
const CreatorCard = ({ creator }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ✅ Importer useNavigate depuis react-router-dom

  const handleCardClick = (e) => {
    // Ne pas naviguer si on clique sur un lien social
    if (e.target.closest('a[data-social-link]')) {
      return;
    }
    navigate(`/u/${creator.username}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-lg backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-xrpBlue/30 hover:shadow-2xl hover:shadow-xrpBlue/20 cursor-pointer"
    >
      {/* Banner */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-xrpBlue/20 to-cyan-500/20">
        {creator.bannerUrl ? (
          <img
            src={creator.bannerUrl}
            alt={creator.displayName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/30 to-cyan-500/30" />
        )}
        
        {/* Verified badge */}
        {(creator.stats?.totalTips || 0) > 10 && (
          <div className="absolute top-3 right-3 rounded-full bg-green-500/20 px-2 py-1 backdrop-blur-xl">
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-green-400">{t('creators.verified')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6">
        {/* Avatar */}
        <div className="absolute -top-10 left-6">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800">
            {creator.avatarUrl ? (
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-xrpBlue to-cyan-500 text-2xl font-bold text-white">
                {creator.displayName?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>

        {/* Text content */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white group-hover:text-xrpBlue transition-colors">
            {creator.displayName}
          </h3>
          <p className="text-sm text-white/60">@{creator.username}</p>
          
          <p className="mt-3 line-clamp-2 text-sm text-white/70">
            {creator.bio}
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{creator.stats?.totalTips || 0} {t('creators.card.tips')}</span>
            </div>
            
            {(creator.stats?.totalAmount || 0) > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-green-400">💎</span>
                <span>{(creator.stats?.totalAmount || 0).toFixed(2)} XRP</span>
              </div>
            )}
          </div>

          {/* Social links */}
          {(creator.links?.twitter || creator.links?.youtube || creator.links?.twitch || creator.links?.tiktok) && (
            <div className="mt-4 flex gap-2">
              {creator.links.twitter && (
                <a  
                  href={creator.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social-link="true"
                  className="rounded-lg bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-blue-400 z-10 relative"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {creator.links.youtube && (
                <a  
                  href={creator.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social-link="true"
                  className="rounded-lg bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-red-500 z-10 relative"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {creator.links.twitch && (
                <a  
                  href={creator.links.twitch}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social-link="true"
                  className="rounded-lg bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-purple-500 z-10 relative"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                </a>
              )}
              {creator.links.tiktok && (
                <a  
                  href={creator.links.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social-link="true"
                  className="rounded-lg bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white z-10 relative"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Hover effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-xrpBlue to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
};