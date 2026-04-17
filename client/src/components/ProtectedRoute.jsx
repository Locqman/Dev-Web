import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// niveauMin : 'debutant' | 'intermediaire' | 'avance' | 'expert'
const ProtectedRoute = ({ children, niveauMin = 'debutant' }) => {
  const { user, loading, hasNiveau } = useAuth();

  if (loading) return <div className="spinner">Chargement...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (!hasNiveau(niveauMin)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
