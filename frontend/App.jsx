import React, { useState } from 'react';
import axios from 'axios';
import TopCards from './components/TopCards';
import MapComponent from './components/MapComponent';
import Simulator from './components/Simulator';
import './App.css';

export default function App() {
  // Default values from your prototype design
  const [rainfall, setRainfall] = useState(142);
  const [soilMoisture, setSoilMoisture] = useState(78);
  const [riskData, setRiskData] = useState(null);

  const runSimulation = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/predict', {
        rainfall_mm: rainfall,
        soil_moisture_pct: soilMoisture,
        slope_deg: 36 // Default slope for the zone
      });
      setRiskData(response.data);
    } catch (error) {
      console.error("Backend connect nahi ho raha hai. Check if FastAPI is running.", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#fff' }}>LANDGUARD NER - Landslide Risk Intelligence</h2>
        <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Based on the 14-step roadmap (Internal Prototype)</p>
      </header>
      
      <TopCards />
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          <MapComponent riskData={riskData} />
        </div>
        <div style={{ flex: 1 }}>
          <Simulator 
            rainfall={rainfall} setRainfall={setRainfall} 
            soilMoisture={soilMoisture} setSoilMoisture={setSoilMoisture} 
            runSimulation={runSimulation} riskData={riskData}
          />
        </div>
      </div>
    </div>
  );
}