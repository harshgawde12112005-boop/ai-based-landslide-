import React from 'react';

export default function TopCards() {
  return (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
      <div style={{ padding: '15px', background: '#2a2d35', borderRadius: '8px', flex: 1, borderTop: '3px solid red' }}>
        <h4 style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Total High Risk Zones</h4>
        <h2 style={{ margin: '5px 0 0 0', color: '#ff4d4d' }}>12 ⚠️</h2>
      </div>
      <div style={{ padding: '15px', background: '#2a2d35', borderRadius: '8px', flex: 1, borderTop: '3px solid orange' }}>
        <h4 style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Priority Actions Pending</h4>
        <h2 style={{ margin: '5px 0 0 0', color: '#ffa500' }}>5 ⚠️</h2>
      </div>
      <div style={{ padding: '15px', background: '#2a2d35', borderRadius: '8px', flex: 1, borderTop: '3px solid green' }}>
        <h4 style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Citizen Reports Today</h4>
        <h2 style={{ margin: '5px 0 0 0', color: '#4caf50' }}>8</h2>
      </div>
    </div>
  );
}