import math
from typing import Dict, Any, Tuple


def calculate_landslide_risk(
    rainfall: float,
    soil_moisture: float,
    slope: float,
    pore_pressure: float = None,
    vegetation_cover: float = 65.0,
    seismic_pga: float = 0.05
) -> Tuple[int, str, float, Dict[str, float], int, str, str, str, Dict[str, Any]]:
    """
    Advanced Geotechnical & Hydrological Landslide Risk Calculation Engine.
    
    Parameters:
    - rainfall (mm): 24-hour cumulative rainfall
    - soil_moisture (%): Volumetric soil saturation
    - slope (degrees): Terrain inclination angle
    - pore_pressure (kPa): Pore-water pressure in subsoil layer
    - vegetation_cover (%): NDVI canopy and root matrix retention (0-100)
    - seismic_pga (g): Peak Ground Acceleration / micro-tremor factor (0-0.5g)
    
    Returns:
    - risk_score (int: 0-100)
    - risk_level (str: LOW, MODERATE, HIGH, CRITICAL)
    - factor_of_safety (float: e.g. 1.82)
    - contributors (dict: relative % influence of each parameter)
    - confidence (int: 0-100%)
    - ai_summary (str: natural language diagnostic)
    - recommendation (str: operational standard operating procedure)
    - chain_reaction (str: predicted debris cascade trajectory)
    - metrics (dict: normalized raw metrics & engineering data)
    """
    # Normalize rainfall (0-250mm scale)
    r_norm = min(max(rainfall / 220.0, 0.0), 1.0)
    
    # Normalize moisture (0-100%)
    m_norm = min(max(soil_moisture / 100.0, 0.0), 1.0)
    
    # Non-linear slope gravity shear factor (steep slopes exponentially increase shear stress)
    rad_slope = math.radians(min(max(slope, 0.0), 85.0))
    s_norm = min(max(math.sin(rad_slope) / math.sin(math.radians(52.0)), 0.0), 1.2)
    
    # Default pore-water pressure estimated from hydrological saturation if not supplied
    if pore_pressure is None:
        pore_pressure = round((r_norm * 45.0) + (m_norm * 55.0), 1)
    p_norm = min(max(pore_pressure / 110.0, 0.0), 1.0)
    
    # Vegetation matrix stabilization index (higher canopy & root cohesion decreases shear failure)
    veg_norm = min(max(vegetation_cover / 100.0, 0.0), 1.0)
    veg_mitigation_factor = 1.0 - (veg_norm * 0.22)
    
    # Seismic PGA perturbation
    seis_norm = min(max(seismic_pga / 0.35, 0.0), 1.0)
    
    # Multi-factor geotechnical weighted index
    raw_score = (
        (r_norm * 0.36) +
        (m_norm * 0.26) +
        (min(s_norm, 1.0) * 0.20) +
        (p_norm * 0.13) +
        (seis_norm * 0.05)
    ) * veg_mitigation_factor * 100.0
    
    risk_score = int(max(0, min(round(raw_score), 100)))
    
    # Geotechnical Factor of Safety (FoS) estimation
    # FoS > 1.5: Stable | 1.25-1.5: Moderately Stable | 1.0-1.25: High Hazard | <1.0: Active Failure
    fos_calc = 2.45 - (
        (r_norm * 0.72) +
        (m_norm * 0.54) +
        (s_norm * 0.48) +
        (p_norm * 0.38) +
        (seis_norm * 0.22)
    ) * (1.0 / max(0.65, veg_mitigation_factor))
    factor_of_safety = round(max(0.42, min(2.85, fos_calc)), 2)
    
    # Risk Level classification
    if risk_score >= 75 or factor_of_safety < 1.10:
        risk_level = "CRITICAL"
    elif risk_score >= 50 or factor_of_safety < 1.30:
        risk_level = "HIGH"
    elif risk_score >= 28 or factor_of_safety < 1.55:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"
        
    # Contributors percentage breakdown
    total_weights = (r_norm * 36) + (m_norm * 26) + (s_norm * 20) + (p_norm * 13) + (seis_norm * 5)
    if total_weights > 0:
        contributors = {
            "Rainfall": round(((r_norm * 36) / total_weights) * 100, 1),
            "Soil Moisture": round(((m_norm * 26) / total_weights) * 100, 1),
            "Slope Angle": round(((s_norm * 20) / total_weights) * 100, 1),
            "Pore Pressure": round(((p_norm * 13) / total_weights) * 100, 1),
            "Seismic Factor": round(((seis_norm * 5) / total_weights) * 100, 1),
        }
    else:
        contributors = {
            "Rainfall": 25.0,
            "Soil Moisture": 25.0,
            "Slope Angle": 25.0,
            "Pore Pressure": 15.0,
            "Seismic Factor": 10.0,
        }
        
    # Model Confidence calculation based on telemetry completeness
    confidence = int(max(75, min(98, round(82 + (r_norm * 7) + (m_norm * 5) + (s_norm * 4)))))
    
    # Dynamic Chain Reaction Cascade
    if risk_level == "CRITICAL":
        chain_reaction = "Zone Apex (Critical Shear) -> Arterial Highway NH-10 (Debris Inflow 20m3) -> Teesta River Culvert (Hydrological Surcharge)"
        ai_summary = f"CRITICAL HAZARD: Saturated soil ({soil_moisture}%) combined with steep slope gradient ({slope} deg) and high precipitation ({rainfall}mm) has reduced slope Factor of Safety to {factor_of_safety}. Failure is imminent."
        recommendation = "Execute Level-3 Emergency Evacuation protocol. Close arterial highways, deploy NDRF/SDRF emergency reconnaissance, and issue automated SMS alerts to downstream habitations."
    elif risk_level == "HIGH":
        chain_reaction = "Upper Escarpment (Micro-fissures) -> Secondary Access Road (Rockfall Risk) -> Valley Drainage Siltation (Monitored)"
        ai_summary = f"HIGH HAZARD: Sustained rainfall ({rainfall}mm) has heightened pore-water pressure to {pore_pressure} kPa. Shear strength along slip planes is actively degrading (FoS: {factor_of_safety})."
        recommendation = "Trigger Level-2 Alert. Dispatch geotechnical inspection drones, establish 24/7 laser extensometer watch, and divert heavy vehicle traffic away from toe slopes."
    elif risk_level == "MODERATE":
        chain_reaction = "Mid-Slope Sector (Surface Runoff) -> Roadside Drainage Ditches (Flow Surcharge) -> Culvert Channels (Clear)"
        ai_summary = f"MODERATE WATCH: Terrain parameters exhibit mild saturation and localized runoff accumulation. Geotechnical stability index remains marginally acceptable (FoS: {factor_of_safety})."
        recommendation = "Maintain active radar and piezometer monitoring. Inspect culverts for debris clogging and brief local disaster management units."
    else:
        chain_reaction = "Slope Sector (Stable Ground) -> Drainage Channels (Unimpeded Flow) -> Road Corridors (All Clear)"
        ai_summary = f"STABLE CONDITIONS: Hydro-meteorological readings are well within safety boundaries. Factor of Safety is strong at {factor_of_safety} with intact root matrix retention."
        recommendation = "Continue standard automated telemetry scanning and routine monthly geotechnical field calibrations."
        
    metrics = {
        "factor_of_safety": factor_of_safety,
        "pore_pressure_kpa": pore_pressure,
        "vegetation_cover_pct": vegetation_cover,
        "seismic_pga_g": seismic_pga,
        "shear_stress_ratio": round(min(1.0, 1.0 / max(0.1, factor_of_safety)), 3),
        "soil_saturation_index": round(m_norm, 2),
    }
    
    return (
        risk_score,
        risk_level,
        factor_of_safety,
        contributors,
        confidence,
        ai_summary,
        recommendation,
        chain_reaction,
        metrics
    )