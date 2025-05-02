import React, { useRef, useContext, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";
import { SocketContext } from "../context/SocketContext";
import { ThemeContext } from "../context/ThemeContext";
import { AssetsContext } from "../context/AssetsContext";
import {
  getAssetIcon,
  getAssetColor,
  getIconBackground,
} from "../utils/assetIcons";

// Use a valid public Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ";

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
    .mapboxgl-popup-content h3 {
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

const MapWrapper = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
`;

// Create a map style context to share map style across components
export const getMapStyle = (themeMode) => {
  return themeMode === "dark"
    ? "mapbox://styles/mapbox/dark-v10"
    : "mapbox://styles/mapbox/streets-v11";
};

const MapComponent = () => {
  const socket = useContext(SocketContext);
  const { themeMode } = useContext(ThemeContext);
  const { assets, addAsset } = useContext(AssetsContext);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Handle socket events for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on("new_asset", (asset) => {
      addAsset(asset);
    });

    return () => {
      socket.off("new_asset");
    };
  }, [socket, addAsset]);

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

  // Initialize map
  useEffect(() => {
    // Get map style based on theme mode
    const mapStyle = getMapStyle(themeMode);

    if (mapInstance.current) {
      mapInstance.current.setStyle(mapStyle);
      return;
    }

    // Create map instance
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [-74.0721, 4.711], // Coordenadas de Colombia (Bogotá)
      zoom: 6,
    });

    // Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl());

    // Clean up on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [themeMode]);

  // Update markers when assets change
  useEffect(() => {
    if (!mapInstance.current || !assets || assets.length === 0) return;

    const isDarkMode = themeMode === 'dark';

    const addMarkers = () => {
      // Clear existing markers
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Add markers for each asset
      assets.forEach((asset) => {
        // Crear el elemento HTML para el icono personalizado
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

        // Create a marker sin color adicional ya que usamos el fondo del div
        const marker = new mapboxgl.Marker({ 
          element: el
        })
          .setLngLat([asset.longitude, asset.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <h3>${asset.name}</h3>
              <p>Type: ${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</p>
              <p>Comments: ${asset.comments || "N/A"}</p>
            `)
          )
          .addTo(mapInstance.current);
      });

      // Ajustar el mapa para mostrar todos los marcadores
      if (assets.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        assets.forEach((asset) => {
          bounds.extend([asset.longitude, asset.latitude]);
        });
        mapInstance.current.fitBounds(bounds, { padding: 50 });
      }
    };

    // If map is already loaded, add markers immediately
    if (mapInstance.current.loaded()) {
      addMarkers();
    } else {
      // Otherwise wait for map to load
      mapInstance.current.on("load", addMarkers);
    }
  }, [assets, themeMode]);

  return <MapWrapper ref={mapContainer} />;
};

export default MapComponent;
