import React from 'react';

export default function Simulator({ rainfall, setRainfall, soilMoisture, setSoilMoisture, runSimulation, riskData }) {
  return (
    <div style={{ background: '#2a2d35', padding: '20px', borderRadius: '8px', height: '100%' }}>
      <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>WHAT-IF SIMULATOR</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Rainfall</span> <span>{rainfall}mm</span>
        </label>
        <input 
          type="range" min="0" max="300" value={rainfall} 
          onChange={(e) => setRainfall(Number(e.target.value))} 
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Soil Moisture</span> <span>{soilMoisture}%</span>
        </label>
        <input 
          type="range" min="0" max="100" value={soilMoisture} 
          onChange={(e) => setSoilMoisture(Number(e.target.value))} 
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      <button 
        onClick={runSimulation} 
        style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        [ Simulate & Run Pipeline ]
      </button>

      {riskData && (
        <div style={{ marginTop: '25px' }}>
          <h4 style={{ color: '#aaa', fontSize: '12px' }}>PREDICTION INSIGHT</h4>
          <p style={{ margin: '5px 0' }}>Current Risk: <strong style={{ color: riskData.risk_level === 'CRITICAL' ? '#ff4d4d' : '#ffa500' }}>{riskData.overall_risk_pct}% ({riskData.risk_level})</strong></p>
          
          <h4 style={{ color: '#aaa', fontSize: '12px', marginTop: '15px' }}>CASCADING IMPACT</h4>
          <p style={{ margin: '5px 0', fontSize: '14px', lineHeight: '1.5' }}>{riskData.chain_reaction}</p>
        </div>
      )}
    </div>
  );
}