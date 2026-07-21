import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import MarkerSidebar from "./components/MarkerSidebar";
import MapView from "./components/MapView";

//mapbox-gl
//mapbox-gl-draw

function App() {
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);

  return (
    <div className="App">
      <MarkerSidebar markers={markers} />
      <MapView
        markers={markers}
        setMarkers={setMarkers}
        polygons={polygons}
        setPolygons={setPolygons}
      />
    </div>
  );
}

export default App;
