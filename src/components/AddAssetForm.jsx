import React, { useState, useContext } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AssetsContext } from '../context/AssetsContext';

const assetTypes = [
  { value: 'well', label: 'Pozo' },
  { value: 'motor', label: 'Motor' },
  { value: 'transformer', label: 'Transformador' },
];

const AddAssetForm = ({ onAssetAdded }) => {
  const { addAsset } = useContext(AssetsContext);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    type: 'well',
    latitude: '',
    longitude: '',
    comments: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.latitude) {
      newErrors.latitude = 'La latitud es obligatoria';
    } else if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'La latitud debe ser un número entre -90 y 90';
    }
    
    if (!formData.longitude) {
      newErrors.longitude = 'La longitud es obligatoria';
    } else if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'La longitud debe ser un número entre -180 y 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Convertir coordenadas a números
        const newAsset = {
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          // La fecha de creación y el creador se añaden en el contexto
        };
        
        // Añadir el activo a través del contexto
        const savedAsset = await addAsset(newAsset);
        
        // Notificar al componente padre
        if (onAssetAdded) {
          onAssetAdded(savedAsset);
        }
        
        // Limpiar el formulario
        setFormData({
          name: '',
          type: 'well',
          latitude: '',
          longitude: '',
          comments: '',
        });
        
        console.log('Activo añadido:', savedAsset);
      } catch (err) {
        console.error('Error al guardar el activo:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Paper sx={{ p: 3, position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => onAssetAdded()}
      >
        <CloseIcon />
      </IconButton>
      
      <Typography variant="h6" gutterBottom>
        Añadir Nuevo Activo
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nombre del Activo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          select
          id="type"
          label="Tipo de Activo"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          {assetTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="latitude"
          label="Latitud"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          error={!!errors.latitude}
          helperText={errors.latitude}
          InputProps={{
            endAdornment: <InputAdornment position="end">°</InputAdornment>,
          }}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="longitude"
          label="Longitud"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          error={!!errors.longitude}
          helperText={errors.longitude}
          InputProps={{
            endAdornment: <InputAdornment position="end">°</InputAdornment>,
          }}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="comments"
          label="Comentarios"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          multiline
          rows={3}
          disabled={isSubmitting}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Añadir Activo'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddAssetForm;