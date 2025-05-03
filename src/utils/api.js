import axios from "axios";

const api = axios.create({
  baseURL: "", // URL vacía para usar el proxy
  headers: {
    "Content-Type": "application/json",
  },
});

const errorMsg = "Error al cargar los activos";

// Puedes agregar interceptores aquí si usas autenticación

export default api;
