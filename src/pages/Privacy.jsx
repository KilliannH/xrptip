import { useTranslation } from 'react-i18next';

export const Privacy = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-white/60">
            {t('privacy.lastUpdate')}: {new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-xrpBlue/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.intro.title')}</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              {t('privacy.intro.description')}
            </p>
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ <strong>{t('privacy.intro.transparency.title')}:</strong> {t('privacy.intro.transparency.text')}
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.dataCollected.title')}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-xrpBlue pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">{t('privacy.dataCollected.account.title')}</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>{t('privacy.dataCollected.account.email.label')}</strong>: {t('privacy.dataCollected.account.email.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.account.password.label')}</strong>: {t('privacy.dataCollected.account.password.description')}</li>
                </ul>
              </div>

              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">{t('privacy.dataCollected.creator.title')}</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>{t('privacy.dataCollected.creator.username.label')}</strong>: {t('privacy.dataCollected.creator.username.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.creator.displayName.label')}</strong>: {t('privacy.dataCollected.creator.displayName.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.creator.bio.label')}</strong>: {t('privacy.dataCollected.creator.bio.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.creator.xrpAddress.label')}</strong>: {t('privacy.dataCollected.creator.xrpAddress.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.creator.socialLinks.label')}</strong>: {t('privacy.dataCollected.creator.socialLinks.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.creator.images.label')}</strong>: {t('privacy.dataCollected.creator.images.description')}</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">{t('privacy.dataCollected.transactions.title')}</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>{t('privacy.dataCollected.transactions.hash.label')}</strong>: {t('privacy.dataCollected.transactions.hash.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.transactions.amount.label')}</strong>: {t('privacy.dataCollected.transactions.amount.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.transactions.datetime.label')}</strong>: {t('privacy.dataCollected.transactions.datetime.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.transactions.sender.label')}</strong>: {t('privacy.dataCollected.transactions.sender.description')}</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">{t('privacy.dataCollected.cookies.title')}</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>{t('privacy.dataCollected.cookies.auth.label')}</strong>: {t('privacy.dataCollected.cookies.auth.description')}</li>
                  <li>• <strong>{t('privacy.dataCollected.cookies.preferences.label')}</strong>: {t('privacy.dataCollected.cookies.preferences.description')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Ce que nous NE collectons PAS */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.notCollected.title')}</h2>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <ul className="text-white/80 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{t('privacy.notCollected.items.0')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{t('privacy.notCollected.items.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{t('privacy.notCollected.items.2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{t('privacy.notCollected.items.3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{t('privacy.notCollected.items.4')}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.dataUsage.title')}</h2>
            </div>
            <p className="text-white/80 mb-4">{t('privacy.dataUsage.description')}</p>
            <ul className="text-white/70 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>{t('privacy.dataUsage.purposes.0.title')}</strong>: {t('privacy.dataUsage.purposes.0.description')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>{t('privacy.dataUsage.purposes.1.title')}</strong>: {t('privacy.dataUsage.purposes.1.description')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>{t('privacy.dataUsage.purposes.2.title')}</strong>: {t('privacy.dataUsage.purposes.2.description')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>{t('privacy.dataUsage.purposes.3.title')}</strong>: {t('privacy.dataUsage.purposes.3.description')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>{t('privacy.dataUsage.purposes.4.title')}</strong>: {t('privacy.dataUsage.purposes.4.description')}</span>
              </li>
            </ul>
          </section>

          {/* Sécurité */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.security.title')}</h2>
            </div>
            <div className="space-y-3 text-white/80">
              <p>{t('privacy.security.description')}</p>
              <ul className="space-y-2 text-white/70">
                <li>• <strong>{t('privacy.security.measures.0.title')}</strong>: {t('privacy.security.measures.0.description')}</li>
                <li>• <strong>{t('privacy.security.measures.1.title')}</strong>: {t('privacy.security.measures.1.description')}</li>
                <li>• <strong>{t('privacy.security.measures.2.title')}</strong>: {t('privacy.security.measures.2.description')}</li>
                <li>• <strong>{t('privacy.security.measures.3.title')}</strong>: {t('privacy.security.measures.3.description')}</li>
                <li>• <strong>{t('privacy.security.measures.4.title')}</strong>: {t('privacy.security.measures.4.description')}</li>
              </ul>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.rights.title')}</h2>
            </div>
            <p className="text-white/80 mb-4">{t('privacy.rights.description')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">📥 {t('privacy.rights.items.access.title')}</h3>
                <p className="text-sm text-white/70">{t('privacy.rights.items.access.description')}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">✏️ {t('privacy.rights.items.rectification.title')}</h3>
                <p className="text-sm text-white/70">{t('privacy.rights.items.rectification.description')}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">🗑️ {t('privacy.rights.items.deletion.title')}</h3>
                <p className="text-sm text-white/70">{t('privacy.rights.items.deletion.description')}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">📦 {t('privacy.rights.items.portability.title')}</h3>
                <p className="text-sm text-white/70">{t('privacy.rights.items.portability.description')}</p>
              </div>
            </div>
            <p className="text-white/70 mt-4 text-sm">
              {t('privacy.rights.contact')} <a href="mailto:support@xrptip.com" className="text-xrpBlue hover:underline">support@xrptip.com</a>
            </p>
          </section>

          {/* Transactions blockchain */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-xrpBlue/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-xrpBlue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.8 4.5L16.2 9.1L12 4.9L7.8 9.1L3.2 4.5L1 6.7L7.8 13.5L12 9.3L16.2 13.5L23 6.7L20.8 4.5ZM20.8 13.5L16.2 18.1L12 13.9L7.8 18.1L3.2 13.5L1 15.7L7.8 22.5L12 18.3L16.2 22.5L23 15.7L20.8 13.5Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.blockchain.title')}</h2>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <p className="text-yellow-200 mb-3">
                ⚠️ {t('privacy.blockchain.warning')}
              </p>
              <ul className="text-yellow-200/80 space-y-2 text-sm">
                <li>• {t('privacy.blockchain.items.0')}</li>
                <li>• {t('privacy.blockchain.items.1')}</li>
                <li>• {t('privacy.blockchain.items.2')}</li>
              </ul>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.modifications.title')}</h2>
            </div>
            <p className="text-white/80">
              {t('privacy.modifications.description')}
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-white/10 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('privacy.contact.title')}</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-white/80 mb-4">
                {t('privacy.contact.question')}
              </p>
              <div className="space-y-2 text-white/70">
                <p>📧 {t('privacy.contact.email')}: <a href="mailto:support@xrptip.com" className="text-xrpBlue hover:underline">support@xrptip.com</a></p>
              </div>
            </div>
          </section>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <a href="/" className="text-white/70 hover:text-white transition-colors">
            {t('privacy.backHome')}
          </a>
        </div>
      </div>
    </div>
  );
};