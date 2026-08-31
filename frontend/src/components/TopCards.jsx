import React from 'react';
import { AlertTriangle, ShieldCheck, Activity, Radio, Droplets, Mountain } from 'lucide-react';

export default function TopCards({ riskData, rainfall, soilMoisture, slope }) {
  const dynamicRisk = riskData?.overall_risk_pct ?? 0;
  const riskLevel = riskData?.risk_level ?? 'LOW';
  const fos = riskData?.factor_of_safety ?? 1.85;

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f59e0b';
      case 'MODERATE':
        return '#eab308';
      default:
        return '#10b981';
    }
  };

  const currentRiskColor = getRiskColor(riskLevel);

  const cards = [
    {
      label: 'Zone Risk Index',
      value: `${dynamicRisk}%`,
      accent: currentRiskColor,
      icon: <AlertTriangle size={20} />,
      meta: `${riskLevel} Risk • Rain ${rainfall}mm`,
      valueColor: currentRiskColor,
    },
    {
      label: 'Factor of Safety (FoS)',
      value: `${fos}`,
      accent: fos < 1.1 ? '#ef4444' : fos < 1.3 ? '#f59e0b' : '#10b981',
      icon: <Mountain size={20} />,
      meta: fos < 1.0 ? 'Failure Imminent' : fos < 1.3 ? 'Marginal Stability' : 'Geotechnically Stable',
      valueColor: fos < 1.1 ? '#ef4444' : fos < 1.3 ? '#f59e0b' : '#10b981',
    },
    {
      label: 'Model Confidence',
      value: `${riskData?.confidence ?? 89}%`,
      accent: '#0ea5e9',
      icon: <Activity size={20} />,
      meta: `Slope ${slope}° • Multi-sensor Feed`,
      valueColor: '#0ea5e9',
    },
    {
      label: 'Telemetry Status',
      value: riskLevel === 'CRITICAL' ? 'EVACUATION' : riskLevel === 'HIGH' ? 'WATCH' : 'NOMINAL',
      accent: currentRiskColor,
      icon: <Radio size={20} />,
      meta: `Soil ${soilMoisture}% Saturation`,
      valueColor: currentRiskColor,
    },
  ];

  return (
    <div className="topcards-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className="metric-card"
          style={{
            '--accent-bar': card.accent,
            '--value-color': card.valueColor,
          }}
        >
          <div className="metric-header">
            <p className="label">{card.label}</p>
            <div className="metric-icon-wrap" style={{ color: card.accent }}>
              {card.icon}
            </div>
          </div>
          <h2 className="value">{card.value}</h2>
          <div className="meta">
            <span>{card.meta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
