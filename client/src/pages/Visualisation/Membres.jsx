import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../services/api';

const Membres = () => {
  const [membres, setMembres] = useState([]);
  const [search,  setSearch]  = useState('');
  const [niveau,  setNiveau]  = useState('');

  useEffect(() => {
    getAllUsers().then(r => setMembres(r.data)).catch(() => {});
  }, []);

  const filtres = membres.filter(m => {
    const matchSearch = m.pseudo.toLowerCase().includes(search.toLowerCase()) ||
      (m.type_membre || '').toLowerCase().includes(search.toLowerCase());
    const matchNiveau = niveau ? m.niveau === niveau : true;
    return matchSearch && matchNiveau;
  });

  return (
    <div className="page-container">
      <div className="page-header"><h1>👥 Membres de la station</h1></div>

      <div className="search-bar">
        <input placeholder="🔍 Pseudo ou type de membre..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={niveau} onChange={e => setNiveau(e.target.value)}>
          <option value="">Tous les niveaux</option>
          <option value="debutant">🔵 Débutant</option>
          <option value="intermediaire">🟢 Intermédiaire</option>
          <option value="avance">🟠 Avancé</option>
          <option value="expert">🔴 Expert</option>
        </select>
      </div>

      <div className="card-grid">
        {filtres.map(m => (
          <Link key={m.id} to={`/membres/${m.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(21,101,192,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
              <div style={{ fontSize: '3rem' }}>
                {m.photo_url ? <img src={m.photo_url} alt="" style={{ width: 60, height: 60, borderRadius: '50%' }} /> : '👤'}
              </div>
              <div className="card-title" style={{ marginTop: '0.5rem' }}>@{m.pseudo}</div>
              <div className="card-meta">{m.type_membre}</div>
              <span className={`badge badge-${m.niveau}`} style={{ marginTop: '0.5rem' }}>{m.niveau}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Membres;
