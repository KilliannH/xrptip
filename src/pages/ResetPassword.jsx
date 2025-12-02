import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      await axios.get(`${API_URL}/auth/reset-password/${token}`);
      setTokenValid(true);
    } catch (err) {
      setError(err.response?.data?.message || t('auth.resetPassword.invalidToken'));
      setTokenValid(false);
    } finally {
      setValidatingToken(false);
    }
  };

  const validatePassword = () => {
    if (!password) {
      setError(t('auth.register.passwordTooShort'));
      return false;
    }

    if (password.length < 8) {
      setError(t('auth.register.passwordTooShort'));
      return false;
    }

    if (!/\d/.test(password)) {
      setError(t('auth.register.passwordNoDigit'));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t('auth.register.passwordMismatch'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t('auth.resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="spinner mb-4" style={{ width: '40px', height: '40px' }} />
          <p className="text-white/70">{t('auth.resetPassword.validating')}</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">
              {t('auth.resetPassword.invalidTokenTitle')}
            </h1>
            <p className="text-white/70 text-center mb-6">{error}</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full py-3 px-4 bg-gradient-to-r from-xrpBlue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-xrpBlue transition-all"
            >
              {t('auth.resetPassword.requestNewLink')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              {t('auth.resetPassword.success')}
            </h1>
            <p className="text-white/70 text-center mb-6">
              {t('auth.resetPassword.redirecting')}
            </p>
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
              {t('auth.resetPassword.title')}
            </h1>
            <p className="text-white/70 text-sm">
              {t('auth.resetPassword.subtitle')}
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
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                {t('auth.resetPassword.newPassword')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.resetPassword.passwordPlaceholder')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
                disabled={loading}
              />
              <p className="mt-2 text-xs text-white/50">
                {t('auth.register.passwordHint')}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                {t('auth.resetPassword.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
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
                  {t('auth.resetPassword.resetting')}
                </>
              ) : (
                t('auth.resetPassword.resetButton')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};