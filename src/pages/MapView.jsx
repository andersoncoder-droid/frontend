import React, { useState, useContext } from 'react';
import { Box, Typography, Paper, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MapComponent from '../components/MapComponent';
import AddAssetForm from '../components/AddAssetForm';
import MainLayout from '../components/layout/MainLayout';
import { AssetsContext } from '../context/AssetsContext';

const MapView = () => {
  const { assets } = useContext(AssetsContext);
  const [showForm, setShowForm] = useState(false);
  
  const handleAssetAdded = (newAsset) => {
    // The addAsset function will be called in the AddAssetForm component
    setShowForm(false); // Hide form after adding
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
          <MapComponent />
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