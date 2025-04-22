import React, { useRef, useContext, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";
import { SocketContext } from "../context/SocketContext";
import { ThemeContext } from "../context/ThemeContext";
import { AssetsContext } from "../context/AssetsContext";

// Use a valid public Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ';

// Add custom CSS for popups to ensure they're visible in both themes
const customPopupStyle = `
  .mapboxgl-popup-content {
    background-color: #ffffff;
    color: #333333;
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .mapboxgl-popup-content h3 {
    margin-top: 0;
    color: #1a73e8;
    font-weight: 500;
  }
  .mapboxgl-popup-content p {
    margin: 5px 0;
    color: #333333;
  }
  .mapboxgl-popup-close-button {
    color: #333333;
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
`;

// Create a map style context to share map style across components
export const getMapStyle = (themeMode) => {
  return themeMode === 'dark' 
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

  // Add custom popup styles when component mounts
  useEffect(() => {
    // Add custom styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = customPopupStyle;
    document.head.appendChild(styleElement);

    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      center: [-74.5, 40], // Initial coordinates
      zoom: 9,
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

    const addMarkers = () => {
      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Add markers for each asset
      assets.forEach((asset) => {
        // Create a marker
        const marker = new mapboxgl.Marker({ color: getMarkerColor(asset.type) })
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
    };

    // If map is already loaded, add markers immediately
    if (mapInstance.current.loaded()) {
      addMarkers();
    } else {
      // Otherwise wait for map to load
      mapInstance.current.on('load', addMarkers);
    }
  }, [assets, themeMode]);

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

  return <MapWrapper ref={mapContainer} />;
};

export default MapComponent;
