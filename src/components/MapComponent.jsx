import React, { useRef, useContext, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";
import { SocketContext } from "../context/SocketContext";
import { AssetsContext } from "../context/AssetsContext";
import {
  getAssetIcon,
  getAssetColor,
  getIconBackground,
} from "../utils/assetIcons";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ";

const MapWrapper = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;

  .mapboxgl-popup-content {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .mapboxgl-popup-tip {
    border-top-color: white;
  }

  .mapboxgl-ctrl-group {
    background-color: white;
  }
`;

const MapComponent = ({ assets }) => {
  const socket = useContext(SocketContext);
  const { addAsset } = useContext(AssetsContext);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Initialize map
  useEffect(() => {
    if (mapInstance.current) return;

    // Create map instance
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.0721, 4.711],
      zoom: 5,
    });

    mapInstance.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when assets change
  useEffect(() => {
    if (!mapInstance.current || !assets || assets.length === 0) return;

    const addMarkers = () => {
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      assets.forEach((asset) => {
        const el = document.createElement("div");
        el.className = `asset-marker asset-marker-${asset.type}`;
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.backgroundSize = "70%";
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundPosition = "center";
        el.style.backgroundImage = `url("${getAssetIcon(asset.type)}")`;
        el.style.backgroundColor = getIconBackground(asset.type);
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        // Convert latitude and longitude to numbers
        const lat = parseFloat(asset.latitude);
        const lng = parseFloat(asset.longitude);

        new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <h3>${asset.name}</h3>
              <p>Tipo: ${
                asset.type.charAt(0).toUpperCase() + asset.type.slice(1)
              }</p>
              <p>Comentarios: ${asset.comments || "N/A"}</p>
              <p>Creado el: ${new Date(asset.createdAt).toLocaleDateString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}</p>
              <p>Creado por: ${asset.createdBy || "Desconocido"}</p>
              <p>Ubicación: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
            `)
          )
          .addTo(mapInstance.current);

        if (assets.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          assets.forEach((asset) => {
            bounds.extend([parseFloat(asset.longitude), parseFloat(asset.latitude)]);
          });
          mapInstance.current.fitBounds(bounds, { padding: 40 });
        }
      });
    };

    if (mapInstance.current.loaded()) {
      addMarkers();
    } else {
      mapInstance.current.on("load", addMarkers);
    }
  }, [assets]);

  return <MapWrapper ref={mapContainer} />;
};

export default MapComponent;
