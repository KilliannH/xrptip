import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { creatorsAPI } from "../api";
import { QRCodeModal } from "../components/QRCodeModal";

const PRESET_AMOUNTS = [1, 5, 10, 25];

export const CreatorPublicPage = () => {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Charger les données du créateur
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true);
        const response = await creatorsAPI.getByUsername(username);
        setCreator(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du créateur:", err);
        setError(err.message || "Créateur non trouvé");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCreator();
    }
  }, [username]);

  const amountToSend = customAmount
    ? Number(customAmount)
    : selectedAmount ?? 0;

  const handleSendTip = () => {
    if (!amountToSend || amountToSend <= 0) return;
    setShowQRModal(true);
    setShowHelp(true);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(creator.xrpAddress);
      // TODO: Ajouter un toast de confirmation
      alert("Adresse copiée !");
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="flex items-center justify-center py-20">
            <div className="spinner" style={{ width: '40px', height: '40px' }} />
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error || !creator) {
    return (
      <div className="relative min-h-screen overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Créateur non trouvé</h2>
            <p className="text-white/60 mb-6">
              Le créateur @{username} n'existe pas ou a été supprimé.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-xrpBlue/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4">
        {/* Creator Profile Card */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
          {/* Banner / Cover */}
          <div className="relative h-48 overflow-hidden">
            {creator.bannerUrl ? (
              <img 
                src={creator.bannerUrl} 
                alt={`${creator.displayName} banner`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Si l'image ne charge pas, afficher le gradient par défaut
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
            ) : null}
            {/* Fallback gradient (affiché si pas de banner ou erreur de chargement) */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-xrpBlue via-cyan-500 to-blue-600"
              style={{ display: creator.bannerUrl ? 'none' : 'block' }}
            />
          </div>
          
          {/* Profile content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <div className="inline-block rounded-2xl border-4 border-xrpDark bg-gradient-to-br from-xrpBlue via-cyan-400 to-blue-500 p-1">
                {creator.avatarUrl ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                    <img 
                      src={creator.avatarUrl} 
                      alt={creator.displayName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Si l'image ne charge pas, afficher le gradient par défaut
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback gradient */}
                    <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-xrpBlue to-cyan-400">
                      <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-xrpBlue to-cyan-400">
                    <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-xrpDark bg-green-500 shadow-lg">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Creator info */}
            <div className="mb-4">
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-2xl font-bold">{creator.displayName}</h1>
                <span className="rounded-full bg-xrpBlue/10 px-2.5 py-0.5 text-xs font-medium text-xrpBlue">
                  Créateur vérifié
                </span>
              </div>
              <p className="text-sm text-white/50">@{creator.username}</p>
              <p className="mt-2 text-white/70">{creator.bio}</p>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              {creator.links?.twitter && (
                <a
                  href={creator.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10"
                >
                  <svg className="h-4 w-4 transition-colors group-hover:text-xrpBlue" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="transition-colors group-hover:text-xrpBlue">X / Twitter</span>
                </a>
              )}
              {creator.links?.twitch && (
                <a
                  href={creator.links.twitch}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all hover:border-purple-500/50 hover:bg-purple-500/10"
                >
                  <svg className="h-4 w-4 transition-colors group-hover:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                  </svg>
                  <span className="transition-colors group-hover:text-purple-400">Twitch</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tip Section */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/5 bg-gradient-to-r from-xrpBlue/10 to-cyan-500/10 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <span>💎</span>
                <span>Soutenir ce créateur en XRP</span>
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Choisis un montant et envoie un tip via ton wallet XRP. Les
                transactions sont rapides et les frais très faibles.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/80">
                  Montant du tip (XRP)
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`group relative overflow-hidden rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                        selectedAmount === amount && !customAmount
                          ? "border-xrpBlue bg-gradient-to-br from-xrpBlue/20 to-cyan-500/10 text-xrpBlue shadow-lg shadow-xrpBlue/20"
                          : "border-white/10 bg-white/5 hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:scale-105"
                      }`}
                    >
                      <span className={`relative z-10 ${selectedAmount === amount && !customAmount ? "" : "transition-colors group-hover:text-xrpBlue"}`}>
                        {amount} XRP
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.02] transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/5">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="Montant personnalisé"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
                    />
                    <span className="text-sm font-medium text-white/50">XRP</span>
                  </div>
                </div>
              </div>

              {/* Send button */}
              <button
                onClick={handleSendTip}
                disabled={!amountToSend}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-xrpBlue to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-xrpBlue/30 transition-all hover:shadow-xl hover:shadow-xrpBlue/50 disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:shadow-none hover:enabled:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {amountToSend ? (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <span>Afficher le QR Code</span>
                    </>
                  ) : (
                    "Choisis un montant"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-xrpBlue opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              {/* Alternative: Manual payment button */}
              {amountToSend > 0 && (
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Instructions de paiement manuel</span>
                  </span>
                </button>
              )}

              {/* XRP Address */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="mb-2 text-xs font-medium text-white/60">
                  Adresse XRP de ce créateur
                </p>
                <div className="group flex items-center gap-2 rounded-xl bg-black/40 p-3">
                  <code className="flex-1 truncate text-xs text-white/70">
                    {creator.xrpAddress}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="shrink-0 rounded-lg bg-white/5 p-2 transition-all hover:bg-xrpBlue/20 hover:text-xrpBlue"
                    title="Copier l'adresse"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          {showHelp && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-3xl border border-xrpBlue/30 bg-gradient-to-br from-xrpBlue/10 to-cyan-500/10 shadow-xl backdrop-blur-xl">
              <div className="border-b border-xrpBlue/20 bg-xrpBlue/5 px-6 py-4">
                <p className="flex items-center gap-2 font-semibold text-white">
                  <svg className="h-5 w-5 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment finaliser ton tip ?
                </p>
              </div>
              <div className="p-6">
                <ol className="space-y-4 text-sm text-white/80">
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xrpBlue/20 font-bold text-xrpBlue">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-white">Ouvre ton wallet XRP</p>
                      <p className="text-white/60">Compatible: Xaman/XUMM, Crossmark, etc.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xrpBlue/20 font-bold text-xrpBlue">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-white">Colle l'adresse du créateur</p>
                      <p className="text-white/60">Utilise le bouton copier ci-dessus</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xrpBlue/20 font-bold text-xrpBlue">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-white">Entre le montant</p>
                      <p className="text-white/60">
                        <strong className="text-xrpBlue">{amountToSend} XRP</strong> dans ton wallet
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-xrpBlue to-cyan-500 font-bold text-white">
                      ✓
                    </span>
                    <div>
                      <p className="font-medium text-white">Confirme la transaction</p>
                      <p className="text-white/60">C'est tout ! Le tip sera envoyé en quelques secondes</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {creator && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          creator={creator}
          amount={amountToSend}
        />
      )}
    </div>
  );
};