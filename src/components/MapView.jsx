import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ markers, setMarkers, polygons, setPolygons }) => {
  const [polygonArea, setPolygonArea] = React.useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const drawRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [77.2091, 28.6139],
      zoom: 11,
      style: "mapbox://styles/mapbox/streets-v12",
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        trash: true,
        polygon: true,
      },
    });

    drawRef.current = draw;

    const updateArea = (e) => {
      const data = draw.getAll();
      if (data?.features?.length > 0) {
        const area = turf.area(data);
        setPolygonArea(area);
        setPolygons(data.features);
      } else {
        setPolygonArea(null);
      }
    };

    map.on("click", (e) => {
      if (draw.getMode() === "draw_polygon") return;
      const { lng, lat } = e.lngLat;
      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(`Lng: ${lng}, Lat: ${lat}`))
        .addTo(map);

      marker.getElement().addEventListener("click", (event) => {
        event.stopPropagation();
        marker.togglePopup();
      });

      markerRef.current.push(marker);
      setMarkers((prev) => [
        ...prev,
        {
          lng: lng,
          lat: lat,
          id: Date.now(),
        },
      ]);
    });

    map.addControl(draw);
    map.on("draw.create", updateArea);
    map.on("draw.update", updateArea);
    map.on("draw.delete", () => {
      setPolygonArea(null);
      setPolygons([]);
    });

    mapRef.current = map;

    map.on("load", () => {
      const parsedData = JSON.parse(localStorage.getItem("map-state"));
      if (!parsedData) return;
      parsedData.markers.forEach((el) => {
        console.log("kajd lkfjl el", parsedData);
        const marker = new mapboxgl.Marker()
          .setLngLat([el.lng, el.lat])
          .setPopup(
            new mapboxgl.Popup().setText(`Lng: ${el.lng}, Lat: ${el.lat}`)
          )
          .addTo(map);
        marker.getElement().addEventListener("click", (event) => {
          event.stopPropagation();
          marker.togglePopup();
        });
        markerRef.current.push(marker);
      });
      if (parsedData?.polygons?.length > 0) {
        draw.set({
          type: "FeatureCollection",
          features: parsedData.polygons,
        });
      }
      setMarkers(parsedData?.markers);
      setPolygons(parsedData?.polygons);
    });

    return () => {
      map.remove();
    };
  }, []);

  const saveData = () => {
    localStorage.setItem("map-state", JSON.stringify({ markers, polygons }));
  };

  const clearData = () => {
    localStorage.removeItem("map-state");
    setMarkers([]);
    setPolygons([]);
    setPolygonArea(null);
    markerRef.current.forEach((el) => {
      el.remove();
    });
    drawRef.current.deleteAll();
  };
  const export_data = () => {
    const exportData = drawRef.current.getAll();
    markers.forEach((el) => {
      exportData?.features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [el.lng, el.lat],
        },
      });
    });

    console.log("exportData", exportData);

    const blob = new Blob([JSON.stringify(exportData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "map-state.geojson";
    anchor.click();
  };

  return (
    <div className="map-wrapper">
      <div className="map-container" ref={mapContainerRef} />
      <div className="controls">
        <button onClick={saveData}>Save</button>
        <button onClick={clearData}>Clear</button>
        <button onClick={export_data}>Export</button>
      </div>
    </div>
  );
};

export default MapView;
