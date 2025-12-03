import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const Admin = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Récupérer les statistiques
      const statsResponse = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);

      // Récupérer la liste des utilisateurs
      const usersResponse = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersResponse.data);

    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || t('admin.error'));
      
      // Si non autorisé, rediriger
      if (err.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden py-12">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center py-20">
            <div className="spinner" style={{ width: '40px', height: '40px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-12">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-xrpBlue/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-xrpBlue/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
              <p className="text-white/60">{t('admin.subtitle')}</p>
            </div>
          </div>
          
          {/* Badge admin */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="font-medium text-red-400">{t('admin.adminAccess')}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-xrpBlue/30 hover:shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/60">{t('admin.stats.totalUsers')}</p>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="mt-1 text-sm text-white/50">
                {t('admin.stats.registered')}
              </p>
            </div>

            {/* Total Creators */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-purple-500/30 hover:shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/60">{t('admin.stats.totalCreators')}</p>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.totalCreators}</p>
              <p className="mt-1 text-sm text-white/50">
                {t('admin.stats.withProfile')}
              </p>
            </div>

            {/* Verified Users */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-green-500/30 hover:shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/60">{t('admin.stats.verifiedUsers')}</p>
                <div className="rounded-lg bg-green-500/10 p-2">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.verifiedUsers}</p>
              <p className="mt-1 text-sm text-white/50">
                {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% {t('admin.stats.verified')}
              </p>
            </div>

            {/* New Users (7 days) */}
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-lg backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/60">{t('admin.stats.newUsers')}</p>
                <div className="rounded-lg bg-cyan-500/10 p-2">
                  <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.newUsersLast7Days}</p>
              <p className="mt-1 text-sm text-white/50">
                {t('admin.stats.last7Days')}
              </p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/5 bg-gradient-to-r from-xrpBlue/10 to-cyan-500/10 px-6 py-4">
            <h2 className="text-lg font-semibold">{t('admin.usersList')}</h2>
            <p className="mt-1 text-sm text-white/60">{t('admin.usersListSubtitle')}</p>
          </div>

          {/* Filters */}
          <div className="border-b border-white/5 bg-white/[0.02] px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('admin.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 transition-all focus:outline-none focus:ring-2 focus:border-xrpBlue/50 focus:ring-xrpBlue/50"
                />
              </div>

              {/* Role Filter */}
              <div className="flex gap-2">
                {['all', 'user', 'creator', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      filterRole === role
                        ? 'bg-xrpBlue text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {t(`admin.roles.${role}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <p className="mt-3 text-sm text-white/50">
              {t('admin.showingResults', { count: filteredUsers.length, total: users.length })}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60">{t('admin.table.email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60">{t('admin.table.username')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60">{t('admin.table.role')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60">{t('admin.table.verified')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60">{t('admin.table.createdAt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentUsers.map((u) => (
                  <tr key={u._id} className="group hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-white/80">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {u.username || <span className="text-white/40">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.role === 'admin' 
                          ? 'bg-red-500/10 text-red-400'
                          : u.role === 'creator'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {u.role === 'admin' && '👑'}
                        {u.role === 'creator' && '⭐'}
                        {t(`admin.roles.${u.role}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-sm text-green-400">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t('admin.table.yes')}
                        </span>
                      ) : (
                        <span className="text-sm text-white/40">{t('admin.table.no')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-white/5 bg-white/[0.02] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">
                  {t('admin.pagination.page')} {currentPage} {t('admin.pagination.of')} {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('admin.pagination.previous')}
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('admin.pagination.next')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};