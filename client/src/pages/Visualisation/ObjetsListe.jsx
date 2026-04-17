import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getObjets, getCategories } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ObjetsListe = () => {
  const [objets,     setObjets]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filtres,    setFiltres]    = useState({ q: '', etat: '', type: '', zone: '' });
  const { hasNiveau } = useAuth();

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    charger();
  }, []);

  const charger = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getObjets(params);
      setObjets(res.data);
    } catch { setObjets([]); }
    finally { setLoading(false); }
  };

  const handleFiltreChange = e => setFiltres({ ...filtres, [e.target.name]: e.target.value });
  const handleSearch = e => { e.preventDefault(); charger(filtres); };
  const handleReset  = () => { setFiltres({ q: '', etat: '', type: '', zone: '' }); charger(); };

  const badgeEtat = { actif: 'badge-actif', inactif: 'badge-inactif', maintenance: 'badge-maintenance' };
  const iconeType = { telesiege: '🚡', telecabine: '🚠', teleski: '🎿', canon_neige: '❄️', meteo: '🌡️', camera: '📷', detecteur: '🚨', thermostat: '🌡️', eclairage: '💡', portique: '🚪', borne: '🖥️' };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📡 Objets connectés</h1>
        {hasNiveau('avance') && (
          <Link to="/gestion/objets/nouveau" className="btn btn-primary">+ Ajouter</Link>
        )}
      </div>

      {/* Barre de recherche — 2 filtres minimum */}
      <form onSubmit={handleSearch} className="search-bar">
        <input name="q" placeholder="🔍 Nom ou description..." value={filtres.q} onChange={handleFiltreChange} />
        <select name="etat" value={filtres.etat} onChange={handleFiltreChange}>
          <option value="">Tous les états</option>
          <option value="actif">✅ Actif</option>
          <option value="inactif">❌ Inactif</option>
          <option value="maintenance">🔧 Maintenance</option>
        </select>
        <select name="type" value={filtres.type} onChange={handleFiltreChange}>
          <option value="">Tous les types</option>
          <option value="telesiege">Télésiège</option>
          <option value="telecabine">Télécabine</option>
          <option value="teleski">Téléski</option>
          <option value="canon_neige">Canon à neige</option>
          <option value="meteo">Météo</option>
          <option value="camera">Caméra</option>
          <option value="detecteur">Détecteur</option>
          <option value="thermostat">Thermostat</option>
          <option value="eclairage">Éclairage</option>
          <option value="portique">Portique</option>
          <option value="borne">Borne</option>
        </select>
        <input name="zone" placeholder="📍 Zone..." value={filtres.zone} onChange={handleFiltreChange} />
        <button type="submit" className="btn btn-primary">Filtrer</button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>Réinitialiser</button>
      </form>

      {loading && <div className="spinner">Chargement des objets...</div>}

      <div className="card-grid">
        {!loading && objets.length === 0 && (
          <p style={{ color: '#90a4ae' }}>Aucun objet trouvé.</p>
        )}
        {objets.map(o => (
          <Link key={o.id} to={`/objets/${o.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', height: '100%' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(21,101,192,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2rem' }}>{iconeType[o.type] || '📦'}</span>
                <span className={`badge ${badgeEtat[o.etat]}`}>{o.etat}</span>
              </div>
              <div className="card-title" style={{ marginTop: '0.5rem' }}>{o.nom}</div>
              <div className="card-meta">📍 {o.zone} · {o.type}</div>
              <div className="card-meta">🏷️ {o.marque || '—'} · {o.connectivite}</div>
              {o.batterie !== null && (
                <div style={{ fontSize: '0.85rem', color: o.batterie < 20 ? '#e53935' : '#43a047' }}>
                  🔋 {o.batterie}%
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ObjetsListe;
