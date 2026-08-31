import React from 'react';

export default function Simulator({
  rainfall,
  setRainfall,
  soilMoisture,
  setSoilMoisture,
  slope,
  setSlope,
  runSimulation,
  riskData,
  loading,
}) {
  const riskColor =
    riskData?.risk_level === 'CRITICAL'
      ? '#f87171'
      : riskData?.risk_level === 'HIGH'
        ? '#fbbf24'
        : '#4ade80';

  return (
    <div className="simulator-card">
      <h3>What-if simulator</h3>

      <div className="slider-group">
        <div className="slider-header">
          <span>Rainfall</span>
          <strong>{rainfall} mm</strong>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          value={rainfall}
          onChange={(e) => setRainfall(Number(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <span>Soil moisture</span>
          <strong>{soilMoisture}%</strong>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={soilMoisture}
          onChange={(e) => setSoilMoisture(Number(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <span>Slope angle</span>
          <strong>{slope}°</strong>
        </div>
        <input
          type="range"
          min="5"
          max="80"
          value={slope}
          onChange={(e) => setSlope(Number(e.target.value))}
        />
      </div>

      <button className="ai-button" onClick={runSimulation} disabled={loading}>
        {loading ? 'Running AI model...' : 'Run AI risk model'}
      </button>

      {riskData && (
        <div className="insight-panel">
          <h4>Prediction insight</h4>
          <span className="risk-badge" style={{ background: `${riskColor}20`, color: riskColor }}>
            {riskData.risk_level}
          </span>
          <p className="risk-description">
            {riskData.ai_summary || 'AI model analysis indicates current terrain instability.'}
          </p>

          <div className="risk-grid">
            <div className="risk-grid-item">
              <span className="key">Risk</span>
              <span className="value">{riskData.overall_risk_pct}%</span>
            </div>
            <div className="risk-grid-item">
              <span className="key">Confidence</span>
              <span className="value">{riskData.confidence ?? 90}%</span>
            </div>
          </div>

          <h4 style={{ marginTop: '18px' }}>Cascading impact</h4>
          <p className="risk-description">{riskData.chain_reaction}</p>

          <h4 style={{ marginTop: '18px' }}>Recommended action</h4>
          <p className="risk-description">{riskData.recommendation}</p>
        </div>
      )}
    </div>
  );
}
