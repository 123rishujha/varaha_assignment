import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { FiSave, FiTrash2, FiDownload, FiUpload } from "react-icons/fi";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ markers, setMarkers, polygons, setPolygons }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const markersRef = useRef([]);
  const fileInputRef = useRef(null);

  const [polygonArea, setPolygonArea] = useState(null);

  const createMarker = (map, lng, lat) => {
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup().setText(
          `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
        )
      )
      .addTo(map);

    marker.getElement().addEventListener("click", (e) => {
      e.stopPropagation();
      marker.togglePopup();
    });

    markersRef.current.push(marker);
    return marker;
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [77.2091, 28.6139],
      zoom: 11,
      style: "mapbox://styles/mapbox/streets-v12",
    });

    mapRef.current = map;

    map.on("load", () => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          trash: true,
          polygon: true,
        },
      });

      map.addControl(draw);
      drawRef.current = draw;

      const updateArea = () => {
        const data = draw.getAll();
        if (data?.features?.length > 0) {
          const area = turf.area(data);
          setPolygonArea(area.toFixed(2));
          setPolygons(data.features);
        } else {
          setPolygonArea(null);
        }
      };

      map.on("click", (e) => {
        if (draw.getMode() === "draw_polygon") return;

        const { lng, lat } = e.lngLat;
        createMarker(map, lng, lat);

        setMarkers((prev) => [...(prev || []), { lng, lat, id: Date.now() }]);
      });

      map.on("draw.create", updateArea);
      map.on("draw.update", updateArea);
      map.on("draw.delete", () => {
        setPolygonArea(null);
        setPolygons([]);
      });

      const saved = localStorage.getItem("mapstate");
      if (saved) {
        const parsed = JSON.parse(saved);

        parsed.markers?.forEach((m) => {
          createMarker(map, m.lng, m.lat);
        });
        setMarkers(parsed.markers || []);

        if (parsed.polygons?.length > 0) {
          draw.set({ type: "FeatureCollection", features: parsed.polygons });
          setPolygons(parsed.polygons);
          updateArea();
        }
      }
    });

    return () => map.remove();
  }, []);

  const saveData = () => {
    localStorage.setItem("mapstate", JSON.stringify({ markers, polygons }));
    alert("Map state saved!");
  };

  const clearAll = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    drawRef.current.deleteAll();
    setMarkers([]);
    setPolygons([]);
    setPolygonArea(null);
    localStorage.removeItem("mapstate");
  };

  const exportGeoJSON = () => {
    const data = drawRef.current.getAll();

    data.features.push(
      ...markers.map((m) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [m.lng, m.lat] },
        properties: {},
      }))
    );

    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map-data.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const geojson = JSON.parse(event.target.result);

        if (!geojson.features || !Array.isArray(geojson.features)) {
          alert("Invalid GeoJSON file");
          return;
        }

        const importedMarkers = [];
        const polygonFeatures = [];
        const map = mapRef.current;

        geojson.features.forEach((feature) => {
          if (feature.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates;
            createMarker(map, lng, lat);
            importedMarkers.push({ lng, lat, id: Date.now() + Math.random() });
          } else if (
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            polygonFeatures.push(feature);
          }
        });

        setMarkers((prev) => [...prev, ...importedMarkers]);

        if (polygonFeatures.length > 0) {
          const existing = drawRef.current.getAll();
          const merged = {
            type: "FeatureCollection",
            features: [...existing.features, ...polygonFeatures],
          };
          drawRef.current.set(merged);
          setPolygons(merged.features);

          const area = turf.area(merged);
          setPolygonArea(area.toFixed(2));
        }

        alert("GeoJSON imported successfully!");
      } catch (err) {
        alert("Error parsing GeoJSON file");
        console.error(err);
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="map-wrapper">
      <div className="map-container" ref={mapContainerRef} />

      {polygonArea && (
        <div className="area-stamp">
          <span className="stamp-label">POLYGON AREA</span>
          <span className="stamp-value">{polygonArea} m²</span>
        </div>
      )}

      <div className="controls">
        <button className="control-btn btn-save" onClick={saveData}>
          <FiSave size={15} />
          <span>Save</span>
        </button>
        <button className="control-btn btn-clear" onClick={clearAll}>
          <FiTrash2 size={15} />
          <span>Clear</span>
        </button>
        <button className="control-btn btn-export" onClick={exportGeoJSON}>
          <FiDownload size={15} />
          <span>Export</span>
        </button>
        <button className="control-btn btn-import" onClick={handleImportClick}>
          <FiUpload size={15} />
          <span>Import</span>
        </button>

        <input
          type="file"
          accept=".geojson,application/geo+json,application/json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default MapView;
