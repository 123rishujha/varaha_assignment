import React from "react";

const MarkerSidebar = ({ markers }) => {
  return (
    <div className="sidebar">
      <h2>Markers List</h2>
      <div style={{}} className="sidebar-list-container">
        {markers?.map((el) => {
          <div className="sidebar-list-item">
            <p>Lng: {el.lng}</p>
            <p>Lat: {el.lat}</p>
          </div>;
        })}
      </div>
    </div>
  );
};

export default MarkerSidebar;
