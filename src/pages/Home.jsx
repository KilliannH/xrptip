import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-xrpBlue/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left Column - Content */}
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-xrpBlue/30 bg-gradient-to-r from-xrpBlue/10 to-cyan-500/10 px-4 py-2 text-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-xrpBlue opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-xrpBlue" />
              </span>
              <span className="font-medium text-xrpBlue">Tips instantanés · Frais quasi nuls</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Reçois des tips en{" "}
              <span className="bg-gradient-to-r from-xrpBlue to-cyan-400 bg-clip-text text-transparent">
                XRP
              </span>
              <br />
              <span className="text-white/80">en quelques secondes.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-white/60">
              xrpTip permet aux créateurs de recevoir des pourboires en XRP,
              instantanément, avec des frais ridicules. Partage ta page, tes fans
              scannent, envoient, c'est payé.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-xrpBlue to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-xrpBlue/25 transition-all hover:shadow-xl hover:shadow-xrpBlue/40 hover:scale-105"
              >
                <span className="relative z-10">Créer ma page de tips</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-xrpBlue opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <a
                href="#how-it-works"
                className="group flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <span>Voir comment ça marche</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-xrpBlue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Basé sur XRPL</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-xrpBlue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Compatible wallets XRP</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-xrpBlue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Web3 ready</span>
              </div>
            </div>
          </section>

          {/* Right Column - Demo Card */}
          <section className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-xrpBlue/50 to-cyan-500/50 opacity-30 blur-xl" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
              {/* Profile Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-xrpBlue via-cyan-400 to-blue-500" />
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-xrpDark bg-green-500">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white">@CryptoArtist</p>
                    <p className="text-sm text-white/50">Illustrateur & NFT sur XRPL</p>
                  </div>
                </div>
                <div className="rounded-full bg-xrpBlue/10 px-3 py-1 text-xs font-medium text-xrpBlue">
                  Créateur vérifié
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-sm leading-relaxed text-white/70">
                  "Grâce à xrpTip, mes followers peuvent me soutenir en XRP directement
                  depuis X ou Twitch. C'est rapide, simple, et je garde presque tout."
                </p>
              </div>

              {/* Tip Options */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-white/80">
                  Soutenir @CryptoArtist
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {["1 XRP", "5 XRP", "10 XRP"].map((label) => (
                    <button
                      key={label}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:scale-105"
                    >
                      <span className="relative z-10 transition-colors group-hover:text-xrpBlue">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <button className="w-full rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-3 text-sm text-white/60 transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/5 hover:text-xrpBlue">
                  + Montant personnalisé
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 rounded-2xl border border-xrpBlue/20 bg-gradient-to-br from-xrpBlue/10 to-cyan-500/5 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                  <svg className="h-5 w-5 text-xrpBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </p>
                <ol className="space-y-2 text-sm text-white/60">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-xrpBlue/20 text-xs font-bold text-xrpBlue">1</span>
                    <span>Choisis un montant</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-xrpBlue/20 text-xs font-bold text-xrpBlue">2</span>
                    <span>Scanne le QR ou ouvre ton wallet XRP</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-xrpBlue/20 text-xs font-bold text-xrpBlue">3</span>
                    <span>Valide la transaction → tip envoyé ✅</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};