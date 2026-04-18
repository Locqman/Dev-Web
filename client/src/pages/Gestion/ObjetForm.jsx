import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getObjetById, createObjet, updateObjet, getCategories } from '../../services/api';

const champVide = { cle: '', valeur: '', unite: '' };

const ObjetForm = () => {
  const { id }     = useParams(); // si présent → mode édition
  const navigate   = useNavigate();
  const modeEdit   = Boolean(id);

  const [form,       setForm]       = useState({
    id_unique: '', nom: '', description: '', marque: '',
    type: '', etat: 'actif', connectivite: 'Wi-Fi',
    batterie: '', zone: '', categorie_id: ''
  });
  const [attributs,  setAttributs]  = useState([{ ...champVide }]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    if (modeEdit) {
      getObjetById(id).then(r => {
        const o = r.data;
        setForm({
          id_unique:    o.id_unique    || '',
          nom:          o.nom          || '',
          description:  o.description  || '',
          marque:       o.marque       || '',
          type:         o.type         || '',
          etat:         o.etat         || 'actif',
          connectivite: o.connectivite || 'Wi-Fi',
          batterie:     o.batterie     ?? '',
          zone:         o.zone         || '',
          categorie_id: o.categorie_id || ''
        });
        if (o.attributs && o.attributs.length > 0) {
          setAttributs(o.attributs.map(a => ({ cle: a.cle, valeur: a.valeur, unite: a.unite || '' })));
        }
      }).catch(() => navigate('/gestion'));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAttrChange = (index, field, value) => {
    const updated = [...attributs];
    updated[index][field] = value;
    setAttributs(updated);
  };

  const addAttribut    = () => setAttributs([...attributs, { ...champVide }]);
  const removeAttribut = (i) => setAttributs(attributs.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      ...form,
      batterie:    form.batterie !== '' ? parseInt(form.batterie) : null,
      categorie_id: form.categorie_id || null,
      attributs:   attributs.filter(a => a.cle.trim() !== '')
    };
    try {
      if (modeEdit) {
        await updateObjet(id, payload);
      } else {
        await createObjet(payload);
      }
      navigate('/gestion');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <Link to="/gestion" style={{ color: '#90a4ae', fontSize: '0.9rem' }}>← Retour à la gestion</Link>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>
          {modeEdit ? '✏️ Modifier l\'objet' : '➕ Ajouter un objet connecté'}
        </h1>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Informations générales */}
          <h2 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1 }}>
            Informations générales
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label>ID unique *</label>
              <input name="id_unique" value={form.id_unique} onChange={handleChange} required
                placeholder="ex: THM-003" disabled={modeEdit} />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input name="nom" value={form.nom} onChange={handleChange} required placeholder="ex: Thermostat Chalet B" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              placeholder="Description de l'objet..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marque</label>
              <input name="marque" value={form.marque} onChange={handleChange} placeholder="ex: Honeywell" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">— Choisir —</option>
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
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Catégorie</label>
              <select name="categorie_id" value={form.categorie_id} onChange={handleChange}>
                <option value="">— Choisir —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Zone / Emplacement</label>
              <input name="zone" value={form.zone} onChange={handleChange} placeholder="ex: Piste Rouge A" />
            </div>
          </div>

          {/* Connectivité & état */}
          <h2 style={{ margin: '1.5rem 0 1rem', fontSize: '1rem', color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1 }}>
            Connectivité & État
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label>État</label>
              <select name="etat" value={form.etat} onChange={handleChange}>
                <option value="actif">✅ Actif</option>
                <option value="inactif">❌ Inactif</option>
                <option value="maintenance">🔧 Maintenance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Connectivité</label>
              <select name="connectivite" value={form.connectivite} onChange={handleChange}>
                <option value="Wi-Fi">Wi-Fi</option>
                <option value="LoRa">LoRa</option>
                <option value="Zigbee">Zigbee</option>
                <option value="Bluetooth">Bluetooth</option>
                <option value="Ethernet">Ethernet</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ maxWidth: 200 }}>
            <label>Batterie (%) — laisser vide si sur secteur</label>
            <input type="number" name="batterie" value={form.batterie} onChange={handleChange}
              min="0" max="100" placeholder="ex: 85" />
          </div>

          {/* Attributs dynamiques */}
          <h2 style={{ margin: '1.5rem 0 1rem', fontSize: '1rem', color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1 }}>
            Attributs & données
          </h2>

          {attributs.map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <input placeholder="Clé (ex: temperature_actuelle)" value={a.cle} onChange={e => handleAttrChange(i, 'cle', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1.5px solid #cfd8dc' }} />
              <input placeholder="Valeur" value={a.valeur} onChange={e => handleAttrChange(i, 'valeur', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1.5px solid #cfd8dc' }} />
              <input placeholder="Unité (°C, %…)" value={a.unite} onChange={e => handleAttrChange(i, 'unite', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1.5px solid #cfd8dc' }} />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeAttribut(i)}>✕</button>
            </div>
          ))}

          <button type="button" className="btn btn-outline btn-sm" onClick={addAttribut} style={{ marginBottom: '1.5rem' }}>
            + Ajouter un attribut
          </button>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/gestion" className="btn btn-secondary">Annuler</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sauvegarde...' : modeEdit ? '💾 Enregistrer' : '➕ Créer l\'objet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjetForm;
