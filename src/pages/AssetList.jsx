import React, { useContext, useEffect } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit, Delete, LocationOn, Add } from '@mui/icons-material';
import { AssetsContext } from '../context/AssetsContext';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AddAssetForm from '../components/AddAssetForm';

const AssetList = () => {
  const { assets, loading, error, deleteAsset, canEditAssets, refreshAssets } = useContext(AssetsContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // Actualizar los activos cuando se monta el componente
  useEffect(() => {
    refreshAssets();
  }, [refreshAssets]);

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
    setOpenAddDialog(true);
  };

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setOpenEditDialog(true);
  };

  const handleDeleteAsset = (asset) => {
    setSelectedAsset(asset);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteAsset = async () => {
    if (selectedAsset) {
      await deleteAsset(selectedAsset.id);
      setOpenDeleteDialog(false);
      setSelectedAsset(null);
    }
  };

  const handleAssetAdded = () => {
    setOpenAddDialog(false);
    refreshAssets();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
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
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Creado Por</TableCell>
              <TableCell>Comentarios</TableCell>
              {canEditAssets() && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEditAssets() ? 8 : 7} align="center">
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
                  <TableCell>{formatDate(asset.createdAt)}</TableCell>
                  <TableCell>{asset.createdBy || 'Desconocido'}</TableCell>
                  <TableCell>{asset.comments || 'Sin comentarios'}</TableCell>
                  {canEditAssets() && (
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAsset(asset)}
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

      {/* Diálogo para añadir activo */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Añadir Nuevo Activo</DialogTitle>
        <DialogContent>
          <AddAssetForm onAssetAdded={handleAssetAdded} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el activo "{selectedAsset?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteAsset} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AssetList;