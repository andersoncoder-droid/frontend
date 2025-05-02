import React, { useRef, useEffect, useContext } from 'react';
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
  
  // Añadir este efecto para refrescar los activos cuando se monta el componente
  useEffect(() => {
    console.log('DashboardMap - Refrescando activos');
    refreshAssets();
  }, [refreshAssets]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapStyle(themeMode),
      center: [-74.0721, 4.711], // Coordenadas de Colombia (Bogotá)
      zoom: 5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [themeMode]);

  useEffect(() => {
    if (!map.current || !assets || assets.length === 0) return;

    // Esperar a que el mapa esté cargado
    const addMarkers = () => {
      // Limpiar marcadores existentes
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Añadir marcadores para cada activo
      const bounds = new mapboxgl.LngLatBounds();

      assets.forEach((asset) => {
        // Crear elemento HTML para el icono personalizado
        const el = document.createElement("div");
        el.className = `asset-marker asset-marker-${asset.type}`;
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.backgroundSize = "70%";
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundPosition = "center";
        el.style.backgroundImage = `url("${getAssetIcon(asset.type)}")`;
        el.style.backgroundColor = getIconBackground(asset.type, isDarkMode);
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        // Crear marcador sin color adicional ya que usamos el fondo del div
        new mapboxgl.Marker({
          element: el,
        })
          .setLngLat([asset.longitude, asset.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h4>${asset.name}</h4>
              <p>Tipo: ${
                asset.type.charAt(0).toUpperCase() + asset.type.slice(1)
              }</p>
            `)
          )
          .addTo(map.current);

        // Extender los límites para incluir este marcador
        bounds.extend([asset.longitude, asset.latitude]);
      });

      // Ajustar el mapa para mostrar todos los marcadores
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 30,
          maxZoom: 10,
        });
      }
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on("load", addMarkers);
    }
  }, [assets, themeMode, isDarkMode]);

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

  return <MapContainer ref={mapContainer} />;
};

export default DashboardMap;
