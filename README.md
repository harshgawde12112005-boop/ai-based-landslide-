# 🛡️ LandGuard AI - Geotechnical Landslide Risk Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-199900.svg?logo=leaflet&logoColor=white)](https://leafletjs.com)

**LandGuard AI** is a comprehensive full-stack geological disaster monitoring and early warning platform designed to predict, monitor, and mitigate landslide hazards across vulnerable terrain sectors (e.g. Himalayas, Western Ghats).

---

## 🌟 Key Features

### 1. 🎨 Multi-Theme System ("Increase Theme and All")
Switch seamlessly between 4 carefully crafted visual themes with persistent local storage:
- 🌌 **Geological Observatory Dark (Default)**: Deep obsidian backdrop (`#090d16`), luminous neon emerald and sky blue glows, glassmorphism cards with backdrop blur.
- 🏔️ **Clean Alpine Light**: High-contrast, clean mountain slate & crisp snow styling for bright control room environments.
- ⚠️ **Tactical Disaster HUD**: High-visibility emergency operations theme with tactical hazard yellow/amber borders and monospace telemetry feeds.
- 🌲 **Forest Topographic**: Deep evergreen and earthy terrain aesthetic inspired by geological survey maps.

### 2. 🧠 Geotechnical AI & Factor of Safety Engine (`ml_engine.py`)
- Computes **Risk Probability (%)** and geotechnical **Factor of Safety ($FoS$)** using multi-variable hydrological-shear mechanics:
  - 🌧️ 24h Cumulative Rainfall ($mm$)
  - 💧 Volumetric Soil Saturation ($\%$)
  - ⛰️ Slope Gradient Angle ($^\circ$)
  - 🫧 Subsoil Pore-Water Pressure ($kPa$)
  - 🌿 Vegetation Root Matrix Retention ($NDVI$)
  - ⚡ Seismic / Ground Peak Acceleration ($PGA$)
- Provides dynamic **Factor Sensitivity Breakdowns** and automated **Cascading Debris Flow Trajectory mapping**.

### 3. 🗺️ Interactive Spatial Mapping (`MapComponent.jsx`)
- Multi-zone interactive mapping across high-hazard Indian sectors:
  - *Gangtok North Ridge (Sikkim)*
  - *Wayanad Meppadi Catchment (Kerala)*
  - *Munnar Gap Road (Kerala)*
  - *Joshimath Subsidence Belt (Uttarakhand)*
  - *Shimla Taradevi Corridor (Himachal Pradesh)*
  - *Darjeeling Lebong Spur (West Bengal)*
- **3 Map Layers**: Standard Street (Carto), Satellite Imagery (Esri World Imagery), and Topographic Relief (OpenTopoMap).
- Pulsing animated radar circles indicating active hazard zones.

### 4. 🎛️ What-If Scenario Simulator & Report Exporter (`Simulator.jsx`)
- Real-time parameter sliders with instant geotechnical evaluation.
- One-click Scenario Presets:
  - *Monsoon Cloudburst*
  - *Saturated Surcharge*
  - *Deforested Steep Slope*
  - *Dry Baseline (Safe)*
- **Export Official Hazard Advisory Report**: Download structured JSON reports with celebratory confetti feedback.

### 5. 📡 Full Operations & Early Warning Suite
- **Alerts Queue**: Searchable, filterable alert feed with "Acknowledge" flags and "Dispatch Siren / SMS Broadcast" simulation.
- **Risk History & Analytics**: Event logs, telemetry correlation indicators, and instant **CSV Export**.
- **Field Station Health**: Real-time IoT monitoring node statuses, battery levels, solar power generation, RSSI signal meters, and live station ping testing.
- **SOP Playbook**: Interactive Standard Operating Procedures checklist, emergency contacts directory (NDRF, SEOC, BRO).
- **Live Streaming Mode**: Real-time sensor feed fluctuation simulation.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Single-Click Launch (Windows)
Double-click `start_all.bat` to launch both Backend and Frontend servers concurrently:
```bat
start_all.bat
```

---

### 2. Manual Startup

#### Backend (FastAPI)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on http://localhost:8000)
python -m uvicorn main:app --reload --port 8000
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Automated Testing

Run the automated Python test suite covering all backend REST endpoints and calculation models:
```bash
python test_backend.py
```

Build the React frontend for production:
```bash
npm --prefix frontend run build
```

---

## 📁 Project Architecture

```text
ai-based-landslide/
├── main.py                   # FastAPI REST API endpoints
├── ml_engine.py              # Geotechnical landslide risk & FoS engine
├── test_backend.py           # Automated test suite
├── requirements.txt          # Python dependencies
├── start_all.bat             # 1-click full stack launcher
├── run_backend.bat           # 1-click backend launcher
├── run_frontend.bat          # 1-click frontend launcher
├── .gitignore                # Root gitignore
└── frontend/                 # React 19 + Vite Application
    ├── src/
    │   ├── App.jsx           # Master app with theme switcher & routes
    │   ├── App.css           # 4-theme CSS design system & animations
    │   ├── index.css         # Typography & reset styling
    │   ├── components/
    │   │   ├── TopCards.jsx     # Live telemetry KPI cards
    │   │   ├── MapComponent.jsx # Leaflet spatial hazard map
    │   │   └── Simulator.jsx    # What-if scenario simulator
    │   └── main.jsx          # Entry point with BrowserRouter
    ├── package.json          # Frontend dependencies
    └── vite.config.js        # Vite configuration
```

---

## 📄 License
MIT License. Built for disaster resilience and life-saving early warning intelligence.
