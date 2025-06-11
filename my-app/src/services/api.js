// src/services/api.js
import axios from 'axios';

// A URL base da sua API de backend.
// **MUITO IMPORTANTE:** Consulte seu time de backend para pegar a URL correta.
// Pode ser algo como 'http://localhost:3001/api' durante o desenvolvimento.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout para as requisições
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional, mas RECOMENDADO: Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Supondo que o token será salvo aqui
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptor para lidar com erros de resposta (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Lógica para deslogar o usuário ou redirecionar para a página de login
      console.error('Autenticação expirada ou inválida. Deslogando...');
      localStorage.removeItem('authToken');
      // window.location.href = '/login'; // Redirecionar para login
    }
    return Promise.reject(error);
  }
);

export default api;