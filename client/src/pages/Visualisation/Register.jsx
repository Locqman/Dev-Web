import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../../services/api';

const Register = () => {
  const [form,    setForm]    = useState({
    pseudo: '', nom: '', prenom: '', email: '', password: '',
    age: '', genre: '', date_naissance: '', type_membre: 'skieur'
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await register(form);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 560, marginTop: '2rem' }}>
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🎿 Inscription</h1>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            {success} <br />
            <Link to="/login">→ Se connecter</Link>
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input name="prenom" value={form.prenom} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input name="nom" value={form.nom} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Pseudo (login)</label>
              <input name="pseudo" value={form.pseudo} onChange={handleChange} required placeholder="ex: jean_ski" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="minimum 6 caractères" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date de naissance</label>
                <input type="date" name="date_naissance" value={form.date_naissance} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select name="genre" value={form.genre} onChange={handleChange}>
                  <option value="">Non renseigné</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Type de membre</label>
              <select name="type_membre" value={form.type_membre} onChange={handleChange}>
                <option value="skieur">Skieur</option>
                <option value="moniteur">Moniteur</option>
                <option value="pisteur">Pisteur</option>
                <option value="technicien">Technicien</option>
                <option value="responsable">Responsable</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
        )}
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#90a4ae' }}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
