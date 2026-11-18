import React from 'react';

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  options
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container advanced-filters-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="adv-filter-title"
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">TARGETED DRILL-DOWN</span>
            <h2 id="adv-filter-title">Advanced Multi-Factor Filters</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>

        <div className="modal-body filter-grid-layout">
          {/* Threat Type */}
          <div className="filter-field">
            <label>Threat Classification</label>
            <select
              value={filters.threatType || ''}
              onChange={(e) => onChange('threatType', e.target.value)}
            >
              <option value="">All Threat Types</option>
              {options.threatTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Attack Method */}
          <div className="filter-field">
            <label>Attack Vector / Method</label>
            <select
              value={filters.attackMethod || ''}
              onChange={(e) => onChange('attackMethod', e.target.value)}
            >
              <option value="">All Attack Methods</option>
              {options.attackMethods.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Banking Channel */}
          <div className="filter-field">
            <label>Banking Touchpoint / Channel</label>
            <select
              value={filters.channel || ''}
              onChange={(e) => onChange('channel', e.target.value)}
            >
              <option value="">All Banking Channels</option>
              {options.channels.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Incident Status */}
          <div className="filter-field">
            <label>Investigation / Lifecycle Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange('status', e.target.value)}
            >
              <option value="">All Incident Statuses</option>
              {options.statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="filter-field">
            <label>Technical Severity</label>
            <select
              value={filters.severity || ''}
              onChange={(e) => onChange('severity', e.target.value)}
            >
              <option value="">All Severities</option>
              {options.severities.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Vulnerability */}
          <div className="filter-field">
            <label>Exploited Vulnerability</label>
            <select
              value={filters.vulnerability || ''}
              onChange={(e) => onChange('vulnerability', e.target.value)}
            >
              <option value="">All Vulnerabilities</option>
              {options.vulnerabilities.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Security Control */}
          <div className="filter-field">
            <label>Active Security Control</label>
            <select
              value={filters.securityControl || ''}
              onChange={(e) => onChange('securityControl', e.target.value)}
            >
              <option value="">All Security Controls</option>
              {options.securityControls.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div className="filter-field">
            <label>Transaction Modality</label>
            <select
              value={filters.transactionType || ''}
              onChange={(e) => onChange('transactionType', e.target.value)}
            >
              <option value="">All Transaction Types</option>
              {options.transactionTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Risk Score Range */}
          <div className="filter-field full-row">
            <label>
              Risk Score Interval ({filters.minRiskScore || 0} to {filters.maxRiskScore || 100})
            </label>
            <div className="range-inputs-row">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min 0"
                value={filters.minRiskScore ?? ''}
                onChange={(e) => onChange('minRiskScore', e.target.value)}
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max 100"
                value={filters.maxRiskScore ?? ''}
                onChange={(e) => onChange('maxRiskScore', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onReset}>
            Reset All Filters
          </button>
          <button type="button" className="primary-btn" onClick={onClose}>
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
