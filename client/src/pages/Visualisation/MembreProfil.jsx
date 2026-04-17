import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../../services/api';

const MembreProfil = () => {
  const { id } = useParams();
  const [membre, setMembre] = useState(null);

  useEffect(() => {
    getUserById(id).then(r => setMembre(r.data)).catch(() => setMembre(null));
  }, [id]);

  if (!membre) return <div className="spinner">Chargement...</div>;

  return (
    <div className="page-container" style={{ maxWidth: 600 }}>
      <Link to="/membres" style={{ color: '#90a4ae', fontSize: '0.9rem' }}>← Retour aux membres</Link>
      <div className="card" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
        <h1>@{membre.pseudo}</h1>
        <span className={`badge badge-${membre.niveau}`} style={{ margin: '0.5rem 0', display: 'inline-block' }}>
          {membre.niveau}
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', textAlign: 'left' }}>
          {[
            { label: 'Type de membre', val: membre.type_membre },
            { label: 'Genre',          val: membre.genre || '—' },
            { label: 'Date naissance', val: membre.date_naissance ? new Date(membre.date_naissance).toLocaleDateString('fr-FR') : '—' },
            { label: 'Niveau',         val: membre.niveau },
          ].map((item, i) => (
            <div key={i} style={{ background: '#f5f7fa', borderRadius: 8, padding: '0.8rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#90a4ae', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembreProfil;
