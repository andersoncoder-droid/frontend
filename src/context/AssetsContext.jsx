import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { NotificationContext } from "./NotificationContext";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const AssetsContext = createContext();

// Mover los datos de prueba fuera del componente para que no se recreen en cada renderizado
const mockAssets = [
  {
    id: 1,
    name: "Pozo Barrancabermeja",
    type: "well",
    latitude: 7.065,
    longitude: -73.8547,
    comments: "Pozo principal",
  },
  {
    id: 2,
    name: "Motor Medellín",
    type: "motor",
    latitude: 6.2476,
    longitude: -75.5658,
    comments: "Motor de alta potencia",
  },
  {
    id: 3,
    name: "Transformador Bogotá",
    type: "transformer",
    latitude: 4.711,
    longitude: -74.0721,
    comments: "Transformador principal",
  },
  {
    id: 4,
    name: "Pozo Cali",
    type: "well",
    latitude: 3.4516,
    longitude: -76.532,
    comments: "Pozo secundario",
  },
];

export const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);

  // Usar useCallback para evitar recrear la función en cada renderizado
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);

      // Comentar la petición a la API y usar datos de prueba
      // const response = await api.get('/api/assets');
      // setAssets(response.data);

      // Usar datos de prueba en su lugar
      setAssets(mockAssets);
      setError(null);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to load assets");
      // Solo mostrar la notificación si hay un error real
      addNotification("Error al cargar los activos", "error");
    } finally {
      setLoading(false);
    }
  }, [addNotification]); // Eliminar mockAssets de las dependencias

  // Cargar activos iniciales
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Añadir un nuevo activo
  const addAsset = async (newAsset) => {
    try {
      // Comentar la petición a la API
      // const response = await api.post('/api/assets', newAsset);

      // Crear un nuevo activo con ID generado
      const newId =
        assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
      const createdAsset = { ...newAsset, id: newId };

      // Actualizar el estado local sin provocar una recarga completa
      const updatedAssets = [...assets, createdAsset];
      setAssets(updatedAssets);

      console.log("Activo añadido:", createdAsset);
      console.log("Lista actualizada de activos:", updatedAssets);

      // Mostrar notificación
      addNotification(
        `Activo "${createdAsset.name}" añadido correctamente`,
        "success"
      );
      return createdAsset;
    } catch (err) {
      console.error("Error adding asset:", err);
      addNotification("Error al añadir el activo", "error");
      throw err;
    }
  };

  // Actualizar un activo existente
  const updateAsset = async (updatedAsset) => {
    try {
      // Comentar la petición a la API
      // const response = await api.put(`/api/assets/${updatedAsset.id}`, updatedAsset);

      const updatedAssets = assets.map((asset) =>
        asset.id === updatedAsset.id ? updatedAsset : asset
      );

      setAssets(updatedAssets);
      console.log("Activo actualizado:", updatedAsset);
      console.log("Lista actualizada de activos:", updatedAssets);

      // Mostrar notificación
      addNotification(
        `Activo "${updatedAsset.name}" actualizado correctamente`,
        "info"
      );
      return updatedAsset;
    } catch (err) {
      console.error("Error updating asset:", err);
      addNotification("Error al actualizar el activo", "error");
      throw err;
    }
  };

  // Eliminar un activo
  const deleteAsset = async (assetId) => {
    try {
      // Encontrar el nombre del activo antes de eliminarlo
      const assetToDelete = assets.find((asset) => asset.id === assetId);

      // Comentar la petición a la API
      // await api.delete(`/api/assets/${assetId}`);

      const updatedAssets = assets.filter((asset) => asset.id !== assetId);
      setAssets(updatedAssets);

      console.log("Activo eliminado:", assetId);
      console.log("Lista actualizada de activos:", updatedAssets);

      // Mostrar notificación
      if (assetToDelete) {
        addNotification(
          `Activo "${assetToDelete.name}" eliminado correctamente`,
          "warning"
        );
      } else {
        addNotification(`Activo eliminado correctamente`, "warning");
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
      addNotification("Error al eliminar el activo", "error");
      throw err;
    }
  };

  // Verificar si el usuario puede editar/eliminar activos
  const canEditAssets = () => {
    return user && user.role === "admin";
  };

  return (
    <AssetsContext.Provider
      value={{
        assets,
        loading,
        error,
        addAsset,
        updateAsset,
        deleteAsset,
        canEditAssets,
        refreshAssets: fetchAssets, // Exponer la función para actualizaciones manuales
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
