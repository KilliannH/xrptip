import { useState } from 'react';
import { xrplAPI } from '../api';

export const SyncButton = ({ username, onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    setResult(null);

    try {
      const response = await xrplAPI.syncTransactions(username);

      if (response.success) {
        setResult(response.data);
        if (onSyncComplete) {
          onSyncComplete(response.data);
        }
      } else {
        setError(response.message || 'Erreur lors de la synchronisation');
      }
    } catch (err) {
      console.error('Erreur lors de la synchronisation:', err);
      setError(err.message || 'Erreur lors de la synchronisation');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg 
          className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser XRPL'}</span>
      </button>

      {/* Success Message */}
      {result && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-400">
                Synchronisation terminée !
              </p>
              <div className="mt-2 space-y-1 text-xs text-green-300">
                <p>✅ {result.newTips} nouveaux tips trouvés</p>
                <p>🔄 {result.updatedTips} tips mis à jour</p>
                <p>📊 {result.totalProcessed} transactions analysées</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400">Erreur</p>
              <p className="mt-1 text-xs text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};