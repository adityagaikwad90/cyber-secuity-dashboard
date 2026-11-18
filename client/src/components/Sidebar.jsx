import React from 'react';

const views = [
  { key: 'summary', icon: '▦', label: 'Executive Summary' },
  { key: 'analysis', icon: '◷', label: 'Threat & Vectors' },
  { key: 'geo', icon: '⚑', label: 'Geographic Map' },
  { key: 'details', icon: '☷', label: 'Incident Explorer' },
  { key: 'methodology', icon: 'ⓘ', label: 'Research & TOE' },
];

export default function Sidebar({
  activeView,
  onViewChange,
  theme,
  onToggleTheme,
  onOpenUpload,
  isCustomData,
  totalRecords
}) {
  return (
    <aside className="app-sidebar">
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); onViewChange('summary'); }}>
        <span className="logo">◈</span> CYBER<span className="thin"> / RISK</span>
      </a>

      <div className="workspace">RESEARCH OBSERVATORY</div>

      <nav className="sidebar-nav">
        {views.map((v) => (
          <button
            key={v.key}
            type="button"
            className={activeView === v.key ? 'active' : ''}
            onClick={() => onViewChange(v.key)}
          >
            <span className="nav-icon">{v.icon}</span>
            <span className="nav-label">{v.label}</span>
          </button>
        ))}
      </nav>

      {/* Upload & Dataset Actions */}
      <div className="sidebar-dataset-box">
        <button
          type="button"
          className="sidebar-upload-btn"
          onClick={onOpenUpload}
        >
          ⇪ Upload Dataset
        </button>
      </div>

      {/* Bottom Status & Theme */}
      <div className="side-bottom">
        <div className="status-row">
          <span className={`status-dot ${isCustomData ? 'custom-active' : ''}`} />
          <span className="status-text">
            {isCustomData ? 'Custom Data Loaded' : 'Research Reference'}
          </span>
        </div>
        <p className="status-sub">
          {totalRecords.toLocaleString('en-IN')} incident records
          <br />
          Online Banking · India
        </p>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? '☀ Light Theme' : '☾ Dark Theme'}
        </button>

        <div className="source-tag">POWER BI ALIGNED ↗</div>
      </div>
    </aside>
  );
}
