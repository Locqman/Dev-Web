import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getObjetById, demanderSuppression } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ObjetDetail = () => {
  const { id }      = useParams();
  const { hasNiveau } = useAuth();
  const [objet,   setObjet]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [motif,   setMotif]   = useState('');
  const [msg,     setMsg]     = useState('');

  useEffect(() => {
    getObjetById(id)
      .then(r => setObjet(r.data))
      .catch(() => setObjet(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDemandeSuppression = async () => {
    try {
      await demanderSuppression(id, { motif });
      setMsg('✅ Demande de suppression envoyée à l\'administrateur.');
      setMotif('');
    } catch { setMsg('❌ Erreur lors de la demande.'); }
  };

  if (loading) return <div className="spinner">Chargement...</div>;
  if (!objet)  return <div className="page-container"><div className="alert alert-error">Objet non trouvé.</div></div>;

  const badgeEtat = { actif: 'badge-actif', inactif: 'badge-inactif', maintenance: 'badge-maintenance' };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/objets" style={{ color: '#90a4ae', fontSize: '0.9rem' }}>← Retour aux objets</Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{objet.nom}</h1>
            <div className="card-meta">ID : {objet.id_unique} · {objet.categorie_nom}</div>
          </div>
          <span className={`badge ${badgeEtat[objet.etat]}`} style={{ fontSize: '0.95rem', padding: '0.4rem 1rem' }}>
            {objet.etat}
          </span>
        </div>

        <p style={{ marginTop: '1rem', color: '#455a64', lineHeight: 1.6 }}>{objet.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {[
            { label: 'Marque',        val: objet.marque },
            { label: 'Type',          val: objet.type },
            { label: 'Zone',          val: objet.zone },
            { label: 'Connectivité',  val: objet.connectivite },
            { label: 'Batterie',      val: objet.batterie !== null ? `${objet.batterie}%` : 'Sur secteur' },
            { label: 'Dernière inter.', val: objet.derniere_interaction ? new Date(objet.derniere_interaction).toLocaleString('fr-FR') : '—' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#f5f7fa', borderRadius: 8, padding: '0.8rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#90a4ae', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{item.val || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Attributs dynamiques */}
      {objet.attributs && objet.attributs.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>📊 Données en temps réel</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {objet.attributs.map((a, i) => (
              <div key={i} style={{ background: '#e3f2fd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#90a4ae', textTransform: 'uppercase', fontWeight: 600 }}>
                  {a.cle.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1565c0', marginTop: '0.3rem' }}>
                  {a.valeur} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>{a.unite}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions complexe+ */}
      {hasNiveau('avance') && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>🛠️ Actions de gestion</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={`/gestion/objets/${id}/modifier`} className="btn btn-primary">✏️ Modifier</Link>
          </div>
          {msg && <div className="alert alert-success" style={{ marginTop: '1rem' }}>{msg}</div>}
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Demander la suppression</h3>
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <textarea
                placeholder="Motif de la suppression..."
                value={motif}
                onChange={e => setMotif(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1.5px solid #cfd8dc' }}
              />
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleDemandeSuppression} disabled={!motif}>
              🗑️ Demander suppression
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjetDetail;
