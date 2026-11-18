import React from 'react';
import { formatNumber, formatMoney } from '../utils/format.js';

export default function BarChart({
  title,
  subtitle,
  data = [],
  isMoney = false,
  icon = '↗',
  selectedValue,
  onSelectValue,
  filterKeyName
}) {
  const max = Math.max(...data.map(d => isMoney ? (d.loss || 0) : (d.count || 0)), 1);

  return (
    <article className="panel bar-panel">
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle} (Click bar to cross-filter)</p>
        </div>
        <div className="bar-head-meta">
          {selectedValue && (
            <span className="filter-active-indicator">
              Filtered: {selectedValue}
            </span>
          )}
          <span className="panel-icon">{icon}</span>
        </div>
      </div>

      <div className="bar-list">
        {data.length ? data.map((d, i) => {
          const val = isMoney ? d.loss : d.count;
          const pct = ((val / max) * 100);
          const isSelected = selectedValue === d.name;

          return (
            <div
              className={`bar-row ${isSelected ? 'selected' : ''}`}
              key={d.name || i}
              onClick={() => onSelectValue(isSelected ? '' : d.name)}
              role="button"
              tabIndex={0}
              title={`Click to filter by ${d.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectValue(isSelected ? '' : d.name);
                }
              }}
            >
              <button type="button" className="bar-name-btn">
                {d.name}
              </button>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.max(4, pct)}%`,
                    backgroundColor: isSelected ? 'var(--accent)' : undefined
                  }}
                />
              </div>
              <b className="bar-value">
                {isMoney ? formatMoney(val) : formatNumber(val)}
              </b>
            </div>
          );
        }) : (
          <p className="empty-notice">No records match the current filter selection.</p>
        )}
      </div>
    </article>
  );
}
