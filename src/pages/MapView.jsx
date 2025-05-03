import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Typography, Paper, Fab, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MapComponent from "../components/MapComponent";
import AddAssetForm from "../components/AddAssetForm";
import MainLayout from "../components/layout/MainLayout";
import { AssetsContext } from "../context/AssetsContext";

const MapView = () => {
  const { assets, refreshAssets } = useContext(AssetsContext);
  const initialLoadRef = useRef(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Efecto para actualizar los assets cuando se monta el componente
  useEffect(() => {
    if (!initialLoadRef.current) {
      console.log("MapView - Cargando assets iniciales");
      refreshAssets();
      initialLoadRef.current = true;
    }
  }, []); // Dependencia vacía para que solo se ejecute al montar

  const handleAssetAdded = (newAsset) => {
    console.log("Nuevo asset añadido:", newAsset);
    // Refrescar los assets después de añadir uno nuevo
    refreshAssets();
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedAsset(null);
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Map View
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Map View of all assets
        </Typography>
      </Box>

      <Box sx={{ position: "relative", width: "100%" }}>
        <Paper sx={{ p: 2 }}>
          <MapComponent assets={assets} />
        </Paper>

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenAddDialog(true)}
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            position: 'relative',
            zIndex: 1300,
            p: 2
          }
        }}
      >
        <DialogTitle>
          Añadir Nuevo Activo
        </DialogTitle>
        <DialogContent>
          <AddAssetForm
            onAssetAdded={() => {
              handleAssetAdded();
              handleCloseDialog();
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MapView;
