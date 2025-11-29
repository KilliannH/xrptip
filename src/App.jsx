import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { CreatorPublicPage } from "./pages/CreatorPublicPage";
import { Dashboard } from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-xrpDark text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/u/:username" element={<CreatorPublicPage />} />
        </Routes>
      </main>
      <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Logo & Description */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-xrpBlue to-cyan-500">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.8 4.5L16.2 9.1L12 4.9L7.8 9.1L3.2 4.5L1 6.7L7.8 13.5L12 9.3L16.2 13.5L23 6.7L20.8 4.5ZM20.8 13.5L16.2 18.1L12 13.9L7.8 18.1L3.2 13.5L1 15.7L7.8 22.5L12 18.3L16.2 22.5L23 15.7L20.8 13.5Z" />
                  </svg>
                </div>
                <span className="text-lg font-bold">xrpTip</span>
              </div>
              <p className="text-xs text-white/50 text-center sm:text-left">
                Built on XRPL · Tips instantanés pour créateurs
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="#" className="text-white/60 transition-colors hover:text-xrpBlue">
                Documentation
              </a>
              <a href="#" className="text-white/60 transition-colors hover:text-xrpBlue">
                Support
              </a>
              <a href="#" className="text-white/60 transition-colors hover:text-xrpBlue">
                Twitter
              </a>
              <a href="#" className="text-white/60 transition-colors hover:text-xrpBlue">
                Discord
              </a>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 rounded-full border border-xrpBlue/30 bg-xrpBlue/10 px-3 py-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-xrpBlue opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-xrpBlue" />
              </span>
              <span className="font-medium text-xrpBlue">Live on XRPL</span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} xrpTip. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;