import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './styles/global.css';

// Module Information (public)
import Accueil    from './pages/Information/Accueil';
import Actualites from './pages/Information/Actualites';

// Auth
import Login    from './pages/Visualisation/Login';
import Register from './pages/Visualisation/Register';

// Module Visualisation (connecté)
import Dashboard   from './pages/Visualisation/Dashboard';
import Profil      from './pages/Visualisation/Profil';
import Membres     from './pages/Visualisation/Membres';
import MembreProfil from './pages/Visualisation/MembreProfil';
import ObjetsListe from './pages/Visualisation/ObjetsListe';
import ObjetDetail from './pages/Visualisation/ObjetDetail';

// Module Gestion (avancé+)
import GestionDashboard from './pages/Gestion/GestionDashboard';
import ObjetForm        from './pages/Gestion/ObjetForm';
import Rapports         from './pages/Gestion/Rapports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ── Public ── */}
          <Route path="/"           element={<Accueil />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />

          {/* ── Module Visualisation (simple+) ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>
          <Route path="/profil" element={
            <ProtectedRoute><Profil /></ProtectedRoute>
          }/>
          <Route path="/membres" element={
            <ProtectedRoute><Membres /></ProtectedRoute>
          }/>
          <Route path="/membres/:id" element={
            <ProtectedRoute><MembreProfil /></ProtectedRoute>
          }/>
          <Route path="/objets" element={
            <ProtectedRoute><ObjetsListe /></ProtectedRoute>
          }/>
          <Route path="/objets/:id" element={
            <ProtectedRoute><ObjetDetail /></ProtectedRoute>
          }/>

          {/* ── Module Gestion (avancé+) ── */}
          <Route path="/gestion" element={
            <ProtectedRoute niveauMin="avance"><GestionDashboard /></ProtectedRoute>
          }/>
          <Route path="/gestion/objets/nouveau" element={
            <ProtectedRoute niveauMin="avance"><ObjetForm /></ProtectedRoute>
          }/>
          <Route path="/gestion/objets/:id/modifier" element={
            <ProtectedRoute niveauMin="avance"><ObjetForm /></ProtectedRoute>
          }/>
          <Route path="/gestion/rapports" element={
            <ProtectedRoute niveauMin="avance"><Rapports /></ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

