import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ riskData }) {
  const center = [27.33, 88.61]; // Sikkim coordinates

  const getColor = (level) => {
    if (level === 'CRITICAL') return 'red';
    if (level === 'HIGH') return 'orange';
    if (level === 'MODERATE') return 'yellow';
    return 'green';
  };

  return (
    <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {riskData && (
          <Circle 
            center={center} 
            pathOptions={{ 
              color: getColor(riskData.risk_level), 
              fillColor: getColor(riskData.risk_level),
              fillOpacity: 0.5 
            }} 
            radius={20000}
          >
            <Popup>
              <strong style={{color: 'black'}}>ZONE A</strong><br/>
              <span style={{color: 'black'}}>Risk: {riskData.overall_risk_pct}% ({riskData.risk_level})</span>
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
}