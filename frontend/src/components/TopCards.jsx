import React from 'react';

export default function TopCards({ riskData, rainfall, soilMoisture, slope }) {
  const dynamicRisk = riskData?.overall_risk_pct ?? 0;
  const riskLevel = riskData?.risk_level ?? 'LOW';

  const cards = [
    {
      label: 'Current zone risk',
      value: `${dynamicRisk}%`,
      accent: '#f87171',
      meta: `Rain ${rainfall}mm • Soil ${soilMoisture}%`,
    },
    {
      label: 'AI confidence',
      value: `${riskData?.confidence ?? 89}%`,
      accent: '#38bdf8',
      meta: `Slope ${slope}° • Stable model`,
    },
    {
      label: 'Priority actions',
      value: riskLevel === 'CRITICAL' ? '4' : riskLevel === 'HIGH' ? '3' : '1',
      accent: '#fbbf24',
      meta: 'Field inspection required',
    },
    {
      label: 'Emergency status',
      value: riskLevel === 'CRITICAL' ? 'Escalated' : riskLevel === 'HIGH' ? 'Watch' : 'Normal',
      accent: '#4ade80',
      meta: 'Traffic & alerts routed',
    },
  ];

  return (
    <div className="topcards-grid">
      {cards.map((card) => (
        <div key={card.label} className="metric-card" style={{ '--accent': card.accent, '--value-color': card.accent }}>
          <p className="label">{card.label}</p>
          <h2 className="value">{card.value}</h2>
          <div className="meta">{card.meta}</div>
        </div>
      ))}
    </div>
  );
}
