import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProfileForm } from "../components/ProfileForm";
import { SyncButton } from "../components/SyncButton";
import { tipsAPI, creatorsAPI } from "../api";
import { WidgetGenerator } from "../components/WidgetGenerator";
import { useAuth } from "../contexts/AuthContext";

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentUsername, setCurrentUsername] = useState("");
  const [stats, setStats] = useState({
    totalTips: 0,
    totalAmount: 0,
    uniqueSupporters: 0,
    monthlyAmount: 0
  });
  const [recentTips, setRecentTips] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Charger les stats quand le username change
  useEffect(() => {
    if (currentUsername) {
      loadStats();
    }
  }, [currentUsername]);

  const loadStats = async () => {
    if (!currentUsername) return;

    try {
      setLoadingStats(true);

      // Charger les statistiques
      const statsResponse = await tipsAPI.getStats(currentUsername);
      setStats({
        totalTips: statsResponse.data.allTime.totalTips || 0,
        totalAmount: statsResponse.data.allTime.totalAmount || 0,
        uniqueSupporters: statsResponse.data.allTime.uniqueSupporters || 0,
        monthlyAmount: statsResponse.data.last30Days.totalAmount || 0
      });

      // Charger les tips récents
      const tipsResponse = await tipsAPI.getByCreator(currentUsername, {
        limit: 10,
        status: 'confirmed'
      });
      setRecentTips(tipsResponse.data || []);

    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSyncComplete = (data) => {
    console.log('Sync complete:', data);
    // Recharger les stats après synchronisation
    loadStats();
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-xrpBlue/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="mt-2 text-white/60">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`rounded-t-xl px-6 py-3 font-semibold transition-all ${activeTab === "profile"
              ? "border-b-2 border-xrpBlue bg-xrpBlue/10 text-xrpBlue"
              : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('dashboard.tabs.profile')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`rounded-t-xl px-6 py-3 font-semibold transition-all ${activeTab === "stats"
              ? "border-b-2 border-xrpBlue bg-xrpBlue/10 text-xrpBlue"
              : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('dashboard.tabs.stats')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("widget")}
            className={`rounded-t-xl px-6 py-3 font-semibold transition-all ${activeTab === "widget"
              ? "border-b-2 border-xrpBlue bg-xrpBlue/10 text-xrpBlue"
              : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Widget
            </span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`rounded-t-xl px-6 py-3 font-semibold transition-all ${activeTab === "settings"
              ? "border-b-2 border-xrpBlue bg-xrpBlue/10 text-xrpBlue"
              : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
          >
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('dashboard.tabs.settings')}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile Form Card */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/5 bg-gradient-to-r from-xrpBlue/10 to-cyan-500/10 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <svg className="h-5 w-5 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('dashboard.profile.title')}
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  {t('dashboard.profile.subtitle')}
                </p>
              </div>
              <div className="p-6">
                <ProfileForm onUsernameChange={setCurrentUsername} />
              </div>
            </div>

            {/* Preview Card */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {t('dashboard.preview.title')}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-white/60 mb-4">
                  {t('dashboard.preview.description')}
                </p>
                <div className="rounded-xl border border-xrpBlue/30 bg-xrpBlue/10 px-4 py-3">
                  <code className="text-sm text-xrpBlue">
                    {t('dashboard.preview.urlPreview', { username: currentUsername || 'username' })}
                  </code>
                </div>
                {currentUsername && (

                  <a href={`/u/${currentUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('dashboard.preview.viewPublic')}
                  </a>
                )}
                <p className="mt-4 text-xs text-white/50">
                  💡 {currentUsername ? t('dashboard.preview.profileLive') : t('dashboard.preview.hint')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Sync Button */}
            <div className="flex justify-end">
              <SyncButton
                username={currentUsername}
                onSyncComplete={handleSyncComplete}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-xrpBlue/30 hover:shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-white/60">{t('dashboard.stats.tipsReceived')}</p>
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {loadingStats ? (
                    <span className="inline-block h-9 w-16 animate-pulse rounded bg-white/10" />
                  ) : (
                    stats.totalTips
                  )}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {loadingStats ? (
                    <span className="inline-block h-4 w-20 animate-pulse rounded bg-white/10" />
                  ) : (
                    `${stats.totalAmount.toFixed(2)} XRP`
                  )}
                </p>
              </div>

              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-xrpBlue/30 hover:shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-white/60">{t('dashboard.stats.supporters')}</p>
                  <div className="rounded-lg bg-xrpBlue/10 p-2">
                    <svg className="h-5 w-5 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {loadingStats ? (
                    <span className="inline-block h-9 w-16 animate-pulse rounded bg-white/10" />
                  ) : (
                    stats.uniqueSupporters
                  )}
                </p>
                <p className="mt-1 text-sm text-white/50">{t('dashboard.stats.uniquePersons')}</p>
              </div>

              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-xrpBlue/30 hover:shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-white/60">{t('dashboard.stats.thisMonth')}</p>
                  <div className="rounded-lg bg-cyan-500/10 p-2">
                    <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {loadingStats ? (
                    <span className="inline-block h-9 w-16 animate-pulse rounded bg-white/10" />
                  ) : (
                    stats.monthlyAmount.toFixed(2)
                  )}
                </p>
                <p className="mt-1 text-sm text-white/50">XRP</p>
              </div>
            </div>

            {/* Recent Tips Table */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/5 bg-gradient-to-r from-xrpBlue/10 to-cyan-500/10 px-6 py-4">
                <h2 className="text-lg font-semibold">{t('dashboard.stats.recentTips')}</h2>
              </div>
              <div className="p-6">
                {loadingStats ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : recentTips.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                      <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-white/60">{t('dashboard.stats.noTips')}</p>
                    <p className="mt-2 text-sm text-white/40">
                      {t('dashboard.stats.sharePage')}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="pb-3 text-left text-xs font-medium text-white/60">{t('dashboard.stats.date')}</th>
                          <th className="pb-3 text-left text-xs font-medium text-white/60">{t('dashboard.stats.amount')}</th>
                          <th className="pb-3 text-left text-xs font-medium text-white/60">{t('dashboard.stats.from')}</th>
                          <th className="pb-3 text-left text-xs font-medium text-white/60">{t('dashboard.stats.message')}</th>
                          <th className="pb-3 text-right text-xs font-medium text-white/60">{t('dashboard.stats.status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentTips.map((tip) => (
                          <tr key={tip._id} className="group hover:bg-white/5">
                            <td className="py-3 text-sm text-white/80">
                              {new Date(tip.createdAt).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 text-sm font-semibold text-green-400">
                              {tip.amount} XRP
                            </td>
                            <td className="py-3 text-sm text-white/70">
                              {tip.senderAddress ? (
                                <code className="text-xs">
                                  {tip.senderAddress.slice(0, 8)}...{tip.senderAddress.slice(-6)}
                                </code>
                              ) : (
                                <span className="text-white/40">{t('dashboard.stats.anonymous')}</span>
                              )}
                            </td>
                            <td className="py-3 text-sm text-white/60">
                              {tip.message ? (
                                <span className="line-clamp-1">{tip.message}</span>
                              ) : (
                                <span className="text-white/30">-</span>
                              )}
                            </td>
                            <td className="py-3 text-right">
                              {tip.status === 'confirmed' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  {t('dashboard.stats.confirmed')}
                                </span>
                              ) : tip.status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400">
                                  <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {t('dashboard.stats.pending')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                                  {t('dashboard.stats.failed')}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "widget" && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {t('dashboard.widget.title')}
              </h2>
              <p className="mt-1 text-sm text-white/60">
                {t('dashboard.widget.subtitle')}
              </p>
            </div>
            <div className="p-6">
              <WidgetGenerator username={currentUsername} />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-4">
              <h2 className="text-lg font-semibold">{t('dashboard.tabs.settings')}</h2>
            </div>
            <div className="p-6">
              <p className="text-white/60">
                {t('dashboard.settings.comingSoon')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};