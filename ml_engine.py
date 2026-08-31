def calculate_landslide_risk(rainfall, soil_moisture, slope):
    rainfall_norm = min(max(rainfall / 200, 0), 1)
    moisture_norm = min(max(soil_moisture / 100, 0), 1)
    slope_norm = min(max(slope / 80, 0), 1)

    weighted_score = (
        rainfall_norm * 0.46 +
        moisture_norm * 0.35 +
        slope_norm * 0.19
    ) * 100
    risk_score = max(0, min(round(weighted_score), 100))

    if risk_score >= 80:
        level = "CRITICAL"
    elif risk_score >= 60:
        level = "HIGH"
    elif risk_score >= 40:
        level = "MODERATE"
    else:
        level = "LOW"

    contributors = {
        "Rainfall": round(rainfall_norm * 46, 1),
        "Soil Moisture": round(moisture_norm * 35, 1),
        "Slope": round(slope_norm * 19, 1),
    }

    confidence = max(70, min(97, round(78 + rainfall_norm * 12 + moisture_norm * 7 + slope_norm * 3)))

    if level == "CRITICAL":
        recommendation = "Deploy emergency response team, restrict access, and issue evacuation alerts to nearby settlements."
        ai_summary = "The AI model identifies a very high probability of slope failure driven by extreme rainfall and saturated soil."
    elif level == "HIGH":
        recommendation = "Prioritize site inspection and trigger road monitoring for vulnerable routes and settlements."
        ai_summary = "Critical rainfall and soil saturation are elevating slope instability, raising the chance of landslide initiation."
    elif level == "MODERATE":
        recommendation = "Maintain active monitoring and prepare local response teams for possible escalation."
        ai_summary = "Conditions are unstable but not yet critical; ongoing sensor checks are recommended."
    else:
        recommendation = "Continue normal monitoring and keep routine field checks active."
        ai_summary = "The terrain is currently within a stable threshold, though rainfall trends should be watched closely."

    return risk_score, level, contributors, confidence, ai_summary, recommendation