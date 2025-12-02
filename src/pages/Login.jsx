import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.requiresVerification) {
        navigate('/verify-email', { 
          state: { 
            email: result.email || email,
            fromLogin: true
          }
        });
      } else {
        setError(result.error || t('auth.login.error'));
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-xrpBlue/10 blur-3xl" />

      <div className="relative mx-auto max-w-md px-4">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/5 bg-gradient-to-r from-xrpBlue/10 to-cyan-500/10 px-6 py-6 text-center">
            <h1 className="text-2xl font-bold">{t('auth.login.title')}</h1>
            <p className="mt-2 text-sm text-white/60">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
                placeholder="ton@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                {t('auth.login.password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-xrpBlue hover:text-cyan-400 transition-colors"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-xrpBlue to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-xrpBlue/30 transition-all hover:shadow-xl hover:shadow-xrpBlue/50 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner" />
                  <span>{t('auth.login.loading')}</span>
                </span>
              ) : (
                t('auth.login.submit')
              )}
            </button>

            <div className="text-center text-sm text-white/60">
              {t('auth.login.noAccount')}{' '}
              <Link
                to="/register"
                className="font-semibold text-xrpBlue hover:text-cyan-400 transition-colors"
              >
                {t('auth.login.signUp')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};