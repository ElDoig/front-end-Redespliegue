// src/services/api.js
import axios from "axios";

// Creamos la conexión base
const api = axios.create({
const API_BASE_URL = "https://progra-back-end.vercel.app/api"; 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Antes de cada petición, le pegamos el TOKEN si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Buscamos el token guardado
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);




export default api;