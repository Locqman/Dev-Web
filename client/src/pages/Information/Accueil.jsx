import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActualites } from '../../services/api';

const Accueil = () => {
  const [actualites, setActualites] = useState([]);
  const [recherche,  setRecherche]  = useState('');
  const [categorie,  setCategorie]  = useState('');

  useEffect(() => {
    charger();
  }, []);

  const charger = async (params = {}) => {
    try {
      const res = await getActualites(params);
      setActualites(res.data);
    } catch {
      setActualites([]);
    }
  };

  const handleRecherche = (e) => {
    e.preventDefault();
    charger({ q: recherche, categorie });
  };

  const categorieLabel = { info: '📘 Info', alerte: '🔴 Alerte', meteo: '🌨️ Météo', evenement: '🎉 Événement' };

  return (
    <div className="page-container">

      {/* Hero */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1565c0, #1e88e5)', color: '#fff', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ color: '#fff', fontSize: '2.2rem' }}>🎿 Bienvenue sur SkiConnect</h1>
        <p style={{ marginTop: '0.8rem', fontSize: '1.1rem', opacity: 0.9 }}>
          La plateforme intelligente de votre station de ski
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-success">S'inscrire</Link>
          <Link to="/login"    className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Se connecter</Link>
        </div>
      </div>

      {/* Chiffres clés */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
        {[
          { icon: '⛷️', label: 'Pistes ouvertes',     val: '28 / 32' },
          { icon: '🌡️', label: 'Température sommet',  val: '-8°C' },
          { icon: '❄️', label: 'Enneigement',          val: '142 cm' },
          { icon: '💨', label: 'Vent',                 val: '32 km/h NO' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1565c0' }}>{s.val}</div>
            <div style={{ color: '#90a4ae', fontSize: '0.85rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recherche d'actualités — 2 filtres requis */}
      <div className="page-header">
        <h2>📰 Actualités & Événements</h2>
      </div>
      <form onSubmit={handleRecherche} className="search-bar">
        <input
          type="text"
          placeholder="🔍 Rechercher une actualité..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ flex: 2 }}
        />
        <select value={categorie} onChange={e => setCategorie(e.target.value)}>
          <option value="">Toutes catégories</option>
          <option value="info">📘 Info</option>
          <option value="alerte">🔴 Alerte</option>
          <option value="meteo">🌨️ Météo</option>
          <option value="evenement">🎉 Événement</option>
        </select>
        <button type="submit" className="btn btn-primary">Rechercher</button>
        <button type="button" className="btn btn-secondary" onClick={() => { setRecherche(''); setCategorie(''); charger(); }}>
          Réinitialiser
        </button>
      </form>

      <div className="card-grid">
        {actualites.length === 0 && (
          <p style={{ color: '#90a4ae' }}>Aucune actualité trouvée.</p>
        )}
        {actualites.map(a => (
          <div key={a.id} className="card">
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-info" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                {categorieLabel[a.categorie] || a.categorie}
              </span>
            </div>
            <div className="card-title">{a.titre}</div>
            <p style={{ fontSize: '0.9rem', color: '#455a64', lineHeight: 1.5 }}>{a.contenu}</p>
            <div className="card-meta" style={{ marginTop: '0.8rem' }}>
              {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accueil;
