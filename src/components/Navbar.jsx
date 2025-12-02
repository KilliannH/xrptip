import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-xrpDark/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-xrpBlue to-cyan-500 opacity-20 blur-lg transition-opacity group-hover:opacity-40" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-xrpBlue to-cyan-500 shadow-lg shadow-xrpBlue/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.8 4.5L16.2 9.1L12 4.9L7.8 9.1L3.2 4.5L1 6.7L7.8 13.5L12 9.3L16.2 13.5L23 6.7L20.8 4.5ZM20.8 13.5L16.2 18.1L12 13.9L7.8 18.1L3.2 13.5L1 15.7L7.8 22.5L12 18.3L16.2 22.5L23 15.7L20.8 13.5Z" />
              </svg>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              xrpTip
            </span>
            <p className="text-[10px] text-white/40 -mt-1">Powered by XRPL</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                isActive
                  ? "text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {t('nav.home')}
          </NavLink>

          {/* Language Switcher */}
          <LanguageSwitcher variant="compact" />

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `group relative overflow-hidden rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:scale-105 ${
                    isActive
                      ? "border-xrpBlue bg-gradient-to-r from-xrpBlue/20 to-cyan-500/10 text-xrpBlue shadow-lg shadow-xrpBlue/20"
                      : "border-white/10 bg-white/5 text-white/80 hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue"
                  }`
                }
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                  <span className="sm:hidden">Panel</span>
                </span>
              </NavLink>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-all hover:bg-white/5 hover:text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-xrpBlue to-cyan-500 text-xs font-bold text-white">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="rounded-xl border border-white/10 bg-gradient-to-br from-xrpDark to-black p-2 shadow-xl backdrop-blur-xl">
                    <div className="border-b border-white/10 px-3 py-2 mb-2">
                      <p className="text-xs text-white/60">{t('nav.connectedAs')}</p>
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 transition-all hover:bg-red-500/10 hover:text-red-400"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white sm:px-4"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue hover:scale-105"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};