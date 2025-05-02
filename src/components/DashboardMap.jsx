import React, { useRef, useEffect, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import { AssetsContext } from '../context/AssetsContext';
import { ThemeContext } from '../context/ThemeContext';
import { getAssetIcon, getAssetColor, getIconBackground } from "../utils/assetIcons";
import { getMapStyle } from './MapComponent';

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
`;

// Add custom CSS for popups to ensure they're visible in both themes
const getCustomPopupStyle = (themeMode) => {
  const isDarkMode = themeMode === 'dark';
  
  return `
    .mapboxgl-popup-content {
      background-color: ${isDarkMode ? '#333333' : '#ffffff'};
      color: ${isDarkMode ? '#ffffff' : '#333333'};
      padding: 12px;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .mapboxgl-popup-content h4 {
      margin-top: 0;
      color: ${isDarkMode ? '#64b5f6' : '#1a73e8'};
      font-weight: 500;
    }
    .mapboxgl-popup-content p {
      margin: 5px 0;
      color: ${isDarkMode ? '#e0e0e0' : '#333333'};
    }
    .mapboxgl-popup-close-button {
      color: ${isDarkMode ? '#ffffff' : '#333333'};
    }
    .mapboxgl-popup-tip {
      border-top-color: ${isDarkMode ? '#333333' : '#ffffff'};
      border-bottom-color: ${isDarkMode ? '#333333' : '#ffffff'};
    }
  `;
};

const DashboardMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { assets, refreshAssets } = useContext(AssetsContext);
  const { themeMode } = useContext(ThemeContext);
  const isDarkMode = themeMode === "dark";
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Añadir este efecto para refrescar los activos cuando se monta el componente
  useEffect(() => {
    console.log('DashboardMap - Refrescando activos');
    refreshAssets();
    setAssetsLoaded(true);
  }, [refreshAssets]);

  // Add custom popup styles when component mounts or theme changes
  useEffect(() => {
    // Get custom popup style based on theme mode
    const customPopupStyle = getCustomPopupStyle(themeMode);
    
    // Add custom styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = customPopupStyle;
    document.head.appendChild(styleElement);

    // Clean up on unmount or theme change
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [themeMode]);

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // already initialized

    // Get map style based on theme mode
    const mapStyle = getMapStyle(themeMode);

    // Create map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [-74.0721, 4.7110], // Coordenadas de Colombia (Bogotá)
      zoom: 5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [themeMode]);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current) return;
    
    const mapStyle = getMapStyle(themeMode);
    map.current.setStyle(mapStyle);
  }, [themeMode]);

  // Update markers when assets change
  useEffect(() => {
    if (!map.current || !assets || assets.length === 0) return;
    
    console.log('DashboardMap - Actualizando marcadores con assets:', assets);

    const addMarkers = () => {
      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Add markers for each asset
      assets.forEach((asset) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = `asset-marker asset-marker-${asset.type}`;
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.backgroundSize = '70%';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.style.backgroundImage = `url("${getAssetIcon(asset.type)}")`;
        el.style.backgroundColor = getIconBackground(asset.type, isDarkMode);
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Create marker
        new mapboxgl.Marker({ element: el })
          .setLngLat([asset.longitude, asset.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <h4>${asset.name}</h4>
              <p>Type: ${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</p>
              <p>Comments: ${asset.comments || "N/A"}</p>
            `)
          )
          .addTo(map.current);
      });

      // Fit map to show all markers
      if (assets.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        assets.forEach(asset => {
          bounds.extend([asset.longitude, asset.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 40 });
      }
    };

    // If map is already loaded, add markers immediately
    if (map.current.loaded()) {
      addMarkers();
    } else {
      // Otherwise wait for map to load
      map.current.on('load', addMarkers);
    }
  }, [assets, themeMode, isDarkMode, assetsLoaded]);

  return <MapContainer ref={mapContainer} />;
};

export default DashboardMap;
