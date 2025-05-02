import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, LocationOn, Add } from '@mui/icons-material';
import { AssetsContext } from '../context/AssetsContext';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const AssetList = () => {
  const { assets, loading, error, deleteAsset, canEditAssets } = useContext(AssetsContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getAssetTypeColor = (type) => {
    switch (type) {
      case 'well': return 'primary';
      case 'motor': return 'secondary';
      case 'transformer': return 'warning';
      default: return 'default';
    }
  };

  const getAssetTypeName = (type) => {
    switch (type) {
      case 'well': return 'Pozo';
      case 'motor': return 'Motor';
      case 'transformer': return 'Transformador';
      default: return 'Otro';
    }
  };

  const handleAddAsset = () => {
    navigate('/map');
  };

  if (loading) return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    </MainLayout>
  );

  if (error) return (
    <MainLayout>
      <Typography color="error">Error: {error}</Typography>
    </MainLayout>
  );

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Lista de Activos
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Gestiona todos los activos registrados
          </Typography>
        </div>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddAsset}
        >
          Añadir Activo
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Comentarios</TableCell>
              {canEditAssets() && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEditAssets() ? 6 : 5} align="center">
                  No hay activos registrados
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getAssetTypeName(asset.type)} 
                      color={getAssetTypeColor(asset.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      {asset.latitude.toFixed(4)}, {asset.longitude.toFixed(4)}
                    </Box>
                  </TableCell>
                  <TableCell>{asset.comments || 'Sin comentarios'}</TableCell>
                  {canEditAssets() && (
                    <TableCell>
                      <IconButton size="small" onClick={() => navigate(`/assets/edit/${asset.id}`)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => deleteAsset(asset.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainLayout>
  );
};

export default AssetList;