import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { creatorsAPI } from '../api';

export const Widget = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await creatorsAPI.getByUsername(username);
        setCreator(response.data);
      } catch (error) {
        console.error('Error loading creator:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCreator();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent">
        <div className="spinner" style={{ width: '32px', height: '32px' }} />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent">
        <p className="text-white text-sm">{t('widget.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-transparent p-4">
      
       <a href={`${window.location.origin}/u/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-2xl border-2 border-xrpBlue/50 bg-gradient-to-br from-slate-900/95 to-blue-900/95 px-6 py-4 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 hover:border-xrpBlue hover:shadow-xrpBlue/50"
      >
        {/* Logo XRP */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-xrpBlue to-cyan-500 shadow-lg">
          <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.8 4.5L16.2 9.1L12 4.9L7.8 9.1L3.2 4.5L1 6.7L7.8 13.5L12 9.3L16.2 13.5L23 6.7L20.8 4.5ZM20.8 13.5L16.2 18.1L12 13.9L7.8 18.1L3.2 13.5L1 15.7L7.8 22.5L12 18.3L16.2 22.5L23 15.7L20.8 13.5Z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {t('widget.tipMe')}
            </span>
            <span className="text-xrpBlue">💎</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">@{creator.username}</span>
            <span className="text-xs text-xrpBlue font-semibold">via XRP</span>
          </div>
        </div>

        {/* Arrow */}
        <svg 
          className="h-5 w-5 text-xrpBlue transition-transform group-hover:translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
};