import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser, hasNiveau } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🎿 SkiConnect
      </NavLink>

      <div className="navbar-links">
        {/* Toujours visible */}
        <NavLink to="/">Accueil</NavLink>

        {!user ? (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        ) : (
          <>
            {/* Module Visualisation — simple+ */}
            <NavLink to="/dashboard">Tableau de bord</NavLink>
            <NavLink to="/objets">Objets</NavLink>
            <NavLink to="/membres">Membres</NavLink>

            {/* Module Gestion — avancé+ */}
            {hasNiveau('avance') && (
              <NavLink to="/gestion">Gestion</NavLink>
            )}

            {/* Profil + déconnexion */}
            <NavLink to="/profil">👤 {user.pseudo}</NavLink>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
