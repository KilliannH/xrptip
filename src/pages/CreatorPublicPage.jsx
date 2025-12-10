import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { creatorsAPI } from "../api";
import { QRCodeModal } from "../components/QRCodeModal";
import { calculateFees } from "../utils/fees";
import { FeeBreakdown } from "../components/FeeBreakdown";
import { SEO } from "../components/SEO";
import { useCreatorTheme } from "../config/themes";

const PRESET_AMOUNTS = [1, 5, 10, 25];

export const CreatorPublicPage = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // ✅ Obtenir le thème du créateur
  const theme = useCreatorTheme(creator);

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
        setError(err.message || t('publicPage.notFound.title'));
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCreator();
    }
  }, [username, t]);

  const amountToSend = customAmount
    ? Number(customAmount)
    : selectedAmount ?? 0;

  // Calculer les frais
  const feeBreakdown = calculateFees(amountToSend);

  const handleSendTip = () => {
    if (!feeBreakdown.total || feeBreakdown.total <= 0) return;
    setShowQRModal(true);
    setShowHelp(true);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(creator.xrpAddress);
      // TODO: Ajouter un toast de confirmation
      alert(t('publicPage.addressCopied'));
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
            <h2 className="text-xl font-semibold text-white mb-2">{t('publicPage.notFound.title')}</h2>
            <p className="text-white/60 mb-6">
              {t('publicPage.notFound.description', { username })}
            </p>
            
            <a href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('publicPage.notFound.backHome')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${creator.displayName} (@${creator.username})`}
        description={creator.bio}
        image={creator.avatarUrl || creator.bannerUrl}
        url={`${window.location.origin}/u/${creator.username}`}
        type="profile"
        author={creator.displayName}
        keywords={`${creator.username}, XRP tips, crypto donations, XRPL`}
      />
      
      <div className="relative min-h-screen overflow-hidden py-12">
        {/* ✅ Background gradients avec le thème */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${theme.colors.primary}60 0%, transparent 50%),
                        radial-gradient(circle at 70% 60%, ${theme.colors.secondary}40 0%, transparent 50%)`
          }}
        />
        <div 
          className="absolute top-0 right-1/4 h-96 w-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.colors.primary }}
        />

        <div className="relative mx-auto max-w-2xl px-4">
          {/* Creator Profile Card */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
            {/* ✅ Banner avec gradient du thème */}
            <div className="relative h-48 overflow-hidden">
              {creator.bannerUrl ? (
                <>
                  <img 
                    src={creator.bannerUrl} 
                    alt={`${creator.displayName} banner`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${theme.colors.gradient}`}
                    style={{ display: 'none' }}
                  />
                </>
              ) : (
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${theme.colors.gradient}`}
                />
              )}
            </div>
            
            {/* Profile content */}
            <div className="relative px-6 pb-6">
              {/* ✅ Avatar avec border du thème */}
              <div className="relative -mt-16 mb-4">
                <div 
                  className="inline-block rounded-2xl border-4 border-xrpDark p-1"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
                  }}
                >
                  {creator.avatarUrl ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                      <img 
                        src={creator.avatarUrl} 
                        alt={creator.displayName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className={`absolute inset-0 hidden items-center justify-center bg-gradient-to-br ${theme.colors.gradient}`}
                      >
                        <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br ${theme.colors.gradient}`}>
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
                  {/* ✅ Badge avec le thème */}
                  <span 
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.colors.bg} ${theme.colors.text}`}
                  >
                    {t('publicPage.verifiedCreator')}
                  </span>
                </div>
                <p className="text-sm text-white/50">@{creator.username}</p>
                <p className="mt-2 text-white/70">{creator.bio}</p>
              </div>

              {/* Social links */}
              <div className="flex flex-wrap gap-2">
                {creator.links?.twitter && (
                  <a href={creator.links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all ${theme.colors.hover}`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X / Twitter</span>
                  </a>
                )}
                {creator.links?.youtube && (
                  <a href={creator.links.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                )}
                {creator.links?.tiktok && (
                  <a href={creator.links.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                )}
                {creator.links?.twitch && (
                  <a href={creator.links.twitch}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                    </svg>
                    <span>Twitch</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tip Section */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
              {/* ✅ Header avec gradient du thème */}
              <div 
                className="border-b border-white/5 px-6 py-4"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}10, ${theme.colors.secondary}10)`
                }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <span>💎</span>
                  <span>{t('publicPage.sendTip')}</span>
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  {t('publicPage.description')}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Amount selection */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white/80">
                    {t('publicPage.tipAmount')}
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
                            ? `${theme.colors.border} ${theme.colors.bg} ${theme.colors.text} shadow-lg ${theme.colors.shadow}`
                            : `border-white/10 bg-white/5 ${theme.colors.hover} hover:scale-105`
                        }`}
                      >
                        <span className="relative z-10">
                          {amount} XRP
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div 
                    className={`relative overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.02] transition-all ${theme.colors.hover}`}
                  >
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
                        placeholder={t('publicPage.customAmount')}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
                      />
                      <span className="text-sm font-medium text-white/50">XRP</span>
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown */}
                {amountToSend > 0 && (
                  <FeeBreakdown 
                    amount={feeBreakdown.amount}
                    fee={feeBreakdown.fee}
                    total={feeBreakdown.total}
                  />
                )}

                {/* ✅ Send button avec le thème */}
                <button
                  onClick={handleSendTip}
                  disabled={!feeBreakdown.total}
                  className="group relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:shadow-none hover:enabled:scale-[1.02]"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    boxShadow: `0 10px 25px -5px ${theme.colors.primary}4D`
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {feeBreakdown.total ? (
                      <>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span>{t('publicPage.showQR')}</span>
                      </>
                    ) : (
                      t('publicPage.chooseAmount')
                    )}
                  </span>
                  <div 
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.secondary}, ${theme.colors.primary})`
                    }}
                  />
                </button>

                {/* Alternative: Manual payment button */}
                {amountToSend > 0 && (
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className={`w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all ${theme.colors.hover}`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('publicPage.manualPayment')}</span>
                    </span>
                  </button>
                )}

                {/* XRP Address */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="mb-2 text-xs font-medium text-white/60">
                    {t('publicPage.creatorAddress')}
                  </p>
                  <div className="group flex items-center gap-2 rounded-xl bg-black/40 p-3">
                    <code className="flex-1 truncate text-xs text-white/70">
                      {creator.xrpAddress}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className={`shrink-0 rounded-lg bg-white/5 p-2 transition-all ${theme.colors.hover}`}
                      title={t('publicPage.copyAddress')}
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
              <div 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-3xl border shadow-xl backdrop-blur-xl"
                style={{
                  borderColor: `${theme.colors.primary}30`,
                  background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`
                }}
              >
                <div 
                  className="border-b px-6 py-4"
                  style={{
                    borderColor: `${theme.colors.primary}20`,
                    backgroundColor: `${theme.colors.primary}05`
                  }}
                >
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <svg className={`h-5 w-5 ${theme.colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('publicPage.howToFinalize')}
                  </p>
                </div>
                <div className="p-6">
                  <ol className="space-y-4 text-sm text-white/80">
                    <li className="flex gap-4">
                      <span 
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${theme.colors.bg} ${theme.colors.text}`}
                      >
                        1
                      </span>
                      <div>
                        <p className="font-medium text-white">{t('publicPage.steps.step1.title')}</p>
                        <p className="text-white/60">{t('publicPage.steps.step1.description')}</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span 
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${theme.colors.bg} ${theme.colors.text}`}
                      >
                        2
                      </span>
                      <div>
                        <p className="font-medium text-white">{t('publicPage.steps.step2.title')}</p>
                        <p className="text-white/60">{t('publicPage.steps.step2.description')}</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span 
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${theme.colors.bg} ${theme.colors.text}`}
                      >
                        3
                      </span>
                      <div>
                        <p className="font-medium text-white">{t('publicPage.steps.step3.title')}</p>
                        <p className="text-white/60">
                          <strong className={theme.colors.text}>{feeBreakdown.total} XRP</strong> {t('publicPage.steps.step3.description')}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span 
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white ${theme.colors.gradient}`}
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                        }}
                      >
                        ✓
                      </span>
                      <div>
                        <p className="font-medium text-white">{t('publicPage.steps.step4.title')}</p>
                        <p className="text-white/60">{t('publicPage.steps.step4.description')}</p>
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
            feeBreakdown={feeBreakdown}
          />
        )}
      </div>
    </>
  );
};