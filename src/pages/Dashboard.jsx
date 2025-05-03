import React, { useRef, useEffect, useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthContext } from "../context/AuthContext";
import { AssetsContext } from "../context/AssetsContext";
import { SocketContext } from "../context/SocketContext";
import { NotificationContext } from "../context/NotificationContext";
import MainLayout from "../components/layout/MainLayout";
import RecentNotifications from "../components/RecentNotifications";
import { getAssetIcon, getAssetColor } from "../utils/assetIcons";
import DashboardMap from "../components/DashboardMap";
import { Add, Edit, Delete } from "@mui/icons-material";
import AddAssetForm from "../components/AddAssetForm";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ";

const AssetTypeIcon = ({ type }) => {
  return (
    <Avatar sx={{ bgcolor: getAssetColor(type), width: 40, height: 40 }}>
      <img
        src={getAssetIcon(type)}
        alt={`${type} icon`}
        style={{
          width: "24px",
          height: "24px",
        }}
      />
    </Avatar>
  );
};

const Dashboard = () => {
  const {
    assets,
    loading,
    refreshAssets,
    deleteAsset,
    canEditAsset,
    canDeleteAsset,
  } = useContext(AssetsContext);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { addNotification } = useContext(NotificationContext);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const initialLoadRef = useRef(false);

  const handleAddAsset = () => {
    setOpenAddDialog(true);
  };

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setOpenAddDialog(true);
  };

  const handleDeleteAsset = (asset) => {
    setSelectedAsset(asset);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedAsset(null);
  };

  const handleAssetAdded = () => {
    setOpenAddDialog(false);
    refreshAssets();
  };

  const confirmDeleteAsset = async () => {
    if (selectedAsset) {
      await deleteAsset(selectedAsset.id);
      setOpenDeleteDialog(false);
      setSelectedAsset(null);
    }
  };

  // Efecto para actualizar los activos al montar el componente
  useEffect(() => {
    if (!initialLoadRef.current) {
      console.log("Dashboard - Refrescando activos al iniciar");
      refreshAssets();
      initialLoadRef.current = true;
    }
  }, [refreshAssets]); // Añadir refreshAssets como dependencia

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
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 6 }}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 2,
              height: '100%',
              boxShadow: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Mapa de Activos
            </Typography>
            <DashboardMap />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2,
              height: '100%',
              boxShadow: 2,
              backgroundColor: '#f8f9fa'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Notificaciones Recientes
            </Typography>
            <Box sx={{ mt: 2 }}>
              <RecentNotifications />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de Activos */}
      <Paper 
        sx={{ 
          p: 3,
          mt: 4,
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Gestión de Activos</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddAsset}
            sx={{
              minWidth: "auto",
              px: 2,
            }}
          >
            Añadir Activo
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Comentarios</TableCell>
                <TableCell align="right" sx={{ width: "120px" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        asset.type === "well"
                          ? "Pozo"
                          : asset.type === "motor"
                          ? "Motor"
                          : "Transformador"
                      }
                      color={
                        asset.type === "well"
                          ? "primary"
                          : asset.type === "motor"
                          ? "secondary"
                          : "warning"
                      }
                      size="small"
                      sx={{ minWidth: "80px" }}
                    />
                  </TableCell>
                  <TableCell>
                    {parseFloat(asset.latitude).toFixed(4)},{" "}
                    {parseFloat(asset.longitude).toFixed(4)}
                  </TableCell>
                  <TableCell>{asset.comments || "Sin comentarios"}</TableCell>
                  <TableCell align="right">
                    {(canEditAsset(asset) || canDeleteAsset(asset)) && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        {canEditAsset(asset) && (
                          <IconButton
                            size="small"
                            onClick={() => handleEditAsset(asset)}
                            sx={{
                              p: "4px",
                              "&:hover": { backgroundColor: "action.hover" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        {canDeleteAsset(asset) && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteAsset(asset)}
                            sx={{
                              p: "4px",
                              "&:hover": {
                                backgroundColor: "error.light",
                                color: "error.main",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo para añadir/editar activo */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>
          {selectedAsset ? "Editar Activo" : "Añadir Nuevo Activo"}
        </DialogTitle>
        <DialogContent>
          <AddAssetForm
            onAssetAdded={handleAssetAdded}
            initialData={selectedAsset}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro que desea eliminar este activo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteAsset} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default Dashboard;
