import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getHistorique, getObjets } from '../../services/api';

// ID des objets dont on veut les graphiques (selon seed.sql)
const OBJET_METEO_ID     = 6;  // Station Météo Sommet
const OBJET_THERMO_ID    = 10; // Thermostat Refuge
const OBJET_PORTIQUE_ID  = 13; // Portique Accès

const Rapports = () => {
  const [tempData,        setTempData]        = useState([]);
  const [energieData,     setEnergieData]     = useState([]);
  const [frequentData,    setFrequentData]    = useState([]);
  const [objets,          setObjets]          = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const [temp, energie, frequent, objListe] = await Promise.all([
          getHistorique(OBJET_METEO_ID,    { cle: 'temperature', limit: 14 }),
          getHistorique(OBJET_THERMO_ID,   { cle: 'consommation_elec', limit: 8 }),
          getHistorique(OBJET_PORTIQUE_ID, { cle: 'passages_valides', limit: 8 }),
          getObjets()
        ]);

        const fmt = (data) => data.data.reverse().map(d => ({
          date:  new Date(d.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          valeur: parseFloat(d.valeur)
        }));

        setTempData(fmt(temp));
        setEnergieData(fmt(energie));
        setFrequentData(fmt(frequent));
        setObjets(objListe.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  if (loading) return <div className="spinner">Chargement des rapports...</div>;

  // Stats objets par état
  const parEtat = [
    { name: 'Actif',       val: objets.filter(o => o.etat === 'actif').length,       fill: '#43a047' },
    { name: 'Inactif',     val: objets.filter(o => o.etat === 'inactif').length,     fill: '#e53935' },
    { name: 'Maintenance', val: objets.filter(o => o.etat === 'maintenance').length, fill: '#fb8c00' },
  ];

  // Objets par zone
  const zonesMap = {};
  objets.forEach(o => { zonesMap[o.zone] = (zonesMap[o.zone] || 0) + 1; });
  const parZone = Object.entries(zonesMap).map(([zone, nb]) => ({ name: zone, val: nb }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Rapports & Statistiques</h1>
        <p style={{ color: '#90a4ae' }}>Données en temps réel issues des objets connectés</p>
      </div>

      {/* Température sommet */}
      <div className="card">
        <h2 style={{ marginBottom: '0.3rem' }}>🌡️ Température au sommet (7 derniers jours)</h2>
        <p style={{ color: '#90a4ae', fontSize: '0.85rem', marginBottom: '1rem' }}>Station Météo Sommet — 2800m</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis unit="°C" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${v}°C`, 'Température']} />
            <Line type="monotone" dataKey="valeur" stroke="#1e88e5" strokeWidth={2} dot={{ r: 4 }} name="Température" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Consommation énergie */}
      <div className="card">
        <h2 style={{ marginBottom: '0.3rem' }}>⚡ Consommation énergétique — Refuge Sommet</h2>
        <p style={{ color: '#90a4ae', fontSize: '0.85rem', marginBottom: '1rem' }}>kW consommés par jour</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={energieData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis unit=" kW" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${v} kW`, 'Consommation']} />
            <Bar dataKey="valeur" fill="#1e88e5" radius={[4, 4, 0, 0]} name="kW" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fréquentation portique */}
      <div className="card">
        <h2 style={{ marginBottom: '0.3rem' }}>🚪 Fréquentation — Portique d'accès principal</h2>
        <p style={{ color: '#90a4ae', fontSize: '0.85rem', marginBottom: '1rem' }}>Passages validés par jour</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={frequentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${v} passages`, 'Fréquentation']} />
            <Bar dataKey="valeur" fill="#43a047" radius={[4, 4, 0, 0]} name="Passages" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats objets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>📡 Objets par état</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={parEtat} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              {parEtat.map((e, i) => (
                <Bar key={i} dataKey="val" fill={e.fill} radius={[0, 4, 4, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>📍 Objets par zone</h2>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {parZone.map((z, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '0.9rem', color: '#455a64' }}>{z.name}</span>
                <span style={{ fontWeight: 700, color: '#1565c0' }}>{z.val} objet{z.val > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>🔋 Objets sur batterie — état de charge</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Objet</th><th>Zone</th><th>Batterie</th><th>État</th></tr>
            </thead>
            <tbody>
              {objets.filter(o => o.batterie !== null).map(o => (
                <tr key={o.id}>
                  <td><strong>{o.nom}</strong></td>
                  <td>{o.zone}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, background: '#e3f2fd', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${o.batterie}%`, height: '100%', background: o.batterie < 20 ? '#e53935' : o.batterie < 50 ? '#fb8c00' : '#43a047', borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: o.batterie < 20 ? '#e53935' : '#455a64' }}>{o.batterie}%</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${o.etat}`}>{o.etat}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rapports;
