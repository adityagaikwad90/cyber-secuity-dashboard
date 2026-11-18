import React from 'react';

export default function FilterBar({
  filters,
  filterOptions,
  onChange,
  onReset,
  recordCount,
  onOpenAdvanced,
  activeFilterCount,
  onRemoveFilter
}) {
  const handleDatePreset = (preset) => {
    const today = new Date('2026-03-31'); // Max date in dataset
    const toISO = (d) => d.toISOString().split('T')[0];

    if (preset === 'all') {
      onChange('startDate', '');
      onChange('endDate', '');
      onChange('year', '');
    } else if (preset === '2023') {
      onChange('startDate', '2023-01-01');
      onChange('endDate', '2023-12-31');
      onChange('year', '2023');
    } else if (preset === '2024') {
      onChange('startDate', '2024-01-01');
      onChange('endDate', '2024-12-31');
      onChange('year', '2024');
    } else if (preset === '2025') {
      onChange('startDate', '2025-01-01');
      onChange('endDate', '2025-12-31');
      onChange('year', '2025');
    } else if (preset === '2026') {
      onChange('startDate', '2026-01-01');
      onChange('endDate', '2026-03-31');
      onChange('year', '2026');
    } else if (preset === 'last12m') {
      const past = new Date('2025-04-01');
      onChange('startDate', toISO(past));
      onChange('endDate', toISO(today));
      onChange('year', '');
    }
  };

  // Build active filter tags for easy review & one-click removal
  const activeTags = [];
  if (filters.year) activeTags.push({ key: 'year', label: `Year: ${filters.year}` });
  if (filters.state) activeTags.push({ key: 'state', label: `State: ${filters.state}` });
  if (filters.city) activeTags.push({ key: 'city', label: `City: ${filters.city}` });
  if (filters.riskLevel) activeTags.push({ key: 'riskLevel', label: `Risk: ${filters.riskLevel}` });
  if (filters.threatType) activeTags.push({ key: 'threatType', label: `Threat: ${filters.threatType}` });
  if (filters.attackMethod) activeTags.push({ key: 'attackMethod', label: `Attack: ${filters.attackMethod}` });
  if (filters.channel) activeTags.push({ key: 'channel', label: `Channel: ${filters.channel}` });
  if (filters.status) activeTags.push({ key: 'status', label: `Status: ${filters.status}` });
  if (filters.severity) activeTags.push({ key: 'severity', label: `Severity: ${filters.severity}` });
  if (filters.vulnerability) activeTags.push({ key: 'vulnerability', label: `Vuln: ${filters.vulnerability}` });
  if (filters.securityControl) activeTags.push({ key: 'securityControl', label: `Control: ${filters.securityControl}` });
  if (filters.startDate || filters.endDate) {
    activeTags.push({
      key: 'dates',
      label: `Dates: ${filters.startDate || 'Start'} → ${filters.endDate || 'End'}`
    });
  }
  if (filters.minRiskScore || filters.maxRiskScore) {
    activeTags.push({
      key: 'riskScoreRange',
      label: `Score: ${filters.minRiskScore || 0} - ${filters.maxRiskScore || 100}`
    });
  }

  return (
    <div className="filter-wrapper">
      <div className="filters">
        <span className="filter-icon" aria-hidden="true">☷</span>

        {/* Date Presets Quick Pills */}
        <div className="date-presets">
          <button
            type="button"
            className={!filters.year && !filters.startDate ? 'preset-btn active' : 'preset-btn'}
            onClick={() => handleDatePreset('all')}
          >
            All Time
          </button>
          <button
            type="button"
            className={filters.year === '2023' ? 'preset-btn active' : 'preset-btn'}
            onClick={() => handleDatePreset('2023')}
          >
            2023
          </button>
          <button
            type="button"
            className={filters.year === '2024' ? 'preset-btn active' : 'preset-btn'}
            onClick={() => handleDatePreset('2024')}
          >
            2024
          </button>
          <button
            type="button"
            className={filters.year === '2025' ? 'preset-btn active' : 'preset-btn'}
            onClick={() => handleDatePreset('2025')}
          >
            2025
          </button>
          <button
            type="button"
            className={filters.year === '2026' ? 'preset-btn active' : 'preset-btn'}
            onClick={() => handleDatePreset('2026')}
          >
            2026
          </button>
        </div>

        {/* Date Pickers */}
        <div className="date-inputs-group">
          <label className="date-label">
            From
            <input
              type="date"
              value={filters.startDate || ''}
              min="2023-01-01"
              max="2026-03-31"
              onChange={(e) => onChange('startDate', e.target.value)}
              className="date-input"
            />
          </label>
          <label className="date-label">
            To
            <input
              type="date"
              value={filters.endDate || ''}
              min="2023-01-01"
              max="2026-03-31"
              onChange={(e) => onChange('endDate', e.target.value)}
              className="date-input"
            />
          </label>
        </div>

        {/* Period Comparison Checkbox */}
        <label className="compare-toggle" title="Compare metrics to identical previous duration">
          <input
            type="checkbox"
            checked={!!filters.comparePeriod}
            onChange={(e) => onChange('comparePeriod', e.target.checked)}
            disabled={!filters.startDate || !filters.endDate}
          />
          <span>Period Comparison %</span>
        </label>

        {/* Primary Dropdowns */}
        <label>
          State
          <select value={filters.state} onChange={(e) => onChange('state', e.target.value)}>
            <option value="">All states</option>
            {filterOptions.states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          City
          <select value={filters.city} onChange={(e) => onChange('city', e.target.value)}>
            <option value="">All cities</option>
            {filterOptions.cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Risk level
          <select value={filters.riskLevel} onChange={(e) => onChange('riskLevel', e.target.value)}>
            <option value="">All risk levels</option>
            {filterOptions.riskLevels.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        {/* Advanced Filters Button */}
        <button
          type="button"
          className={`advanced-btn ${activeFilterCount > 0 ? 'has-active' : ''}`}
          onClick={onOpenAdvanced}
        >
          ⚙ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        <button type="button" className="reset-btn" onClick={onReset} title="Clear all active filters">
          Reset ↺
        </button>

        <span id="record-count">{recordCount}</span>
      </div>

      {/* Active Filter Tags Bar */}
      {activeTags.length > 0 && (
        <div className="active-tags-bar">
          <span className="tags-label">Active Filters:</span>
          <div className="tags-container">
            {activeTags.map((t) => (
              <span key={t.key} className="filter-pill">
                {t.label}
                <button
                  type="button"
                  onClick={() => onRemoveFilter(t.key)}
                  aria-label={`Remove filter ${t.label}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <button type="button" className="clear-all-text-btn" onClick={onReset}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
