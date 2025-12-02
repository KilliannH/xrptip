import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError(t('auth.forgotPassword.emailRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || t('auth.forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              {t('auth.forgotPassword.emailSent')}
            </h1>
            <p className="text-white/70 text-center mb-6">
              {t('auth.forgotPassword.checkInbox', { email })}
            </p>

            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 mb-6">
              <p className="text-sm text-blue-200">
                💡 {t('auth.forgotPassword.linkExpires')}
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-gradient-to-r from-xrpBlue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-xrpBlue transition-all"
            >
              {t('auth.forgotPassword.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-xrpBlue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="text-white/70 text-sm">
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                {t('auth.forgotPassword.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-xrpBlue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-xrpBlue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('auth.forgotPassword.sending')}
                </>
              ) : (
                t('auth.forgotPassword.sendLink')
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← {t('auth.forgotPassword.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};