import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Paper, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MapComponent from '../components/MapComponent';
import AddAssetForm from '../components/AddAssetForm';
import MainLayout from '../components/layout/MainLayout';
import { AssetsContext } from '../context/AssetsContext';

const MapView = () => {
  const { assets, refreshAssets } = useContext(AssetsContext);
  const [showForm, setShowForm] = useState(false);
  
  // Efecto para actualizar los assets cuando se monta el componente
  useEffect(() => {
    console.log('MapView - Assets actuales:', assets);
    // Opcional: Refrescar los assets al montar el componente
    refreshAssets();
  }, [refreshAssets]);
  
  const handleAssetAdded = (newAsset) => {
    console.log('Nuevo asset añadido:', newAsset);
    setShowForm(false); // Ocultar formulario después de añadir
    // Opcional: Refrescar los assets después de añadir uno nuevo
    refreshAssets();
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Map View
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Interactive map of all assets
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Paper sx={{ p: 2 }}>
          {/* Pasar los assets como prop al componente del mapa */}
          <MapComponent assets={assets} />
        </Paper>
        
        {/* Floating action button to show/hide form */}
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={() => setShowForm(!showForm)}
          sx={{ 
            position: 'absolute', 
            bottom: 20, 
            right: 20,
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>
        
        {/* Overlay form */}
        {showForm && (
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: { xs: '90%', sm: '60%', md: '40%' },
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 1200
          }}>
            <AddAssetForm onAssetAdded={handleAssetAdded} />
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default MapView;