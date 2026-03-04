import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types'; // Assure-toi que ce type correspond à ce qu'il y a dans ton fichier types/index.ts

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[] | string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // 1. État de chargement visuel pendant que Firebase vérifie le token
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Vérification des accès sécurisés...</p>
      </div>
    );
  }

  // 2. Si l'utilisateur n'est pas connecté du tout, retour à la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si la route exige un rôle spécifique et que l'utilisateur n'a pas ce rôle
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirection de sécurité vers le Dashboard classique
    return <Navigate to="/" replace />;
  }

  // 4. Tout est en ordre, on affiche la page demandée
  return <>{children}</>;
};