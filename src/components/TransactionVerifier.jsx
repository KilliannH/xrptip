import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { xrplAPI } from '../api';

export const TransactionVerifier = ({ tipId, onVerified }) => {
  const { t } = useTranslation();
  const [txHash, setTxHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!txHash.trim()) {
      setError(t('transactionVerifier.errors.enterHash'));
      return;
    }

    if (txHash.length !== 64) {
      setError(t('transactionVerifier.errors.invalidLength'));
      return;
    }

    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      const response = await xrplAPI.verifyTransaction(tipId, txHash);

      if (response.success) {
        setResult(response);
        if (onVerified) {
          onVerified(response);
        }
      } else {
        setError(response.message || t('transactionVerifier.errors.invalidTransaction'));
      }
    } catch (err) {
      console.error('Erreur lors de la vérification:', err);
      setError(err.message || t('transactionVerifier.errors.verificationFailed'));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="txHash" className="block text-sm font-medium text-white/80 mb-2">
          {t('transactionVerifier.label')}
        </label>
        <input
          type="text"
          id="txHash"
          value={txHash}
          onChange={(e) => {
            setTxHash(e.target.value);
            setError(null);
            setResult(null);
          }}
          placeholder={t('transactionVerifier.placeholder')}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
          maxLength={64}
        />
        <p className="mt-1 text-xs text-white/50">
          {t('transactionVerifier.hint')}
        </p>
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying || !txHash.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-xrpBlue to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-xrpBlue/30 transition-all hover:shadow-xl hover:shadow-xrpBlue/50 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-[1.02]"
      >
        {isVerifying ? (
          <span className="flex items-center justify-center gap-2">
            <div className="spinner" />
            <span>{t('transactionVerifier.verifying')}</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('transactionVerifier.verify')}</span>
          </span>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400">{t('transactionVerifier.errorTitle')}</p>
              <p className="mt-1 text-xs text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {result && result.success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-400">{t('transactionVerifier.successTitle')}</p>
              <p className="mt-1 text-xs text-green-300">{result.message}</p>
              
              {result.transaction && (
                <div className="mt-3 space-y-2 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>{t('transactionVerifier.details.amount')}:</span>
                    <span className="font-semibold text-green-400">
                      {result.transaction.amount} XRP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('transactionVerifier.details.from')}:</span>
                    <code className="text-xs">{result.transaction.from.slice(0, 10)}...</code>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('transactionVerifier.details.ledger')}:</span>
                    <span>{result.transaction.ledgerIndex}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};