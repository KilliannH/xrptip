export const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-white/60">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
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
              <h2 className="text-2xl font-bold text-white">Introduction</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Chez <strong className="text-xrpBlue">xrpTip</strong>, nous prenons votre vie privée au sérieux. 
              Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles.
            </p>
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ <strong>Transparence totale :</strong> Nous ne vendons jamais vos données. Nous n'utilisons aucun tracker publicitaire.
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
              <h2 className="text-2xl font-bold text-white">Données collectées</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-xrpBlue pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Informations de compte</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>Email</strong> : Pour créer votre compte et la vérification</li>
                  <li>• <strong>Mot de passe</strong> : Hashé avec bcrypt (jamais stocké en clair)</li>
                </ul>
              </div>

              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Informations de profil créateur (optionnel)</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>Nom d'utilisateur</strong> : Votre identifiant public</li>
                  <li>• <strong>Nom d'affichage</strong> : Votre nom visible</li>
                  <li>• <strong>Biographie</strong> : Description de votre profil</li>
                  <li>• <strong>Adresse XRP</strong> : Pour recevoir les tips</li>
                  <li>• <strong>Liens sociaux</strong> : Twitter, Instagram, etc. (optionnel)</li>
                  <li>• <strong>Avatar et bannière</strong> : Images de profil</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Données de transactions</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>Hash de transaction XRP</strong> : ID public sur le ledger</li>
                  <li>• <strong>Montant</strong> : Valeur du tip</li>
                  <li>• <strong>Date et heure</strong> : Horodatage de la transaction</li>
                  <li>• <strong>Adresse expéditeur</strong> : Adresse XRP publique</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Cookies</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <strong>Token d'authentification</strong> : Pour maintenir votre session (JWT)</li>
                  <li>• <strong>Préférences</strong> : Mémoriser vos choix (ex: acceptation cookies)</li>
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
              <h2 className="text-2xl font-bold text-white">Ce que nous NE collectons PAS</h2>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <ul className="text-white/80 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>Aucun cookie de tracking ou publicitaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>Aucune donnée de navigation (pages visitées, temps passé, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>Aucune donnée de localisation GPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>Aucun partage avec des tiers (Google Analytics, Facebook Pixel, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>Aucune vente de données personnelles</span>
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
              <h2 className="text-2xl font-bold text-white">Utilisation des données</h2>
            </div>
            <p className="text-white/80 mb-4">Nous utilisons vos données uniquement pour :</p>
            <ul className="text-white/70 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>Créer et gérer votre compte</strong> : Authentification et accès</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>Afficher votre profil public</strong> : Page créateur accessible à tous</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>Traiter les transactions XRP</strong> : Redistribuer les tips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>Envoyer des emails essentiels</strong> : Vérification, notifications importantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xrpBlue">✓</span>
                <span><strong>Améliorer le service</strong> : Statistiques anonymisées (nombre de tips, montants totaux)</span>
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
              <h2 className="text-2xl font-bold text-white">Sécurité</h2>
            </div>
            <div className="space-y-3 text-white/80">
              <p>Nous prenons des mesures techniques pour protéger vos données :</p>
              <ul className="space-y-2 text-white/70">
                <li>• <strong>Chiffrement HTTPS</strong> : Toutes les communications sont chiffrées (SSL/TLS)</li>
                <li>• <strong>Mots de passe hashés</strong> : Algorithme bcrypt avec salt</li>
                <li>• <strong>Tokens JWT</strong> : Sessions sécurisées avec expiration</li>
                <li>• <strong>Serveurs sécurisés</strong> : Hébergement AWS avec firewall</li>
                <li>• <strong>Sauvegardes régulières</strong> : Base de données sauvegardée quotidiennement</li>
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
              <h2 className="text-2xl font-bold text-white">Vos droits (RGPD)</h2>
            </div>
            <p className="text-white/80 mb-4">Conformément au RGPD, vous avez le droit de :</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">📥 Accès</h3>
                <p className="text-sm text-white/70">Demander une copie de vos données</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">✏️ Rectification</h3>
                <p className="text-sm text-white/70">Corriger vos informations</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">🗑️ Suppression</h3>
                <p className="text-sm text-white/70">Supprimer votre compte</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">📦 Portabilité</h3>
                <p className="text-sm text-white/70">Exporter vos données</p>
              </div>
            </div>
            <p className="text-white/70 mt-4 text-sm">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:support@xrptip.com" className="text-xrpBlue hover:underline">support@xrptip.com</a>
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
              <h2 className="text-2xl font-bold text-white">Note importante : Blockchain publique</h2>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <p className="text-yellow-200 mb-3">
                ⚠️ Les transactions XRP sont enregistrées sur le <strong>XRP Ledger</strong>, une blockchain publique.
              </p>
              <ul className="text-yellow-200/80 space-y-2 text-sm">
                <li>• Les adresses XRP et montants sont visibles publiquement</li>
                <li>• Ces données ne peuvent pas être supprimées (nature de la blockchain)</li>
                <li>• Nous ne contrôlons pas le XRP Ledger (réseau décentralisé)</li>
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
              <h2 className="text-2xl font-bold text-white">Modifications de cette politique</h2>
            </div>
            <p className="text-white/80">
              Nous pouvons mettre à jour cette politique de temps en temps. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
              Les changements importants vous seront notifiés par email.
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
              <h2 className="text-2xl font-bold text-white">Contact</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-white/80 mb-4">
                Des questions sur notre politique de confidentialité ?
              </p>
              <div className="space-y-2 text-white/70">
                <p>📧 Email : <a href="mailto:support@xrptip.com" className="text-xrpBlue hover:underline">support@xrptip.com</a></p>
              </div>
            </div>
          </section>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <a href="/" className="text-white/70 hover:text-white transition-colors">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};