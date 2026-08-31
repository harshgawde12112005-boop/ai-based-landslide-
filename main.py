from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_engine import calculate_landslide_risk

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SensorData(BaseModel):
    rainfall_mm: float
    soil_moisture_pct: float
    slope_deg: float


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "model": "landslide-risk-v1",
        "service": "LandGuard AI",
    }


@app.post("/api/predict")
def predict_risk(data: SensorData):
    risk_pct, risk_level, contributors, confidence, ai_summary, recommendation = calculate_landslide_risk(
        data.rainfall_mm,
        data.soil_moisture_pct,
        data.slope_deg,
    )

    return {
        "overall_risk_pct": risk_pct,
        "risk_level": risk_level,
        "contributors": contributors,
        "confidence": confidence,
        "ai_summary": ai_summary,
        "recommendation": recommendation,
        "chain_reaction": "ZONE A (🔴) → Road X blocked (🟠) → Village B affected (🟡)",
        "generated_at": "live",
    }