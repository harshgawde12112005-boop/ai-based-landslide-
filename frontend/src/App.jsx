import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Route, Routes } from 'react-router-dom';
import TopCards from './components/TopCards';
import MapComponent from './components/MapComponent';
import Simulator from './components/Simulator';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/history', label: 'Risk history' },
  { to: '/stations', label: 'Field stations' },
  { to: '/operations', label: 'Operations' },
];

const getRiskLevelValue = (riskLevel = 'LOW') => String(riskLevel).toUpperCase();

const buildAlertCards = (riskData) => {
  const currentLevel = getRiskLevelValue(riskData?.risk_level);
  const summary = riskData?.ai_summary || 'No live AI summary available yet.';

  return [
    {
      title: 'Slope saturation alert',
      detail: summary,
      severity: currentLevel,
    },
    {
      title: 'Drainage review',
      detail: 'Check culvert flow and roadside drainage channels before the next peak rainfall event.',
      severity: currentLevel === 'CRITICAL' ? 'HIGH' : currentLevel === 'HIGH' ? 'MEDIUM' : 'LOW',
    },
    {
      title: 'Road access watch',
      detail: `Current monitored risk: ${riskData?.overall_risk_pct ?? 0}% with ${riskData?.confidence ?? 89}% model confidence.`,
      severity: currentLevel,
    },
  ];
};

const buildHistoryRows = (riskData, rainfall, soilMoisture, slope) => {
  const currentRisk = riskData?.overall_risk_pct ?? 0;
  const currentLevel = getRiskLevelValue(riskData?.risk_level);

  return [
    { time: '08:00', zone: 'North ridge', risk: '32%', level: 'LOW' },
    { time: '10:20', zone: 'Slope A', risk: '57%', level: 'MODERATE' },
    { time: '12:30', zone: 'Base road', risk: '69%', level: 'HIGH' },
    { time: 'Now', zone: 'Current zone', risk: `${currentRisk}%`, level: currentLevel },
    { time: 'Inputs', zone: 'Live model', risk: `${rainfall}mm / ${soilMoisture}% / ${slope}°`, level: currentLevel },
  ];
};

export default function App() {
  const [rainfall, setRainfall] = useState(142);
  const [soilMoisture, setSoilMoisture] = useState(78);
  const [slope, setSlope] = useState(36);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async (nextRainfall = rainfall, nextSoilMoisture = soilMoisture, nextSlope = slope) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, {
        rainfall_mm: nextRainfall,
        soil_moisture_pct: nextSoilMoisture,
        slope_deg: nextSlope,
      });
      setRiskData(response.data);
    } catch (error) {
      console.error('Backend not reachable. Start the FastAPI server on port 8000.', error);
      setRiskData({
        overall_risk_pct: 0,
        risk_level: 'LOW',
        chain_reaction: 'Backend offline. Please start the Python API first.',
        confidence: 0,
        ai_summary: 'System is offline. Start the AI backend to restore live monitoring.',
        recommendation: 'Power on the prediction service and retry the simulation.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRainfallChange = (value) => {
    setRainfall(value);
    runSimulation(value, soilMoisture, slope);
  };

  const handleSoilMoistureChange = (value) => {
    setSoilMoisture(value);
    runSimulation(rainfall, value, slope);
  };

  const handleSlopeChange = (value) => {
    setSlope(value);
    runSimulation(rainfall, soilMoisture, value);
  };

  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">LG</div>
          <div>
            <div className="brand-name">LandGuard</div>
            <div className="brand-subtitle">AI Resilience</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="mini-label">System health</div>
          <div className="mini-value">Stable</div>
          <div className="mini-meta">Latest scan 4 min ago</div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI EARTH OBSERVATORY</p>
            <h1>Regional landslide intelligence</h1>
          </div>
          <button className="topbar-button">Live sync</button>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                riskData={riskData}
                rainfall={rainfall}
                soilMoisture={soilMoisture}
                slope={slope}
                handleRainfallChange={handleRainfallChange}
                handleSoilMoistureChange={handleSoilMoistureChange}
                handleSlopeChange={handleSlopeChange}
                runSimulation={() => runSimulation(rainfall, soilMoisture, slope)}
                loading={loading}
              />
            }
          />
          <Route path="/alerts" element={<AlertsPage riskData={riskData} />} />
          <Route
            path="/history"
            element={<HistoryPage riskData={riskData} rainfall={rainfall} soilMoisture={soilMoisture} slope={slope} />}
          />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/operations" element={<OperationsPage riskData={riskData} />} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardPage({
  riskData,
  rainfall,
  soilMoisture,
  slope,
  handleRainfallChange,
  handleSoilMoistureChange,
  handleSlopeChange,
  runSimulation,
  loading,
}) {
  return (
    <div className="dashboard-container">
      <p className="subheading">Landslide risk intelligence dashboard</p>

      <TopCards riskData={riskData} rainfall={rainfall} soilMoisture={soilMoisture} slope={slope} />

      <div className="dashboard-grid">
        <div className="map-panel panel-box">
          <MapComponent riskData={riskData} />
        </div>

        <div className="simulator-panel panel-box">
          <Simulator
            rainfall={rainfall}
            setRainfall={handleRainfallChange}
            soilMoisture={soilMoisture}
            setSoilMoisture={handleSoilMoistureChange}
            slope={slope}
            setSlope={handleSlopeChange}
            runSimulation={runSimulation}
            riskData={riskData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

function AlertsPage({ riskData }) {
  const alerts = buildAlertCards(riskData);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">ACTIVE ALERTS</p>
          <h2>Field response queue</h2>
        </div>
      </div>

      <div className="alerts-grid">
        {alerts.map((alert) => (
          <div key={alert.title} className="alert-card">
            <div className={`status-tag ${alert.severity.toLowerCase()}`}>{alert.severity}</div>
            <h3>{alert.title}</h3>
            <p>{alert.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPage({ riskData, rainfall, soilMoisture, slope }) {
  const rows = buildHistoryRows(riskData, rainfall, soilMoisture, slope);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">RISK HISTORY</p>
          <h2>Trend overview</h2>
        </div>
      </div>

      <div className="history-summary">
        <div className="summary-box">
          <span>Rainfall</span>
          <strong>{rainfall} mm</strong>
        </div>
        <div className="summary-box">
          <span>Soil moisture</span>
          <strong>{soilMoisture}%</strong>
        </div>
        <div className="summary-box">
          <span>Slope angle</span>
          <strong>{slope}°</strong>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Zone</th>
              <th>Risk</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.time}-${row.zone}`}>
                <td>{row.time}</td>
                <td>{row.zone}</td>
                <td>{row.risk}</td>
                <td><span className={`table-level ${row.level.toLowerCase()}`}>{row.level}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StationsPage() {
  const stations = [
    { name: 'Shillong Ridge', status: 'Online', signal: '98%', zone: 'North-east slope' },
    { name: 'Mawkyrwat Sensor', status: 'Monitoring', signal: '94%', zone: 'Drainage corridor' },
    { name: 'Aizawl Watch Tower', status: 'Stable', signal: '89%', zone: 'High-risk route' },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">FIELD STATIONS</p>
          <h2>Regional monitoring network</h2>
        </div>
      </div>

      <div className="stations-grid">
        {stations.map((station) => (
          <div key={station.name} className="station-card">
            <div className="station-header">
              <h3>{station.name}</h3>
              <span className="station-status">{station.status}</span>
            </div>
            <p>{station.zone}</p>
            <div className="station-metric">
              <span>Signal quality</span>
              <strong>{station.signal}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationsPage({ riskData }) {
  const recommendation = riskData?.recommendation || 'Continue routine monitoring and confirm field readiness.';

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">OPERATIONS</p>
          <h2>Response playbook</h2>
        </div>
      </div>

      <div className="ops-grid">
        <div className="info-card large">
          <h3>Recommended action</h3>
          <p>{recommendation}</p>
        </div>

        <div className="info-card">
          <h3>Current zone rating</h3>
          <div className="big-score">{riskData?.overall_risk_pct ?? 0}%</div>
          <span className="muted">{riskData?.risk_level ?? 'LOW'}</span>
        </div>

        <div className="info-card">
          <h3>Signal confidence</h3>
          <div className="big-score">{riskData?.confidence ?? 89}%</div>
          <span className="muted">Model trust index</span>
        </div>
      </div>
    </div>
  );
}

