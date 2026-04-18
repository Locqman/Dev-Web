import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getObjets } from '../../services/api';

const GestionDashboard = () => {
  const [objets,  setObjets]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getObjets().then(r => setObjets(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total:       objets.length,
    actifs:      objets.filter(o => o.etat === 'actif').length,
    inactifs:    objets.filter(o => o.etat === 'inactif').length,
    maintenance: objets.filter(o => o.etat === 'maintenance').length,
  };

  // Objets nécessitant attention (inactif ou maintenance ou batterie < 20%)
  const alertes = objets.filter(o =>
    o.etat !== 'actif' || (o.batterie !== null && o.batterie < 20)
  );

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🛠️ Module Gestion</h1>
          <p style={{ color: '#90a4ae' }}>Tableau de bord avancé — gestion des objets connectés</p>
        </div>
        <Link to="/gestion/objets/nouveau" className="btn btn-primary">+ Nouvel objet</Link>
      </div>

      {/* Stats globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total objets',  val: stats.total,       couleur: '#1565c0', icone: '📡' },
          { label: 'Actifs',        val: stats.actifs,      couleur: '#43a047', icone: '✅' },
          { label: 'Inactifs',      val: stats.inactifs,    couleur: '#e53935', icone: '❌' },
          { label: 'En maintenance',val: stats.maintenance, couleur: '#fb8c00', icone: '🔧' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
            <div style={{ fontSize: '2rem' }}>{s.icone}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.couleur }}>{s.val}</div>
            <div style={{ color: '#90a4ae', fontSize: '0.85rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Accès rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Link to="/gestion/objets/nouveau" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
            onMouseEnter={e => e.currentTarget.style.borderLeft = '4px solid #1e88e5'}
            onMouseLeave={e => e.currentTarget.style.borderLeft = 'none'}>
            <span style={{ fontSize: '2.5rem' }}>➕</span>
            <div>
              <div className="card-title">Ajouter un objet</div>
              <div className="card-meta">Enregistrer un nouvel équipement connecté</div>
            </div>
          </div>
        </Link>

        <Link to="/gestion/rapports" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
            onMouseEnter={e => e.currentTarget.style.borderLeft = '4px solid #1e88e5'}
            onMouseLeave={e => e.currentTarget.style.borderLeft = 'none'}>
            <span style={{ fontSize: '2.5rem' }}>📊</span>
            <div>
              <div className="card-title">Rapports & Statistiques</div>
              <div className="card-meta">Consommation, fréquentation, historiques</div>
            </div>
          </div>
        </Link>

        <Link to="/objets" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
            onMouseEnter={e => e.currentTarget.style.borderLeft = '4px solid #1e88e5'}
            onMouseLeave={e => e.currentTarget.style.borderLeft = 'none'}>
            <span style={{ fontSize: '2.5rem' }}>🔍</span>
            <div>
              <div className="card-title">Consulter les objets</div>
              <div className="card-meta">Rechercher et visualiser les équipements</div>
            </div>
          </div>
        </Link>

        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
            onMouseEnter={e => e.currentTarget.style.borderLeft = '4px solid #1e88e5'}
            onMouseLeave={e => e.currentTarget.style.borderLeft = 'none'}>
            <span style={{ fontSize: '2.5rem' }}>🏠</span>
            <div>
              <div className="card-title">Tableau de bord</div>
              <div className="card-meta">Retour au dashboard principal</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Alertes — objets à surveiller */}
      {!loading && alertes.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem', color: '#e53935' }}>⚠️ Objets nécessitant une attention</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Objet</th>
                  <th>Zone</th>
                  <th>État</th>
                  <th>Batterie</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alertes.map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.nom}</strong></td>
                    <td>{o.zone}</td>
                    <td><span className={`badge badge-${o.etat}`}>{o.etat}</span></td>
                    <td style={{ color: o.batterie !== null && o.batterie < 20 ? '#e53935' : 'inherit' }}>
                      {o.batterie !== null ? `${o.batterie}%` : '—'}
                    </td>
                    <td>
                      <Link to={`/gestion/objets/${o.id}/modifier`} className="btn btn-primary btn-sm">Modifier</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Liste complète */}
      {!loading && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>📋 Tous les objets</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Zone</th>
                  <th>État</th>
                  <th>Dernière interaction</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {objets.map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.nom}</strong></td>
                    <td>{o.type}</td>
                    <td>{o.zone}</td>
                    <td><span className={`badge badge-${o.etat}`}>{o.etat}</span></td>
                    <td style={{ fontSize: '0.85rem', color: '#90a4ae' }}>
                      {o.derniere_interaction ? new Date(o.derniere_interaction).toLocaleString('fr-FR') : '—'}
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/objets/${o.id}`}               className="btn btn-outline btn-sm">👁️</Link>
                      <Link to={`/gestion/objets/${o.id}/modifier`} className="btn btn-primary btn-sm">✏️</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDashboard;
