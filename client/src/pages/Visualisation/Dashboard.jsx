import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const niveauxInfo = {
  debutant:      { label: 'Débutant',      couleur: '#1565c0', points: 3,  icone: '🔵' },
  intermediaire: { label: 'Intermédiaire', couleur: '#2e7d32', points: 5,  icone: '🟢' },
  avance:        { label: 'Avancé',        couleur: '#e65100', points: 7,  icone: '🟠' },
  expert:        { label: 'Expert',        couleur: '#b71c1c', points: 999, icone: '🔴' },
};

const Dashboard = () => {
  const { user, hasNiveau } = useAuth();
  if (!user) return null;

  const info        = niveauxInfo[user.niveau];
  const prochainNiveau = { debutant: 'intermediaire', intermediaire: 'avance', avance: 'expert' };
  const prochain    = prochainNiveau[user.niveau];
  const pointsManquants = prochain
    ? Math.max(0, niveauxInfo[prochain].points - user.points).toFixed(2)
    : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👋 Bonjour, {user.prenom || user.pseudo} !</h1>
        <p style={{ color: '#90a4ae' }}>Tableau de bord — Station SkiConnect</p>
      </div>

      {/* Carte profil résumé */}
      <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '4rem' }}>
          {user.photo_url ? <img src={user.photo_url} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>@{user.pseudo}</div>
          <div style={{ color: '#90a4ae', fontSize: '0.9rem' }}>{user.type_membre}</div>
          <div style={{ marginTop: '0.5rem' }}>
            <span className={`badge badge-${user.niveau}`}>{info.icone} {info.label}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1565c0' }}>{user.points?.toFixed(2)}</div>
          <div style={{ color: '#90a4ae', fontSize: '0.85rem' }}>points cumulés</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1565c0' }}>{user.nb_connexions}</div>
          <div style={{ color: '#90a4ae', fontSize: '0.85rem' }}>connexions</div>
        </div>
      </div>

      {/* Progression vers le niveau suivant */}
      {prochain && (
        <div className="card">
          <h3>📈 Progression vers le niveau {niveauxInfo[prochain].label}</h3>
          <p style={{ color: '#90a4ae', fontSize: '0.9rem', margin: '0.5rem 0' }}>
            Il vous manque <strong>{pointsManquants} points</strong> pour débloquer le niveau suivant.
          </p>
          <div style={{ background: '#e3f2fd', borderRadius: 8, height: 12, marginTop: '0.8rem', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (user.points / niveauxInfo[prochain].points) * 100)}%`,
              background: '#1e88e5',
              height: '100%',
              borderRadius: 8,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#90a4ae', marginTop: '0.3rem' }}>
            <span>{user.points?.toFixed(2)} pts</span>
            <span>{niveauxInfo[prochain].points} pts</span>
          </div>
          <Link to="/profil" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Changer de niveau
          </Link>
        </div>
      )}

      {/* Accès rapides */}
      <h2 style={{ margin: '1.5rem 0 1rem' }}>🚀 Accès rapides</h2>
      <div className="card-grid">
        <Link to="/objets" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ fontSize: '2.5rem' }}>📡</div>
            <div className="card-title">Objets connectés</div>
            <div className="card-meta">Consulter et rechercher les équipements</div>
          </div>
        </Link>

        <Link to="/membres" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ fontSize: '2.5rem' }}>👥</div>
            <div className="card-title">Membres</div>
            <div className="card-meta">Voir les profils de la station</div>
          </div>
        </Link>

        <Link to="/profil" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ fontSize: '2.5rem' }}>⚙️</div>
            <div className="card-title">Mon profil</div>
            <div className="card-meta">Modifier vos informations</div>
          </div>
        </Link>

        {hasNiveau('avance') && (
          <Link to="/gestion" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center', border: '2px solid #1e88e5' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ fontSize: '2.5rem' }}>🛠️</div>
              <div className="card-title">Module Gestion</div>
              <div className="card-meta">Gérer les objets et ressources</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
