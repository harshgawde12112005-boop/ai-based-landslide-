import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { NavLink, Route, Routes } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  LayoutDashboard,
  Bell,
  Clock,
  Radio,
  FileText,
  Sun,
  Moon,
  Compass,
  Zap,
  Activity,
  Layers,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  PhoneCall,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import TopCards from './components/TopCards';
import MapComponent from './components/MapComponent';
import Simulator from './components/Simulator';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/alerts', label: 'Alerts Queue', icon: <Bell size={18} /> },
  { to: '/history', label: 'Risk History', icon: <Clock size={18} /> },
  { to: '/stations', label: 'Field Stations', icon: <Radio size={18} /> },
  { to: '/operations', label: 'SOP & Operations', icon: <FileText size={18} /> },
];

const THEMES = [
  { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
  { id: 'light', label: 'Light', icon: <Sun size={14} /> },
  { id: 'tactical', label: 'Tactical HUD', icon: <Zap size={14} /> },
  { id: 'topo', label: 'Forest Topo', icon: <Compass size={14} /> },
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('landguard_theme') || 'dark');
  const [liveMode, setLiveMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Geotechnical Sensor Parameters
  const [rainfall, setRainfall] = useState(142);
  const [soilMoisture, setSoilMoisture] = useState(78);
  const [slope, setSlope] = useState(36);
  const [porePressure, setPorePressure] = useState(72);
  const [vegetationCover, setVegetationCover] = useState(60);

  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('landguard_theme', theme);
  }, [theme]);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/zones`);
        setZones(res.data.zones || []);
        if (res.data.zones?.length > 0) {
          setSelectedZone(res.data.zones[0]);
          setRainfall(res.data.zones[0].rainfall_mm);
          setSoilMoisture(res.data.zones[0].soil_moisture_pct);
          setSlope(res.data.zones[0].slope_deg);
        }
        setBackendOnline(true);
      } catch (err) {
        console.warn('FastAPI backend not running at port 8000. Operating in offline resilient mode.', err);
        setBackendOnline(false);
        // Fallback default zones
        const fallbackZones = [
          { id: 'zone-sikkim-1', name: 'Gangtok North Ridge', state: 'Sikkim', lat: 27.3389, lng: 88.6065, elevation_m: 1650, rainfall_mm: 142, soil_moisture_pct: 78, slope_deg: 36, risk_pct: 74, risk_level: 'HIGH' },
          { id: 'zone-kerala-1', name: 'Wayanad Meppadi Slope', state: 'Kerala', lat: 11.5534, lng: 76.1264, elevation_m: 920, rainfall_mm: 195, soil_moisture_pct: 88, slope_deg: 42, risk_pct: 88, risk_level: 'CRITICAL' },
          { id: 'zone-kerala-2', name: 'Munnar Gap Road', state: 'Kerala', lat: 10.0889, lng: 77.0595, elevation_m: 1530, rainfall_mm: 112, soil_moisture_pct: 69, slope_deg: 34, risk_pct: 54, risk_level: 'HIGH' },
          { id: 'zone-uk-1', name: 'Joshimath Subsidence Belt', state: 'Uttarakhand', lat: 30.5564, lng: 79.5667, elevation_m: 1890, rainfall_mm: 84, soil_moisture_pct: 61, slope_deg: 46, risk_pct: 48, risk_level: 'MODERATE' },
        ];
        setZones(fallbackZones);
        setSelectedZone(fallbackZones[0]);
      }
    };
    fetchZones();
  }, []);

  // Run Simulation Function
  const runSimulation = async (
    nextRainfall = rainfall,
    nextSoilMoisture = soilMoisture,
    nextSlope = slope,
    nextPore = porePressure,
    nextVeg = vegetationCover
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, {
        rainfall_mm: nextRainfall,
        soil_moisture_pct: nextSoilMoisture,
        slope_deg: nextSlope,
        pore_pressure_kpa: nextPore,
        vegetation_cover_pct: nextVeg,
        zone_id: selectedZone?.id || 'zone-sikkim-1',
      });
      setRiskData(response.data);
      setBackendOnline(true);
    } catch (error) {
      setBackendOnline(false);
      // Resilient client-side geotechnical fallback
      const rNorm = Math.min(Math.max(nextRainfall / 220, 0), 1);
      const mNorm = Math.min(Math.max(nextSoilMoisture / 100, 0), 1);
      const sNorm = Math.min(Math.max(Math.sin((nextSlope * Math.PI) / 180) / Math.sin((52 * Math.PI) / 180), 0), 1.2);
      const pNorm = Math.min(Math.max(nextPore / 110, 0), 1);
      const vegFactor = 1 - (nextVeg / 100) * 0.22;

      const score = Math.round(((rNorm * 0.36 + mNorm * 0.26 + sNorm * 0.20 + pNorm * 0.13) * vegFactor) * 100);
      const fos = Math.max(0.45, Math.min(2.8, 2.45 - (rNorm * 0.72 + mNorm * 0.54 + sNorm * 0.48 + pNorm * 0.38)));
      const level = score >= 75 || fos < 1.1 ? 'CRITICAL' : score >= 50 || fos < 1.3 ? 'HIGH' : score >= 28 ? 'MODERATE' : 'LOW';

      setRiskData({
        overall_risk_pct: score,
        risk_level: level,
        factor_of_safety: Math.round(fos * 100) / 100,
        contributors: {
          Rainfall: Math.round(rNorm * 36),
          'Soil Moisture': Math.round(mNorm * 26),
          'Slope Angle': Math.round(sNorm * 20),
          'Pore Pressure': Math.round(pNorm * 13),
          'Seismic Factor': 5,
        },
        confidence: 91,
        ai_summary: `${level} RISK: Soil saturation at ${nextSoilMoisture}% and slope angle at ${nextSlope}° yields Factor of Safety of ${Math.round(fos * 100) / 100}.`,
        recommendation: level === 'CRITICAL' ? 'Activate Level-3 Evacuation Protocol and close transport corridors.' : 'Maintain continuous geotechnical telemetry observation.',
        chain_reaction: 'Upper Scarp -> Arterial Road Cut -> Lower Stream Catchment',
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial simulation
  useEffect(() => {
    runSimulation(rainfall, soilMoisture, slope, porePressure, vegetationCover);
  }, []);

  // Live Telemetry Mode Simulator
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      setRainfall((prev) => {
        const delta = (Math.random() - 0.45) * 3;
        const next = Math.max(10, Math.min(260, Math.round(prev + delta)));
        return next;
      });
      setSoilMoisture((prev) => {
        const delta = (Math.random() - 0.48) * 1.5;
        const next = Math.max(15, Math.min(98, Math.round(prev + delta)));
        return next;
      });
      setPorePressure((prev) => {
        const delta = (Math.random() - 0.48) * 2;
        const next = Math.max(5, Math.min(130, Math.round(prev + delta)));
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [liveMode]);

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    setRainfall(zone.rainfall_mm);
    setSoilMoisture(zone.soil_moisture_pct);
    setSlope(zone.slope_deg);
    runSimulation(zone.rainfall_mm, zone.soil_moisture_pct, zone.slope_deg, porePressure, vegetationCover);
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <ShieldAlert size={26} />
          </div>
          <div>
            <div className="brand-name">
              LandGuard <span className="ai-tag">AI 2.0</span>
            </div>
            <div className="brand-subtitle">Geotechnical Resilience</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* System Health Card */}
        <div className="sidebar-card">
          <div className="mini-label">
            <span>System Telemetry</span>
            <span className="health-pulse-dot" />
          </div>
          <div className="mini-value">
            {backendOnline ? 'Active Online' : 'Local Fallback'}
          </div>
          <div className="mini-meta">
            6 Nodes • Latency: 12ms
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <p className="eyebrow">
              <Activity size={13} />
              AI EARTH OBSERVATORY &bull; {selectedZone ? selectedZone.name : 'Regional Sentinel'}
            </p>
            <h1>Landslide Risk Intelligence</h1>
          </div>

          <div className="topbar-actions">
            {/* Live Telemetry Mode Toggle */}
            <button
              className={`live-feed-toggle-btn ${liveMode ? 'live-on' : ''}`}
              onClick={() => setLiveMode(!liveMode)}
              title="Toggle automatic simulated sensor feed fluctuation"
            >
              <span className="live-pulse" />
              {liveMode ? 'Live Feed: STREAMING' : 'Live Feed: PAUSED'}
            </button>

            {/* Theme Selector Pill Bar */}
            <div className="theme-selector-wrap">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-pill-btn ${theme === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id)}
                  title={`Switch to ${t.label} theme`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Page Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                riskData={riskData}
                rainfall={rainfall}
                setRainfall={setRainfall}
                soilMoisture={soilMoisture}
                setSoilMoisture={setSoilMoisture}
                slope={slope}
                setSlope={setSlope}
                porePressure={porePressure}
                setPorePressure={setPorePressure}
                vegetationCover={vegetationCover}
                setVegetationCover={setVegetationCover}
                runSimulation={runSimulation}
                loading={loading}
                zones={zones}
                selectedZone={selectedZone}
                onSelectZone={handleZoneSelect}
              />
            }
          />
          <Route path="/alerts" element={<AlertsPage riskData={riskData} selectedZone={selectedZone} />} />
          <Route
            path="/history"
            element={
              <HistoryPage
                riskData={riskData}
                rainfall={rainfall}
                soilMoisture={soilMoisture}
                slope={slope}
                selectedZone={selectedZone}
              />
            }
          />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/operations" element={<OperationsPage riskData={riskData} selectedZone={selectedZone} />} />
        </Routes>
      </main>
    </div>
  );
}

// --------------------------------------------------------------------------
// 1. DASHBOARD OVERVIEW PAGE
// --------------------------------------------------------------------------
function DashboardPage({
  riskData,
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
  loading,
  zones,
  selectedZone,
  onSelectZone,
}) {
  return (
    <div className="dashboard-container">
      <TopCards
        riskData={riskData}
        rainfall={rainfall}
        soilMoisture={soilMoisture}
        slope={slope}
      />

      <div className="dashboard-grid">
        {/* Interactive Multi-Zone Map */}
        <div className="panel-box">
          <div className="panel-header">
            <h3 className="panel-title">
              <Layers size={18} style={{ color: 'var(--accent-primary)' }} />
              Geological Hazard Spatial Mapping
            </h3>
          </div>
          <MapComponent
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={onSelectZone}
            riskData={riskData}
          />
        </div>

        {/* What-If Scenario Simulator */}
        <div className="panel-box">
          <Simulator
            rainfall={rainfall}
            setRainfall={setRainfall}
            soilMoisture={soilMoisture}
            setSoilMoisture={setSoilMoisture}
            slope={slope}
            setSlope={setSlope}
            porePressure={porePressure}
            setPorePressure={setPorePressure}
            vegetationCover={vegetationCover}
            setVegetationCover={setVegetationCover}
            runSimulation={runSimulation}
            riskData={riskData}
            loading={loading}
            selectedZone={selectedZone}
          />
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. ACTIVE ALERTS PAGE
// --------------------------------------------------------------------------
function AlertsPage({ riskData, selectedZone }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-801',
      title: 'Pore-Water Surcharge Breach Warning',
      zone: selectedZone?.name || 'Gangtok North Ridge',
      severity: riskData?.risk_level || 'HIGH',
      time: 'Just now',
      details: 'Subsoil pore-water pressure has surpassed threshold limit. Accelerated shear deformation is projected.',
      acknowledged: false,
    },
    {
      id: 'ALT-802',
      title: 'Monsoon Cumulative Inflow Escalation',
      zone: 'Wayanad Meppadi Slope',
      severity: 'CRITICAL',
      time: '18 min ago',
      details: '24h rainfall exceeded 195mm with complete soil saturation. Level-3 evacuations dispatched.',
      acknowledged: true,
    },
    {
      id: 'ALT-803',
      title: 'Laser Extensometer Micro-Fissure Alert',
      zone: 'Joshimath Subsidence Belt',
      severity: 'MODERATE',
      time: '45 min ago',
      details: 'Displacement rate of 1.8mm/hr recorded along scarp line. Monitoring frequency increased.',
      acknowledged: true,
    },
    {
      id: 'ALT-804',
      title: 'Culvert Drainage Siltation Watch',
      zone: 'Munnar Gap Road',
      severity: 'HIGH',
      time: '2 hrs ago',
      details: 'Roadside debris flow has reduced drainage channel efficiency by 40%.',
      acknowledged: false,
    },
  ]);

  const toggleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: !a.acknowledged } : a))
    );
  };

  const dispatchEmergencyAlert = (alert) => {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
    alert(`📢 BROADCAST DISPATCHED: Emergency SMS and Siren Alert triggered for "${alert.zone}" (${alert.severity} Level). Response teams mobilized.`);
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesFilter = filter === 'ALL' || a.severity === filter;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.zone.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">EARLY WARNING SUBSYSTEM</p>
          <h2>Active Hazard Alerts & Dispatch Queue</h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search alert by zone or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px 8px 32px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          </div>

          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((f) => (
            <button
              key={f}
              className={`preset-badge-btn ${filter === f ? 'selected' : ''}`}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="alerts-grid">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="alert-card">
            <div className="alert-top">
              <span className={`risk-level-badge ${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--telemetry-font)' }}>
                {alert.time}
              </span>
            </div>

            <h3>{alert.title}</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: '700', marginBottom: '8px' }}>
              📍 {alert.zone} &bull; Ref: {alert.id}
            </div>
            <p>{alert.details}</p>

            <div className="alert-actions">
              <button
                className={`action-pill-btn ${alert.acknowledged ? 'primary' : ''}`}
                onClick={() => toggleAcknowledge(alert.id)}
              >
                {alert.acknowledged ? '✓ Acknowledged' : 'Mark Acknowledged'}
              </button>

              <button
                className="action-pill-btn"
                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                onClick={() => dispatchEmergencyAlert(alert)}
              >
                <Volume2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Dispatch Siren / SMS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. RISK HISTORY & ANALYTICS PAGE
// --------------------------------------------------------------------------
function HistoryPage({ riskData, rainfall, soilMoisture, slope, selectedZone }) {
  const [historyRows, setHistoryRows] = useState([
    { id: 1, time: '00:00 UTC', zone: 'Gangtok North Ridge', rain: 24, soil: 45, slope: 36, risk: '18%', fos: 2.12, level: 'LOW' },
    { id: 2, time: '03:00 UTC', zone: 'Gangtok North Ridge', rain: 48, soil: 52, slope: 36, risk: '28%', fos: 1.95, level: 'LOW' },
    { id: 3, time: '06:00 UTC', zone: 'Gangtok North Ridge', rain: 86, soil: 64, slope: 36, risk: '46%', fos: 1.62, level: 'MODERATE' },
    { id: 4, time: '09:00 UTC', zone: 'Gangtok North Ridge', rain: 120, soil: 74, slope: 36, risk: '65%', fos: 1.34, level: 'HIGH' },
    { id: 5, time: '12:00 UTC', zone: 'Gangtok North Ridge', rain: 155, soil: 84, slope: 36, risk: '82%', fos: 0.98, level: 'CRITICAL' },
    { id: 6, time: '15:00 UTC', zone: 'Gangtok North Ridge', rain: 142, soil: 78, slope: 36, risk: `${riskData?.overall_risk_pct ?? 74}%`, fos: riskData?.factor_of_safety ?? 1.15, level: riskData?.risk_level ?? 'HIGH' },
  ]);

  const downloadCSV = () => {
    const headers = 'Time,Zone,Rainfall(mm),SoilMoisture(%),Slope(deg),RiskIndex,FoS,Level\n';
    const rows = historyRows
      .map((r) => `${r.time},${r.zone},${r.rain},${r.soil},${r.slope},${r.risk},${r.fos},${r.level}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LandGuard_Telemetry_Log_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">TELEMETRY ARCHIVE</p>
          <h2>Geotechnical Trend Analysis & Event Logs</h2>
        </div>

        <button className="run-model-btn" style={{ width: 'auto', padding: '8px 16px' }} onClick={downloadCSV}>
          <Download size={16} />
          Export CSV History
        </button>
      </div>

      <div className="topcards-grid" style={{ marginBottom: '20px' }}>
        <div className="metric-card">
          <p className="label">Peak 24h Rainfall</p>
          <h2 className="value" style={{ color: 'var(--accent-primary)' }}>155 mm</h2>
          <div className="meta">Recorded at 12:00 UTC</div>
        </div>
        <div className="metric-card">
          <p className="label">Critical Soil Saturation</p>
          <h2 className="value" style={{ color: '#f59e0b' }}>84%</h2>
          <div className="meta">Pore-Water Peak Inflow</div>
        </div>
        <div className="metric-card">
          <p className="label">Lowest Factor of Safety</p>
          <h2 className="value" style={{ color: '#ef4444' }}>0.98 FoS</h2>
          <div className="meta">Temporary Shear Excursion</div>
        </div>
        <div className="metric-card">
          <p className="label">Model Convergence</p>
          <h2 className="value" style={{ color: '#0ea5e9' }}>99.2%</h2>
          <div className="meta">Multi-node synchronization</div>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Monitored Zone</th>
              <th>Rainfall (mm)</th>
              <th>Soil Saturation</th>
              <th>Slope Gradient</th>
              <th>Factor of Safety</th>
              <th>Risk Score</th>
              <th>Hazard Level</th>
            </tr>
          </thead>
          <tbody>
            {historyRows.map((row) => (
              <tr key={row.id}>
                <td style={{ fontFamily: 'var(--telemetry-font)', fontWeight: '600' }}>{row.time}</td>
                <td><strong>{row.zone}</strong></td>
                <td>{row.rain} mm</td>
                <td>{row.soil}%</td>
                <td>{row.slope}°</td>
                <td style={{ fontFamily: 'var(--telemetry-font)', fontWeight: '700', color: row.fos < 1.1 ? '#ef4444' : row.fos < 1.3 ? '#f59e0b' : '#10b981' }}>
                  {row.fos}
                </td>
                <td style={{ fontFamily: 'var(--telemetry-font)', fontWeight: '800' }}>{row.risk}</td>
                <td>
                  <span className={`risk-level-badge ${row.level.toLowerCase()}`}>
                    {row.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 4. FIELD STATIONS PAGE
// --------------------------------------------------------------------------
function StationsPage() {
  const [stations, setStations] = useState([
    {
      id: 'ST-SKM-01',
      name: 'Gangtok Ridge Alpha',
      location: 'Sikkim North-East Sector',
      status: 'Online',
      signal: '98% (-64 dBm)',
      battery: 94,
      solar: '48.2 W',
      sensors: ['Piezometer', 'Inclinometer Array', 'Tipping Rain Gauge', 'TDR Moisture'],
      pinging: false,
    },
    {
      id: 'ST-WND-04',
      name: 'Wayanad Meppadi Node',
      location: 'Western Ghats Catchment',
      status: 'Warning',
      signal: '84% (-78 dBm)',
      battery: 76,
      solar: '22.1 W',
      sensors: ['Acoustic Pore Probe', 'Inclinometer', 'Rain Sentry'],
      pinging: false,
    },
    {
      id: 'ST-MNR-02',
      name: 'Munnar Gap Telemetry',
      location: 'High-Range Corridor Route 49',
      status: 'Online',
      signal: '92% (-68 dBm)',
      battery: 89,
      solar: '52.0 W',
      sensors: ['Crack Meter Array', 'Piezometer', 'Soil Sentry'],
      pinging: false,
    },
    {
      id: 'ST-JSH-09',
      name: 'Joshimath Laser Base',
      location: 'Alaknanda Escarpment',
      status: 'Online',
      signal: '88% (-71 dBm)',
      battery: 91,
      solar: '44.5 W',
      sensors: ['Laser Distance Extensometer', 'Micro-Seismometer', 'Moisture Probe'],
      pinging: false,
    },
  ]);

  const pingStation = (id) => {
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinging: true } : s))
    );
    setTimeout(() => {
      setStations((prev) =>
        prev.map((s) => (s.id === id ? { ...s, pinging: false } : s))
      );
    }, 1200);
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">IOT SENSOR NETWORK</p>
          <h2>Field Telemetry Monitoring Nodes</h2>
        </div>
      </div>

      <div className="stations-grid">
        {stations.map((st) => (
          <div key={st.id} className="station-card">
            <div className="alert-top">
              <span className={`risk-level-badge ${st.status === 'Online' ? 'low' : 'high'}`}>
                {st.status}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--telemetry-font)' }}>
                {st.id}
              </span>
            </div>

            <h3>{st.name}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📍 {st.location}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0' }}>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Signal RSSI</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{st.signal}</strong>
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '8px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Battery Power</span>
                <strong style={{ fontSize: '0.85rem', color: st.battery > 80 ? '#10b981' : '#f59e0b' }}>
                  {st.battery}% ({st.solar})
                </strong>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              <strong>Integrated Sensors:</strong>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                {st.sensors.map((sens) => (
                  <span
                    key={sens}
                    style={{
                      background: 'var(--bg-surface-secondary)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.70rem',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {sens}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="action-pill-btn primary"
              style={{ width: '100%' }}
              onClick={() => pingStation(st.id)}
              disabled={st.pinging}
            >
              <RefreshCw size={13} style={{ display: 'inline', marginRight: '6px', animation: st.pinging ? 'spin 1s linear infinite' : 'none' }} />
              {st.pinging ? 'Transmitting Ping Request...' : 'Send Live Telemetry Ping'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 5. OPERATIONS & SOP PLAYBOOK PAGE
// --------------------------------------------------------------------------
function OperationsPage({ riskData, selectedZone }) {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm telemetry piezometer and inclinometer baseline values', done: true },
    { id: 2, text: 'Inspect roadside drainage culverts for vegetative siltation', done: true },
    { id: 3, text: 'Coordinate with local district magistrate and NDRF liaison officer', done: false },
    { id: 4, text: 'Stage UAV thermal drone squad for toe-scarp reconnaissance', done: false },
    { id: 5, text: 'Activate automated emergency SMS broadcast to vulnerable habitations', done: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow small">DISASTER MANAGEMENT PROTOCOL</p>
          <h2>Standard Operating Procedures & Response Matrix</h2>
        </div>
      </div>

      <div className="ops-grid">
        {/* Recommended Action Summary */}
        <div className="info-card" style={{ gridColumn: 'span 2' }}>
          <h3>Target Operational Directive &bull; {selectedZone?.name || 'Monitored Sector'}</h3>
          <p style={{ fontSize: '0.94rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
            {riskData?.recommendation ||
              'Execute standard geotechnical surveillance. Maintain continuous telemetry pinging and stage rapid emergency reconnaissance crews at primary highway intersections.'}
          </p>

          <h4 style={{ margin: '18px 0 8px', fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Emergency Response SOP Checklist
          </h4>
          <div className="sop-checklist">
            {checklist.map((item) => (
              <label key={item.id} className={`sop-item ${item.done ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheck(item.id)}
                />
                <span style={{ fontSize: '0.84rem', color: item.done ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Emergency Contacts Box */}
        <div className="info-card">
          <h3>Emergency Dispatch Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>National Disaster Response (NDRF)</span>
              <div style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.92rem' }}>📞 1078 / +91-11-24363260</div>
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>State Emergency Operation Center (SEOC)</span>
              <div style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.92rem' }}>📞 1070</div>
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Highway Patrol / Border Roads Org (BRO)</span>
              <div style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '0.92rem' }}>📞 1033</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
