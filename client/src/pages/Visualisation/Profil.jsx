import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changerNiveau, getMyProfile } from '../../services/api';

const niveauxRequis = { intermediaire: 3, avance: 5, expert: 7 };
const niveauxOrdre  = { debutant: 1, intermediaire: 2, avance: 3, expert: 4 };

const Profil = () => {
  const { user, loginUser } = useAuth();
  const [form,    setForm]    = useState(null);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Charger le profil complet depuis l'API au lieu du token
  useEffect(() => {
    getMyProfile().then(res => {
      setForm({ ...res.data, password: '' });
    }).catch(() => {
      if (user) setForm({ ...user, password: '' });
    });
  }, []);

  if (!form) return <div className="spinner">Chargement...</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      await updateProfile(form);
      const profil = await getMyProfile();
      setForm({ ...profil.data, password: '' });
      setMsg('Profil mis à jour !');
    } catch { setError('Erreur lors de la mise à jour.'); }
  };

  const handleNiveau = async (niveau) => {
    setMsg(''); setError('');
    setLoading(true);
    try {
      const res = await changerNiveau({ nouveau_niveau: niveau });
      setMsg(res.data.message);
      const profil = await getMyProfile();
      loginUser(localStorage.getItem('token'), profil.data);
      setForm({ ...profil.data, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur.');
    } finally { setLoading(false); }
  };

  const prochains = ['intermediaire', 'avance', 'expert'].filter(
    n => niveauxOrdre[n] > niveauxOrdre[form.niveau]
  );

  return (
    <div className="page-container">
      <h1>⚙️ Mon profil</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>

        {/* Infos publiques */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>👤 Informations publiques</h2>
          {msg   && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Pseudo</label>
              <input name="pseudo" value={form.pseudo || ''} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input name="prenom" value={form.prenom || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input name="nom" value={form.nom || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Genre</label>
              <select name="genre" value={form.genre || ''} onChange={handleChange}>
                <option value="">Non renseigné</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date de naissance</label>
              <input type="date" name="date_naissance" value={form.date_naissance?.slice(0,10) || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Type de membre</label>
              <select name="type_membre" value={form.type_membre || 'skieur'} onChange={handleChange}>
                <option value="skieur">Skieur</option>
                <option value="moniteur">Moniteur</option>
                <option value="pisteur">Pisteur</option>
                <option value="technicien">Technicien</option>
                <option value="responsable">Responsable</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              💾 Sauvegarder
            </button>
          </form>
        </div>

        {/* Niveau & points */}
        <div>
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>🏆 Niveau & Points</h2>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>
                {{ debutant: '🔵', intermediaire: '🟢', avance: '🟠', expert: '🔴' }[form.niveau]}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.3rem', marginTop: '0.5rem', textTransform: 'capitalize' }}>
                {form.niveau}
              </div>
              <div style={{ color: '#90a4ae', marginTop: '0.3rem' }}>
                {form.points?.toFixed(2)} points · {form.nb_connexions} connexions · {form.nb_actions} actions
              </div>
            </div>

            {prochains.length > 0 && (
              <>
                <h3 style={{ marginTop: '1rem', marginBottom: '0.8rem' }}>Passer au niveau supérieur</h3>
                {prochains.map(n => (
                  <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', padding: '0.6rem', background: '#f5f7fa', borderRadius: 8 }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{n} ({niveauxRequis[n]} pts requis)</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleNiveau(n)}
                      disabled={loading || form.points < niveauxRequis[n]}
                    >
                      {form.points >= niveauxRequis[n] ? 'Débloquer' : `Manque ${(niveauxRequis[n] - form.points).toFixed(2)} pts`}
                    </button>
                  </div>
                ))}
              </>
            )}
            {form.niveau === 'expert' && (
              <div className="alert alert-success">🏆 Vous avez atteint le niveau maximum !</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;