import React, { useRef, useEffect, useContext, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";
import { AssetsContext } from "../context/AssetsContext";
import { getAssetIcon, getIconBackground } from "../utils/assetIcons";

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
`;

const DashboardMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYW5kZXJzb25sb3NhZGEiLCJhIjoiY203eTNlNXdoMDVvMTJqb2thanV1YTU3NSJ9.mR2ivDi1z73GMHc-sIZpHQ";
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { assets, refreshAssets } = useContext(AssetsContext);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const initialLoadRef = useRef(false);

  // Efecto para cargar los activos solo una vez al montar el componente
  useEffect(() => {
    if (!initialLoadRef.current) {
      console.log("DashboardMap - Refrescando activos");
      refreshAssets();
      setAssetsLoaded(true);
      initialLoadRef.current = true;
    }
  }, []); // Dependencia vacía para que solo se ejecute al montar

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.0721, 4.711],
      zoom: 5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when assets change
  useEffect(() => {
    if (!map.current || !assets || assets.length === 0) return;

    console.log("DashboardMap - Actualizando marcadores con assets:", assets);

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

        new mapboxgl.Marker({ element: el })
          .setLngLat([asset.longitude, asset.latitude])
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
            `)
          )
          .addTo(map.current); // Changed from mapInstance.current to map.current
      });

      if (assets.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        assets.forEach((asset) => {
          bounds.extend([asset.longitude, asset.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 40 });
      }
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on("load", addMarkers);
    }
  }, [assets, assetsLoaded]);

  return <MapContainer ref={mapContainer} />;
};

export default DashboardMap;
