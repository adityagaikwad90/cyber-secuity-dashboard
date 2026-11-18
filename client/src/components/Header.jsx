import React from 'react';

export default function Header({
  activeView,
  isCustomData,
  onOpenUpload,
  onExportCSV,
  onExportPDF,
  theme,
  onToggleTheme
}) {
  const viewLabels = {
    summary: 'Executive Summary',
    analysis: 'Threat & Attack Vectors',
    geo: 'Geographic Intelligence',
    details: 'Incident Explorer',
    methodology: 'Research & TOE Framework',
  };

  return (
    <header className="app-header">
      <div className="breadcrumb">
        Cyber Risk Observatory <span>/</span> {viewLabels[activeView] || 'Intelligence'}
      </div>

      <div className="header-actions">
        <span className={`dataset-badge ${isCustomData ? 'custom-badge' : ''}`}>
          <i /> {isCustomData ? 'Custom Dataset (Local)' : 'Research Dataset (5,000)'}
        </span>

        <button
          type="button"
          className="header-btn upload-header-btn"
          onClick={onOpenUpload}
          title="Upload Excel or CSV dataset"
        >
          ⇪ Upload Data
        </button>

        <button
          type="button"
          className="header-btn pdf-btn"
          onClick={onExportPDF}
          title="Download PDF executive report"
        >
          📄 Download PDF
        </button>

        <button
          type="button"
          className="header-btn export-btn"
          onClick={onExportCSV}
          title="Export filtered records as CSV"
        >
          ↓ Export CSV
        </button>

        <button
          type="button"
          className="theme-icon-btn"
          onClick={onToggleTheme}
          title="Toggle Light/Dark Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
