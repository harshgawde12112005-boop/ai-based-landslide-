import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Navigation } from 'lucide-react';

const TILE_LAYERS = {
  osm: {
    name: 'Standard Carto',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
  },
  topo: {
    name: 'Topographic Relief',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
  },
};

export default function MapComponent({ zones = [], selectedZone, onSelectZone, riskData }) {
  const [activeTile, setActiveTile] = useState('osm');

  const defaultCenter = selectedZone
    ? [selectedZone.lat, selectedZone.lng]
    : [27.3389, 88.6065];

  const getColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f59e0b';
      case 'MODERATE':
        return '#eab308';
      default:
        return '#10b981';
    }
  };

  return (
    <div className="map-panel">
      <div className="map-toolbar">
        <div className="zone-chips-container">
          {zones.map((z) => (
            <button
              key={z.id}
              className={`zone-chip-btn ${selectedZone?.id === z.id ? 'selected' : ''}`}
              onClick={() => onSelectZone(z)}
            >
              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {z.name} ({z.state})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} style={{ color: 'var(--accent-primary)' }} />
          <select
            className="tile-layer-select"
            value={activeTile}
            onChange={(e) => setActiveTile(e.target.value)}
          >
            <option value="osm">🗺️ Standard Street</option>
            <option value="satellite">🛰️ Satellite Terrain</option>
            <option value="topo">⛰️ Topo Relief</option>
          </select>
        </div>
      </div>

      <div className="map-shell">
        <MapContainer
          key={`${selectedZone?.lat}-${selectedZone?.lng}-${activeTile}`}
          center={defaultCenter}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url={TILE_LAYERS[activeTile].url}
            attribution={TILE_LAYERS[activeTile].attribution}
          />

          {zones.map((z) => {
            const isCurrent = selectedZone?.id === z.id;
            const currentRiskLevel = isCurrent && riskData ? riskData.risk_level : z.risk_level;
            const currentRiskScore = isCurrent && riskData ? riskData.overall_risk_pct : z.risk_pct;
            const markerColor = getColor(currentRiskLevel);

            return (
              <React.Fragment key={z.id}>
                <Circle
                  center={[z.lat, z.lng]}
                  pathOptions={{
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: isCurrent ? 0.45 : 0.25,
                    weight: isCurrent ? 3 : 1.5,
                  }}
                  radius={isCurrent ? 24000 : 16000}
                >
                  <Popup>
                    <div style={{ minWidth: '180px', padding: '4px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{z.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>
                        {z.state} • Elevation: {z.elevation_m}m
                      </div>
                      <div style={{ fontSize: '0.82rem', margin: '4px 0' }}>
                        <strong>Risk Index:</strong>{' '}
                        <span style={{ color: markerColor, fontWeight: 'bold' }}>
                          {currentRiskScore}% ({currentRiskLevel})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Rain: {z.rainfall_mm}mm | Soil: {z.soil_moisture_pct}% | Slope: {z.slope_deg}°
                      </div>
                      <button
                        className="action-pill-btn primary"
                        style={{ width: '100%', marginTop: '8px', padding: '4px 8px' }}
                        onClick={() => onSelectZone(z)}
                      >
                        Focus Zone Telemetry
                      </button>
                    </div>
                  </Popup>
                </Circle>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
