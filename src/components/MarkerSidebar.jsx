import { FiMapPin } from "react-icons/fi";

function MarkerSidebar({ markers }) {
  const count = markers.length;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Field Log</h3>
        <span className="entry-count">{String(count).padStart(3, "0")}</span>
      </div>

      <div className="sidebar-list-container">
        {count === 0 ? (
          <div className="empty-state">
            <FiMapPin size={22} />
            <p>No markers logged yet.</p>
            <span>Tap the map to drop a pin.</span>
          </div>
        ) : (
          markers.map((m, i) => (
            <div className="sidebar-list-item" key={m.id}>
              <span className="entry-id">
                MRK-{String(i + 1).padStart(3, "0")}
              </span>
              <div className="entry-coords">
                <span>
                  <em>LAT</em> {m.lat.toFixed(4)}
                </span>
                <span>
                  <em>LNG</em> {m.lng.toFixed(4)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MarkerSidebar;
