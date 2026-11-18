import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber, RISK_COLORS } from '../utils/format.js';

export default function RiskDonut({ data, selectedRisk, onSelectRisk }) {
  const total = (data || []).reduce((s, d) => s + (d.count || 0), 0);

  const handlePieClick = (entry) => {
    if (entry && entry.level) {
      onSelectRisk(selectedRisk === entry.level ? '' : entry.level);
    }
  };

  return (
    <article className="panel donut-panel">
      <div className="panel-head">
        <div>
          <h2>Risk Stratification</h2>
          <p>Distribution by risk tier (Click slice to cross-filter)</p>
        </div>
        {selectedRisk && (
          <span className="filter-active-indicator">
            Active: {selectedRisk}
          </span>
        )}
      </div>

      <div className="donut-layout">
        <div className="donut-chart-container" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                }}
                formatter={(val, name) => [`${val} incidents (${total ? ((val / total) * 100).toFixed(1) : 0}%)`, name]}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={74}
                paddingAngle={2}
                strokeWidth={selectedRisk ? 2 : 1}
                stroke="var(--card-bg)"
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {(data || []).map((d) => {
                  const isSelected = selectedRisk === d.level;
                  const baseColor = RISK_COLORS[d.level] || '#888888';
                  return (
                    <Cell
                      key={d.level}
                      fill={baseColor}
                      opacity={selectedRisk && !isSelected ? 0.35 : 1}
                      stroke={isSelected ? '#ffffff' : 'var(--card-bg)'}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="donut-info">
          <div className="donut-total">{formatNumber(total)}</div>
          <small className="donut-sub">total incidents</small>

          <div className="risk-legend">
            {(data || []).map((d) => {
              const isSelected = selectedRisk === d.level;
              return (
                <div
                  key={d.level}
                  className={`legend-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectRisk(selectedRisk === d.level ? '' : d.level)}
                  role="button"
                  tabIndex={0}
                  title={`Filter by ${d.level} risk`}
                >
                  <i style={{ background: RISK_COLORS[d.level] }} />
                  <span className="legend-name">{d.level}</span>
                  <b className="legend-val">{d.percentage}%</b>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
