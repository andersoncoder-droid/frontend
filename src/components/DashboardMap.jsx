import React, { useRef, useContext, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";
import { ThemeContext } from "../context/ThemeContext";

// Use the same token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ';

const MapWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
`;

// Define the function directly here to avoid import issues
const getMapStyle = (themeMode) => {
  return themeMode === 'dark' 
    ? "mapbox://styles/mapbox/dark-v10" 
    : "mapbox://styles/mapbox/streets-v11";
};

const DashboardMap = ({ center = [-74.5, 40], zoom = 7 }) => {
  const { themeMode } = useContext(ThemeContext);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

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
      center: center,
      zoom: zoom,
      interactive: false // Optional: make dashboard map non-interactive
    });

    // Clean up on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [themeMode, center, zoom]);

  return <MapWrapper ref={mapContainer} />;
};

export default DashboardMap;