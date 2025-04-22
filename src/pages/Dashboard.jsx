import React, { useEffect, useRef, useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip
} from '@mui/material';
import {
  LocationOn,
  Notifications as NotificationsIcon,
  Speed as SpeedIcon,
  ElectricBolt as ElectricIcon,
  Water as WaterIcon
} from '@mui/icons-material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import useSWR from 'swr';
import { AuthContext } from '../context/AuthContext';
import { AssetsContext } from '../context/AssetsContext';
import { ThemeContext } from '../context/ThemeContext';
import MainLayout from '../components/layout/MainLayout';
 
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ';

const fetcher = (url) => axios.get(url, {
  headers: {
    'x-auth-token': localStorage.getItem('token')
  }
}).then((res) => res.data);

const AssetTypeIcon = ({ type }) => {
  switch (type) {
    case 'well':
      return <WaterIcon color="primary" />;
    case 'motor':
      return <SpeedIcon color="secondary" />;
    case 'transformer':
      return <ElectricIcon style={{ color: '#ff9800' }} />;
    default:
      return <LocationOn color="primary" />;
  }
};

// Update the map initialization to use the ThemeContext
const Dashboard = () => {
  const { assets, loading, error } = useContext(AssetsContext);
  const { themeMode } = useContext(ThemeContext); // Add this line
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  
  // Instead, use a different name or just use mutate
  const { data, mutate } = useSWR(
    'http://localhost:5000/api/assets',
    fetcher
  );

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    // Choose map style based on theme mode
    const mapStyle = themeMode === 'dark' 
      ? "mapbox://styles/mapbox/dark-v10" 
      : "mapbox://styles/mapbox/streets-v11";
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Update state when map moves
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, [lng, lat, zoom, themeMode]); // Add themeMode to dependencies

  // Also update the map style when theme changes
  useEffect(() => {
    if (!map.current) return;
    
    const mapStyle = themeMode === 'dark' 
      ? "mapbox://styles/mapbox/dark-v10" 
      : "mapbox://styles/mapbox/streets-v11";
      
    map.current.setStyle(mapStyle);
  }, [themeMode]);

  // Add markers for assets
  useEffect(() => {
    if (!map.current || !assets) return;

    // Clear existing markers before adding new ones to prevent duplicates
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].parentNode.removeChild(markers[0]);
    }

    // Iterate through each asset and create a marker on the map
    assets.forEach(asset => {
      // Create a marker with color based on asset type
      const marker = new mapboxgl.Marker({ 
        color: getMarkerColor(asset.type) 
      })
        .setLngLat([asset.longitude, asset.latitude])
        .setPopup(
          // Create a popup with styled HTML to ensure visibility in both light and dark themes
          new mapboxgl.Popup()
            .setHTML(`
              <div style="color: #333; background-color: #fff; padding: 8px; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #1a73e8; font-weight: 500;">${asset.name}</h3>
                <p style="margin: 5px 0; color: #333;">Type: ${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</p>
                <p style="margin: 5px 0; color: #333;">Comments: ${asset.comments || 'None'}</p>
              </div>
            `)
    )
    .addTo(map.current);
  });
}, [assets]);

  // Helper function to get marker color based on asset type
  const getMarkerColor = (type) => {
    switch (type) {
      case 'well':
        return '#1a73e8'; // blue
      case 'motor':
        return '#00c853'; // green
      case 'transformer':
        return '#f57c00'; // orange
      default:
        return '#e53935'; // red
    }
  };

  // Set up WebSocket connection
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('newAsset', (asset) => {
      mutate();
      addNotification(`New asset "${asset.name}" added`);
    });
    
    socket.on('updateAsset', (asset) => {
      mutate();
      addNotification(`Asset "${asset.name}" updated`);
    });
    
    socket.on('deleteAsset', (assetId) => {
      mutate();
      addNotification(`Asset removed`);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [mutate]);

  const addNotification = (message) => {
    setNotifications(prev => [
      { id: Date.now(), message, time: new Date() },
      ...prev.slice(0, 4) // Keep only the 5 most recent notifications
    ]);
  };

  // Count assets by type
  const assetCounts = assets ? {
    total: assets.length,
    well: assets.filter(a => a.type === 'well').length,
    motor: assets.filter(a => a.type === 'motor').length,
    transformer: assets.filter(a => a.type === 'transformer').length
  } : { total: 0, well: 0, motor: 0, transformer: 0 };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Asset Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitor and manage your assets in real-time
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Asset Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {assetCounts.total}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {assetCounts.well}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Wells
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="secondary">
                {assetCounts.motor}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Motors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: '#ff9800' }}>
                {assetCounts.transformer}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Transformers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Map */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '500px' }}>
            <CardHeader 
              title="Asset Map" 
              subheader={`Current view: ${lng}, ${lat} | Zoom: ${zoom}`} 
            />
            <Divider />
            <Box sx={{ height: 'calc(100% - 73px)' }}>
              <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
            </Box>
          </Card>
        </Grid>
        
        {/* Notifications and Recent Assets */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card>
                <CardHeader 
                  title="Recent Notifications" 
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><NotificationsIcon /></Avatar>}
                />
                <Divider />
                <List sx={{ maxHeight: '200px', overflow: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <ListItem key={notification.id} divider>
                        <ListItemText 
                          primary={notification.message}
                          secondary={new Date(notification.time).toLocaleTimeString()}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No recent notifications" />
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
            
            <Grid item>
              <Card>
                <CardHeader title="Recent Assets" />
                <Divider />
                <List sx={{ maxHeight: '230px', overflow: 'auto' }}>
                  {assets && assets.length > 0 ? (
                    assets.slice(0, 5).map(asset => (
                      <ListItem key={asset.id} divider>
                        <ListItemIcon>
                          <AssetTypeIcon type={asset.type} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={asset.name}
                          secondary={`Type: ${asset.type}`}
                        />
                        <Chip 
                          label={`ID: ${asset.id}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No assets found" />
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;