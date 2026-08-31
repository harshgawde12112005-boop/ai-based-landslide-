import React from 'react';
import confetti from 'canvas-confetti';
import { Sliders, Cpu, Download, AlertOctagon, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

const PRESETS = [
  {
    name: 'Monsoon Cloudburst',
    rain: 215,
    soil: 92,
    slope: 44,
    pore: 95,
    veg: 35,
  },
  {
    name: 'Saturated Surcharge',
    rain: 160,
    soil: 85,
    slope: 38,
    pore: 80,
    veg: 50,
  },
  {
    name: 'Deforested Slope',
    rain: 95,
    soil: 65,
    slope: 48,
    pore: 55,
    veg: 15,
  },
  {
    name: 'Dry Baseline (Safe)',
    rain: 20,
    soil: 25,
    slope: 22,
    pore: 15,
    veg: 85,
  },
];

export default function Simulator({
  rainfall,
  setRainfall,
  soilMoisture,
  setSoilMoisture,
  slope,
  setSlope,
  porePressure,
  setPorePressure,
  vegetationCover,
  setVegetationCover,
  runSimulation,
  riskData,
  loading,
  selectedZone,
}) {
  const applyPreset = (preset) => {
    setRainfall(preset.rain);
    setSoilMoisture(preset.soil);
    setSlope(preset.slope);
    setPorePressure(preset.pore);
    setVegetationCover(preset.veg);
    runSimulation(preset.rain, preset.soil, preset.slope, preset.pore, preset.veg);
  };

  const handleExportReport = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#10b981', '#0ea5e9', '#f59e0b'],
    });

    const reportData = {
      title: 'LandGuard AI - Geotechnical Hazard Assessment Report',
      timestamp: new Date().toISOString(),
      zone: selectedZone?.name || 'Custom Evaluated Slope',
      state: selectedZone?.state || 'Regional',
      risk_score_pct: riskData?.overall_risk_pct ?? 0,
      risk_level: riskData?.risk_level ?? 'UNKNOWN',
      factor_of_safety: riskData?.factor_of_safety ?? 'N/A',
      confidence_index: `${riskData?.confidence ?? 90}%`,
      telemetry: {
        rainfall_24h_mm: rainfall,
        soil_moisture_saturation_pct: soilMoisture,
        slope_angle_deg: slope,
        pore_pressure_kpa: porePressure,
        vegetation_cover_pct: vegetationCover,
      },
      contributors_breakdown: riskData?.contributors ?? {},
      chain_reaction_cascade: riskData?.chain_reaction ?? '',
      ai_diagnostic: riskData?.ai_summary ?? '',
      operational_recommendation: riskData?.recommendation ?? '',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LandGuard_Advisory_${selectedZone?.name?.replace(/\s+/g, '_') || 'Assessment'}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const contributors = riskData?.contributors || {
    Rainfall: 35,
    'Soil Moisture': 28,
    'Slope Angle': 20,
    'Pore Pressure': 12,
    'Seismic Factor': 5,
  };

  return (
    <div className="simulator-card">
      <div className="panel-header">
        <h3 className="panel-title">
          <Sliders size={18} style={{ color: 'var(--accent-primary)' }} />
          What-If Scenario Simulator
        </h3>
      </div>

      {/* Preset Badges */}
      <div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '700' }}>
          QUICK SCENARIO PRESETS
        </div>
        <div className="presets-row">
          {PRESETS.map((p) => (
            <button key={p.name} className="preset-badge-btn" onClick={() => applyPreset(p)}>
              <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Slider 1: Rainfall */}
      <div className="slider-group">
        <div className="slider-header">
          <span className="slider-label">🌧️ 24h Cumulative Rainfall</span>
          <span className="slider-value-tag">{rainfall} mm</span>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          step="1"
          value={rainfall}
          onChange={(e) => setRainfall(Number(e.target.value))}
        />
      </div>

      {/* Slider 2: Soil Moisture */}
      <div className="slider-group">
        <div className="slider-header">
          <span className="slider-label">💧 Soil Moisture Saturation</span>
          <span className="slider-value-tag">{soilMoisture}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={soilMoisture}
          onChange={(e) => setSoilMoisture(Number(e.target.value))}
        />
      </div>

      {/* Slider 3: Slope Angle */}
      <div className="slider-group">
        <div className="slider-header">
          <span className="slider-label">⛰️ Slope Gradient Angle</span>
          <span className="slider-value-tag">{slope}°</span>
        </div>
        <input
          type="range"
          min="5"
          max="75"
          step="1"
          value={slope}
          onChange={(e) => setSlope(Number(e.target.value))}
        />
      </div>

      {/* Slider 4: Pore Pressure */}
      <div className="slider-group">
        <div className="slider-header">
          <span className="slider-label">🫧 Subsoil Pore-Water Pressure</span>
          <span className="slider-value-tag">{porePressure} kPa</span>
        </div>
        <input
          type="range"
          min="0"
          max="150"
          step="1"
          value={porePressure}
          onChange={(e) => setPorePressure(Number(e.target.value))}
        />
      </div>

      {/* Slider 5: Vegetation Cover */}
      <div className="slider-group">
        <div className="slider-header">
          <span className="slider-label">🌿 Vegetation & Root Canopy</span>
          <span className="slider-value-tag">{vegetationCover}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={vegetationCover}
          onChange={(e) => setVegetationCover(Number(e.target.value))}
        />
      </div>

      <button
        className="run-model-btn"
        onClick={() => runSimulation(rainfall, soilMoisture, slope, porePressure, vegetationCover)}
        disabled={loading}
      >
        <Cpu size={18} />
        {loading ? 'Evaluating Geotechnical AI Model...' : 'Execute Geotechnical Risk Model'}
      </button>

      {/* Insight Output Card */}
      {riskData && (
        <div className="insight-panel">
          <div className="insight-header">
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: '800' }}>
              AI Prediction Diagnostic
            </span>
            <span className={`risk-level-badge ${riskData.risk_level.toLowerCase()}`}>
              {riskData.risk_level === 'CRITICAL' ? <AlertOctagon size={13} /> : <ShieldAlert size={13} />}
              {riskData.risk_level} HAZARD
            </span>
          </div>

          <p className="risk-diagnostic-text">{riskData.ai_summary}</p>

          {/* Factor Contributors Bar Breakdown */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px' }}>
              Factor Sensitivity Breakdown
            </div>
            <div className="contributors-list">
              {Object.entries(contributors).map(([factor, pct]) => (
                <div key={factor} className="contributor-item">
                  <div className="contributor-label-row">
                    <span>{factor}</span>
                    <span style={{ fontFamily: 'var(--telemetry-font)', fontWeight: '700' }}>{pct}%</span>
                  </div>
                  <div className="contributor-bar-bg">
                    <div className="contributor-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cascading Chain Reaction */}
          <div className="cascade-box">
            <div className="cascade-title">Predicted Debris Flow Trajectory</div>
            <p className="cascade-content">{riskData.chain_reaction}</p>
          </div>

          {/* Recommended Action */}
          <div className="action-box">
            <div className="action-title">Standard Operating Procedure (SOP)</div>
            <p className="action-content">{riskData.recommendation}</p>
          </div>

          <button className="export-report-btn" onClick={handleExportReport}>
            <Download size={15} />
            Export Official Hazard Advisory Report (JSON)
          </button>
        </div>
      )}
    </div>
  );
}
