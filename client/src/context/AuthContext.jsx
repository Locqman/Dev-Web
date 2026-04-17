import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage : recharger le profil si un token existe
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMyProfile()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Niveaux : debutant=1, intermediaire=2, avance=3, expert=4
  const niveauOrdre = { debutant: 1, intermediaire: 2, avance: 3, expert: 4 };
  const hasNiveau   = (niveauMin) =>
    user && niveauOrdre[user.niveau] >= niveauOrdre[niveauMin];

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, hasNiveau }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
