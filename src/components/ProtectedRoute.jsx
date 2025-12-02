import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const ProtectedRoute = ({ children, requireCreator = false }) => {
  const { t } = useTranslation();
  const { user, loading, isAuthenticated, isCreator } = useAuth();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }} />
          <p className="text-white/60">{ t("common.loading") }</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si un profil créateur est requis
  if (requireCreator && !isCreator) {
    return <Navigate to="/create-creator-profile" replace />;
  }

  return children;
};