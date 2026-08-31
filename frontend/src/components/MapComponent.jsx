import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ riskData }) {
  const center = [27.33, 88.61];

  const getColor = (level) => {
    if (level === 'CRITICAL') return '#ef4444';
    if (level === 'HIGH') return '#f59e0b';
    if (level === 'MODERATE') return '#facc15';
    return '#22c55e';
  };

  return (
    <div className="map-shell">
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {riskData && (
          <Circle
            center={center}
            pathOptions={{
              color: getColor(riskData.risk_level),
              fillColor: getColor(riskData.risk_level),
              fillOpacity: 0.55,
              weight: 3,
            }}
            radius={22000}
          >
            <Popup>
              <div style={{ minWidth: '170px', color: '#0f172a' }}>
                <strong>ZONE A</strong>
                <br />
                <span>
                  Risk: {riskData.overall_risk_pct}% ({riskData.risk_level})
                </span>
                <br />
                <small>Confidence: {riskData.confidence ?? '89'}%</small>
              </div>
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
}
