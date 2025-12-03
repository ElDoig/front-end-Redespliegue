// src/services/api.js
import axios from "axios";

// Creamos la conexión base
const api = axios.create({
  baseURL: "https://progra-back-end.vercel.app/api" , // La URL de tu Backend real
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