import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    refreshInterval: 30,
    mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || ''
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings({
      ...settings,
      [name]: event.target.type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    // In a real app, you would save these settings to the backend
    alert('Settings saved!');
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure application settings
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Application Settings" />
            <Divider />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={handleChange}
                    name="notifications"
                    color="primary"
                  />
                }
                label="Enable Notifications"
                sx={{ mb: 2, display: 'block' }}
              />
              
              {/* Eliminado el switch de modo oscuro */}
              
              <TextField
                label="Data Refresh Interval (seconds)"
                type="number"
                name="refreshInterval"
                value={settings.refreshInterval}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Map Settings" />
            <Divider />
            <CardContent>
              <TextField
                label="Mapbox Token"
                name="mapboxToken"
                value={settings.mapboxToken}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </MainLayout>
  );
};

export default Settings;