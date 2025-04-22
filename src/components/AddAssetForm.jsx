import React, { useState, useContext } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import axios from 'axios';
import { AssetsContext } from '../context/AssetsContext';

const assetTypes = [
  { value: 'well', label: 'Well' },
  { value: 'motor', label: 'Motor' },
  { value: 'transformer', label: 'Transformer' },
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'other', label: 'Other' }
];

const AddAssetForm = ({ onAssetAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    latitude: '',
    longitude: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addAsset } = useContext(AssetsContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate coordinates are numbers
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Latitude and longitude must be valid numbers');
      }
      
      // Create new asset with parsed coordinates
      const newAsset = {
        id: Date.now(),
        ...formData,
        latitude: lat,
        longitude: lng,
        createdAt: new Date().toISOString()
      };
      
      // Add to global context
      addAsset(newAsset);
      
      // Call the callback function to update the parent component
      if (onAssetAdded) onAssetAdded(newAsset);
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        latitude: '',
        longitude: '',
        comments: ''
      });
      
    } catch (err) {
      setError(err.message || 'Error adding asset');
      console.error('Error adding asset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Asset
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Asset Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Asset Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Asset Type"
              >
                {assetTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Latitude"
              name="latitude"
              type="number"
              inputProps={{ 
                step: 'any',
                style: { appearance: 'textfield' } // Removes spinners in most browsers
              }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
                '& input[type=number]': {
                  '-moz-appearance': 'textfield', // Removes spinners in Firefox
                },
              }}
              value={formData.latitude}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Longitude"
              name="longitude"
              type="number"
              inputProps={{ 
                step: 'any',
                style: { appearance: 'textfield' } // Removes spinners in most browsers
              }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
                '& input[type=number]': {
                  '-moz-appearance': 'textfield', // Removes spinners in Firefox
                },
              }}
              value={formData.longitude}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comments"
              name="comments"
              multiline
              rows={3}
              value={formData.comments}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Adding...' : 'Add Asset'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddAssetForm;