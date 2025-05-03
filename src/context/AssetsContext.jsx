// AssetsContext.jsx
// Provides asset management context (CRUD, permissions, notifications).
// Uses mock data for development. Handles add, update, delete, and fetch.

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from "react";
import api from "../services/api"; // Cambiado de "../utils/api" a "../services/api"
import { NotificationContext } from "./NotificationContext";
import { AuthContext } from "./AuthContext";

export const AssetsContext = createContext();

export const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastError = useRef(null);
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const isInitialMount = useRef(true);
  const storedAssets = useRef([]);  // Nuevo ref para mantener los assets

  const fetchAssets = useCallback(async () => {
    if (!user) {
      setAssets([]);
      setLoading(false);
      setError("Usuario no autenticado");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      lastError.current = null;
      
      // Si ya tenemos assets almacenados, los usamos
      if (storedAssets.current.length > 0) {
        setAssets(storedAssets.current);
      } else {
        // Si no hay assets almacenados, cargamos los mock iniciales
        const mockAssets = [
          {
            id: 1,
            name: "Pozo Cusiana",
            type: "well",
            latitude: 5.4397,
            longitude: -72.7075,
            comments: "Pozo principal en el campo Cusiana",
            createdAt: new Date().toISOString(),
            createdBy: "admin"
          },
          {
            id: 2,
            name: "Motor Caño Limón",
            type: "motor",
            latitude: 6.9897,
            longitude: -71.3047,
            comments: "Motor principal del campo Caño Limón",
            createdAt: new Date().toISOString(),
            createdBy: "admin"
          },
          {
            id: 3,
            name: "Transformador La Cira",
            type: "transformer",
            latitude: 7.0375,
            longitude: -73.8141,
            comments: "Transformador principal del campo La Cira-Infantas",
            createdAt: new Date().toISOString(),
            createdBy: "admin"
          }
        ];
        storedAssets.current = mockAssets;
        setAssets(mockAssets);
      }
      
      setLoading(false);
    } catch (err) {
      const errorMsg = "Error al cargar los activos";
      setError(errorMsg);
      if (lastError.current !== errorMsg) {
        addNotification(errorMsg, "error");
        lastError.current = errorMsg;
      }
      setLoading(false);
    }
  }, [user, addNotification]);

  const addAsset = async (newAsset) => {
    try {
      const createdAsset = {
        ...newAsset,
        id: storedAssets.current.length + 1,
        createdAt: new Date().toISOString(),
        createdBy: user.username || 'admin'
      };
      
      storedAssets.current = [...storedAssets.current, createdAsset];
      setAssets(storedAssets.current);
      
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

  const updateAsset = async (updatedAsset) => {
    try {
      const existingAsset = storedAssets.current.find(a => a.id === updatedAsset.id);
      const asset = {
        ...updatedAsset,
        createdAt: existingAsset.createdAt,
        createdBy: existingAsset.createdBy
      };
      
      storedAssets.current = storedAssets.current.map((a) => 
        a.id === asset.id ? asset : a
      );
      setAssets(storedAssets.current);
      
      addNotification(
        `Activo "${asset.name}" actualizado correctamente`,
        "info"
      );
      return asset;
    } catch (err) {
      console.error("Error updating asset:", err);
      addNotification("Error al actualizar el activo", "error");
      throw err;
    }
  };

  const deleteAsset = async (assetId) => {
    try {
      storedAssets.current = storedAssets.current.filter(
        (asset) => asset.id !== assetId
      );
      setAssets(storedAssets.current);
      addNotification(`Activo eliminado correctamente`, "warning");
    } catch (err) {
      console.error("Error deleting asset:", err);
      addNotification("Error al eliminar el activo", "error");
      throw err;
    }
  };

  const canEditAsset = (asset) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "operator") {
      return asset.createdBy === user.username;
    }
    return false;
  };

  const canDeleteAsset = (asset) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "operator") {
      return asset.createdBy === user.username;
    }
    return false;
  };

  const canCreateAssets = () => {
    return user && (user.role === "admin" || user.role === "operator");
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
        canEditAsset,
        canDeleteAsset,
        canCreateAssets,
        refreshAssets: fetchAssets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

// fetchAssets: Loads assets (mocked for now).
// addAsset: Adds a new asset to state and notifies.
// updateAsset: Updates an asset in state and notifies.
// deleteAsset: Removes asset from state and notifies.
// canEditAssets: Checks if user can edit/delete assets.
