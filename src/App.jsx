import { useState } from "react";
import "./App.css";
import MarkerSidebar from "./components/MarkerSidebar";
import MapView from "./components/MapView";
import { FiMenu, FiX } from "react-icons/fi";

function App() {
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="App">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar-shell ${sidebarOpen ? "open" : ""}`}>
        <MarkerSidebar markers={markers} />
      </div>

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
