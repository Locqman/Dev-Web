import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Injecter automatiquement le token JWT dans chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register  = (data)  => API.post('/auth/register', data);
export const login     = (data)  => API.post('/auth/login', data);

// Users
export const getMyProfile  = ()     => API.get('/users/me');
export const updateProfile = (data) => API.put('/users/me', data);
export const getAllUsers    = ()     => API.get('/users');
export const getUserById   = (id)   => API.get(`/users/${id}`);
export const changerNiveau = (data) => API.put('/users/me/niveau', data);

// Objets
export const getObjets            = (params) => API.get('/objets', { params });
export const getObjetById         = (id)     => API.get(`/objets/${id}`);
export const getCategories        = ()       => API.get('/objets/categories');
export const createObjet          = (data)   => API.post('/objets', data);
export const updateObjet          = (id, data) => API.put(`/objets/${id}`, data);
export const demanderSuppression  = (id, data) => API.post(`/objets/${id}/demande-suppression`, data);
export const getHistorique        = (id, params) => API.get(`/objets/${id}/historique`, { params });

// Services
export const getServices   = ()   => API.get('/services');
export const getServiceById = (id) => API.get(`/services/${id}`);

// Actualités (public)
export const getActualites  = (params) => API.get('/actualites', { params });
export const getActualiteById = (id)   => API.get(`/actualites/${id}`);

export default API;
