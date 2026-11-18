import React, { useState } from 'react';
import { formatNumber, formatMoney } from '../utils/format.js';
import { computeStateAggregates } from '../utils/analytics.js';

// SVG Paths representing Indian States in an 600x650 coordinate system
const STATE_PATHS = [
  {
    id: 'Rajasthan',
    name: 'Rajasthan',
    labelX: 190,
    labelY: 260,
    path: 'M 140,210 L 210,195 L 250,225 L 260,270 L 235,330 L 175,340 L 130,290 Z',
  },
  {
    id: 'Uttar Pradesh',
    name: 'Uttar Pradesh',
    labelX: 300,
    labelY: 250,
    path: 'M 250,225 L 340,215 L 390,260 L 370,300 L 295,290 L 260,270 Z',
  },
  {
    id: 'Delhi',
    name: 'Delhi',
    labelX: 255,
    labelY: 220,
    path: 'M 245,215 L 260,215 L 262,228 L 247,228 Z',
  },
  {
    id: 'Madhya Pradesh',
    name: 'Madhya Pradesh',
    labelX: 275,
    labelY: 330,
    path: 'M 235,330 L 295,290 L 370,300 L 380,350 L 320,380 L 230,375 L 215,350 Z',
  },
  {
    id: 'Gujarat',
    name: 'Gujarat',
    labelX: 135,
    labelY: 350,
    path: 'M 130,290 L 175,340 L 215,350 L 185,410 L 120,405 L 90,360 L 105,320 Z',
  },
  {
    id: 'Maharashtra',
    name: 'Maharashtra',
    labelX: 225,
    labelY: 420,
    path: 'M 185,410 L 230,375 L 320,380 L 330,440 L 260,490 L 195,470 Z',
  },
  {
    id: 'West Bengal',
    name: 'West Bengal',
    labelX: 430,
    labelY: 310,
    path: 'M 390,260 L 440,265 L 435,330 L 450,380 L 415,365 L 405,310 Z',
  },
  {
    id: 'Telangana',
    name: 'Telangana',
    labelX: 295,
    labelY: 450,
    path: 'M 270,430 L 330,430 L 345,475 L 280,485 Z',
  },
  {
    id: 'Karnataka',
    name: 'Karnataka',
    labelX: 225,
    labelY: 510,
    path: 'M 200,470 L 260,480 L 275,540 L 235,570 L 210,530 Z',
  },
  {
    id: 'Tamil Nadu',
    name: 'Tamil Nadu',
    labelX: 265,
    labelY: 575,
    path: 'M 240,545 L 290,520 L 300,590 L 255,620 L 235,570 Z',
  },
];

// Contextual surrounding outlines of India for geographical realism
const INDIA_OUTLINE_PATHS = [
  // North / Jammu & Kashmir / Ladakh
  'M 200,100 L 240,70 L 280,90 L 270,140 L 210,145 L 180,130 Z',
  // Punjab & Haryana & Himachal
  'M 180,130 L 210,145 L 250,140 L 260,190 L 205,195 L 175,170 Z',
  // Bihar & Jharkhand & Odisha
  'M 370,300 L 420,300 L 430,390 L 380,420 L 335,380 Z',
  // Andhra Pradesh
  'M 330,430 L 375,445 L 340,530 L 280,510 L 280,485 Z',
  // Kerala
  'M 215,535 L 235,570 L 250,615 L 230,610 L 210,550 Z',
  // Northeast (Assam, Arunachal, etc.)
  'M 440,265 L 510,230 L 540,260 L 480,310 L 435,320 Z'
];

export default function IndiaMap({ records, selectedState, onSelectState }) {
  const [metric, setMetric] = useState('count'); // 'count' | 'loss'
  const [hoveredState, setHoveredState] = useState(null);

  const stateAggs = computeStateAggregates(records);
  const stateMap = {};
  stateAggs.forEach(s => { stateMap[s.state] = s; });

  const maxVal = Math.max(
    ...stateAggs.map(s => (metric === 'loss' ? s.loss : s.count)),
    1
  );

  // Compute color based on intensity
  const getColor = (stateName) => {
    const data = stateMap[stateName];
    if (!data) return '#e8edea'; // No data or outside dataset
    const val = metric === 'loss' ? data.loss : data.count;
    const ratio = Math.min(1, Math.max(0.15, val / maxVal));

    if (selectedState === stateName) {
      return '#e76f51'; // Selected accent
    }

    if (metric === 'loss') {
      // Warm amber to deep rust
      const r = Math.round(50 + ratio * 180);
      const g = Math.round(140 - ratio * 40);
      const b = Math.round(110 - ratio * 40);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Sage to rich forest emerald
      const r = Math.round(160 - ratio * 120);
      const g = Math.round(200 - ratio * 90);
      const b = Math.round(170 - ratio * 80);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const activeHover = hoveredState ? stateMap[hoveredState] : null;

  return (
    <article className="panel india-map-panel">
      <div className="panel-head">
        <div>
          <h2>Geographic Incident & Exposure Map</h2>
          <p>Interactive India geospatial distribution across 10 banking regions</p>
        </div>
        <div className="map-controls">
          <div className="metric-toggle">
            <button
              className={metric === 'count' ? 'active' : ''}
              onClick={() => setMetric('count')}
              title="Show incident count"
            >
              Incident Volume
            </button>
            <button
              className={metric === 'loss' ? 'active' : ''}
              onClick={() => setMetric('loss')}
              title="Show financial loss in INR"
            >
              Financial Exposure (INR)
            </button>
          </div>
          {selectedState && (
            <button
              className="clear-state-btn"
              onClick={() => onSelectState('')}
              title="Clear state filter"
            >
              ✕ Clear {selectedState}
            </button>
          )}
        </div>
      </div>

      <div className="india-map-container">
        {/* SVG Map */}
        <div className="svg-map-wrapper">
          <svg
            viewBox="70 60 480 570"
            className="india-svg"
            role="img"
            aria-label="Map of India showing cybersecurity incidents by state"
          >
            {/* Contextual non-dataset regions */}
            <g className="context-regions" fill="#e9eee8" stroke="#d5ddd7" strokeWidth="1">
              {INDIA_OUTLINE_PATHS.map((p, i) => (
                <path key={i} d={p} opacity="0.65" />
              ))}
            </g>

            {/* Dataset States */}
            <g className="interactive-states">
              {STATE_PATHS.map((sp) => {
                const sData = stateMap[sp.name];
                const isSelected = selectedState === sp.name;
                const isHovered = hoveredState === sp.name;
                const fillColor = getColor(sp.name);

                return (
                  <g
                    key={sp.id}
                    className={`state-node ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                    onClick={() => onSelectState(isSelected ? '' : sp.name)}
                    onMouseEnter={() => setHoveredState(sp.name)}
                    onMouseLeave={() => setHoveredState(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${sp.name}: ${sData ? sData.count + ' incidents' : '0'}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectState(isSelected ? '' : sp.name);
                      }
                    }}
                  >
                    <path
                      d={sp.path}
                      fill={fillColor}
                      stroke={isSelected ? '#ffffff' : '#ffffff'}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      className="state-path"
                    />
                    {/* State label text pin */}
                    <text
                      x={sp.labelX}
                      y={sp.labelY}
                      className="state-svg-label"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {sp.name === 'Madhya Pradesh' ? 'MP' : sp.name === 'Uttar Pradesh' ? 'UP' : sp.name === 'Tamil Nadu' ? 'TN' : sp.name === 'West Bengal' ? 'WB' : sp.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hover Tooltip Overlay */}
          {activeHover && (
            <div className="map-tooltip">
              <div className="tooltip-title">{activeHover.state}</div>
              <div className="tooltip-grid">
                <div>
                  <span>Incidents:</span>
                  <b>{formatNumber(activeHover.count)}</b>
                </div>
                <div>
                  <span>Total Loss:</span>
                  <b>{formatMoney(activeHover.loss)}</b>
                </div>
                <div>
                  <span>Customers:</span>
                  <b>{formatNumber(activeHover.customers)}</b>
                </div>
                <div>
                  <span>Mean Risk:</span>
                  <b>{activeHover.avgRisk} / 100</b>
                </div>
                <div className="full-width">
                  <span>Top Threat:</span>
                  <b>{activeHover.topThreat}</b>
                </div>
              </div>
              <div className="tooltip-cta">Click state to filter dashboard</div>
            </div>
          )}
        </div>

        {/* State Ranking Leaderboard */}
        <div className="state-ranking-sidebar">
          <div className="ranking-header">
            <span>State Jurisdictions ({stateAggs.length})</span>
            <span className="metric-col">{metric === 'loss' ? 'Loss (INR)' : 'Incidents'}</span>
          </div>
          <div className="state-list">
            {stateAggs.map((s, idx) => {
              const isSelected = selectedState === s.state;
              const val = metric === 'loss' ? s.loss : s.count;
              const pct = (val / maxVal) * 100;

              return (
                <div
                  key={s.state}
                  className={`state-rank-item ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectState(isSelected ? '' : s.state)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="rank-num">#{idx + 1}</div>
                  <div className="rank-info">
                    <div className="rank-name-row">
                      <span className="state-name">{s.state}</span>
                      <span className="state-val">
                        {metric === 'loss' ? formatMoney(s.loss) : formatNumber(s.count)}
                      </span>
                    </div>
                    <div className="rank-bar-bg">
                      <div
                        className="rank-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isSelected ? 'var(--accent)' : 'var(--primary)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
