import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const EmailVerification = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = useRef([]);

  // Rediriger si pas d'email
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown pour le resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Accepter seulement les chiffres
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Prendre seulement le dernier caractère
    setCode(newCode);

    // Auto-focus sur le prochain input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit si tous les champs sont remplis
    if (index === 5 && value && newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    // Focus sur le dernier input rempli
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRefs.current[lastFilledIndex]?.focus();
    }

    // Auto-submit si 6 chiffres
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (verificationCode = null) => {
    const codeToVerify = verificationCode || code.join('');

    if (codeToVerify.length !== 6) {
      setError(t('auth.verifyEmail.enterCode'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        email,
        code: codeToVerify
      });

      // Sauvegarder le token
      localStorage.setItem('token', response.data.token);

      // Rediriger vers dashboard
      navigate('/dashboard', { 
        state: { message: t('auth.verifyEmail.success') } 
      });
    } catch (err) {
      setError(err.response?.data?.message || t('auth.verifyEmail.invalidCode'));
      // Réinitialiser les inputs en cas d'erreur
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError('');
    setResendSuccess(false);

    try {
      await axios.post(`${API_URL}/auth/resend-verification`, { email });
      setResendSuccess(true);
      setCountdown(60); // 60 secondes avant de pouvoir renvoyer à nouveau
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || t('auth.verifyEmail.resendError'));
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card principale */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-xrpBlue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('auth.verifyEmail.title')}
            </h1>
            <p className="text-white/70 text-sm">
              {t('auth.verifyEmail.subtitle')}
            </p>
            <p className="text-xrpBlue font-semibold mt-1">
              {email}
            </p>
          </div>

          {/* Success message */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm text-center">
                ✅ {t('auth.verifyEmail.codeSent')}
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm text-center">
                {error}
              </p>
            </div>
          )}

          {/* Code inputs */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center mb-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-white/30 focus:border-xrpBlue focus:outline-none focus:ring-2 focus:ring-xrpBlue/50 transition-all disabled:opacity-50"
                  placeholder="•"
                />
              ))}
            </div>
            <p className="text-white/50 text-xs text-center mt-2">
              {t('auth.verifyEmail.pasteHint')}
            </p>
          </div>

          {/* Verify button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || code.some(digit => digit === '')}
            className="w-full py-3 px-4 bg-gradient-to-r from-xrpBlue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-xrpBlue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('auth.verifyEmail.verifying')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('auth.verifyEmail.verify')}
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/50">
                {t('auth.verifyEmail.noCode')}
              </span>
            </div>
          </div>

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              t('auth.verifyEmail.resending')
            ) : countdown > 0 ? (
              t('auth.verifyEmail.resendIn', { seconds: countdown })
            ) : (
              t('auth.verifyEmail.resend')
            )}
          </button>

          {/* Helper text */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-white/70 text-xs text-center">
              {t('auth.verifyEmail.codeExpires')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            {t('auth.verifyEmail.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};