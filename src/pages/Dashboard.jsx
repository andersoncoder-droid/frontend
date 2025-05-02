import React, { useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  LocationOn,
} from "@mui/icons-material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthContext } from "../context/AuthContext";
import { AssetsContext } from "../context/AssetsContext";
import { ThemeContext } from "../context/ThemeContext";
import { SocketContext } from "../context/SocketContext";
import { NotificationContext } from "../context/NotificationContext";
import MainLayout from "../components/layout/MainLayout";
import RecentNotifications from "../components/RecentNotifications";
import { getAssetIcon, getAssetColor } from "../utils/assetIcons";
import DashboardMap from "../components/DashboardMap";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ";

const AssetTypeIcon = ({ type }) => {
  return (
    <Avatar sx={{ bgcolor: getAssetColor(type), width: 40, height: 40 }}>
      <img 
        src={getAssetIcon(type)} 
        alt={`${type} icon`} 
        style={{ 
          width: '24px', 
          height: '24px' 
        }} 
      />
    </Avatar>
  );
};

function Dashboard() {
  const { assets, loading, refreshAssets } = useContext(AssetsContext);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { addNotification } = useContext(NotificationContext);

  // Efecto para actualizar los activos al montar el componente
  useEffect(() => {
    console.log('Dashboard - Refrescando activos al iniciar');
    refreshAssets();
    
    // También refrescar cuando el componente se vuelve a montar
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Dashboard visible - Refrescando activos');
        refreshAssets();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshAssets]);

  // Refresco automático cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refrescando activos automáticamente");
      refreshAssets();
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [refreshAssets]);

  // Configuración de WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    if (!socket) return;

    console.log("Socket conectado en Dashboard:", socket.connected);

    socket.on("newAsset", (asset) => {
      console.log("Evento newAsset recibido:", asset);
      refreshAssets();
      addNotification(`Nuevo activo "${asset.name}" añadido`, "success", true);
    });

    socket.on("updateAsset", (asset) => {
      console.log("Evento updateAsset recibido:", asset);
      refreshAssets();
      addNotification(`Activo "${asset.name}" actualizado`, "info", true);
    });

    socket.on("deleteAsset", (assetId) => {
      console.log("Evento deleteAsset recibido:", assetId);
      refreshAssets();
      addNotification(`Activo eliminado`, "warning", true);
    });

    return () => {
      if (socket) {
        socket.off("newAsset");
        socket.off("updateAsset");
        socket.off("deleteAsset");
      }
    };
  }, [socket, addNotification, refreshAssets]);

  // Contar activos por tipo
  const assetCounts = assets
    ? {
        total: assets.length,
        well: assets.filter((a) => a.type === "well").length,
        motor: assets.filter((a) => a.type === "motor").length,
        transformer: assets.filter((a) => a.type === "transformer").length,
      }
    : { total: 0, well: 0, motor: 0, transformer: 0 };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Control
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitoreo de activos en tiempo real
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                <LocationOn />
              </Avatar>
              <Box>
                <Typography variant="h5">{assetCounts.total}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Activos
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <AssetTypeIcon type="well" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5">{assetCounts.well}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Pozos
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <AssetTypeIcon type="motor" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5">{assetCounts.motor}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Motores
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <AssetTypeIcon type="transformer" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5">{assetCounts.transformer}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Transformadores
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mapa y Notificaciones */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mapa de Activos
            </Typography>
            <DashboardMap />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentNotifications />
        </Grid>
      </Grid>
    </MainLayout>
  );
}

export default Dashboard;
