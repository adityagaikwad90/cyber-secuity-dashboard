import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import KPICards from './components/KPICards.jsx';
import InsightCards from './components/InsightCards.jsx';
import TrendChart from './components/TrendChart.jsx';
import RiskDonut from './components/RiskDonut.jsx';
import BarChart from './components/BarChart.jsx';
import IndiaMap from './components/IndiaMap.jsx';
import IncidentExplorer from './components/IncidentExplorer.jsx';
import AdvancedFilterModal from './components/AdvancedFilterModal.jsx';
import UploadModal from './components/UploadModal.jsx';
import ResearchMethodology from './components/ResearchMethodology.jsx';

import { useDashboard } from './hooks/useDashboard.js';
import { useTheme } from './hooks/useTheme.js';
import { formatNumber } from './utils/format.js';

const VIEW_TITLES = {
  summary: {
    title: 'Cyber Risk at a Glance',
    eyebrow: 'EXECUTIVE INTELLIGENCE DASHBOARD',
    subtitle: 'Holistic risk indicators, financial exposure, and cross-channel threat trajectory across Indian online banking.',
  },
  analysis: {
    title: 'Threat & Vector Analytics',
    eyebrow: 'DEEP-DIVE ATTACK VECTORS',
    subtitle: 'Technical root-cause analysis, vulnerability surfaces, exploited authentication protocols, and touchpoint security.',
  },
  geo: {
    title: 'Geographic Threat & Loss Map',
    eyebrow: 'STATE JURISDICTION INTELLIGENCE',
    subtitle: 'Interactive India choropleth mapping incidents, monetary exposure, and customer impact across 10 commercial banking regions.',
  },
  details: {
    title: 'Incident Record Inspector',
    eyebrow: 'GRANULAR AUDIT EXPLORER',
    subtitle: 'Filter, inspect, sort, and export individual banking cybersecurity incident logs with 21 operational dimensions.',
  },
  methodology: {
    title: 'Research & TOE Framework',
    eyebrow: 'THEORETICAL MODEL & SPECIFICATION',
    subtitle: 'Technology-Organization-Environment (TOE) framework, literature survey, empirical objectives, and full variable dictionary.',
  },
};

export default function App() {
  const [view, setView] = useState('summary');
  const { theme, toggleTheme } = useTheme();

  const {
    allData,
    filteredRecords,
    stats,
    periodComparison,
    filters,
    filterOptions,
    trendData,
    riskData,
    getThreatData,
    getLossData,
    updateFilter,
    removeFilter,
    resetFilters,
    activeFilterCount,
    isCustomData,
    customFileName,
    handleUploadSuccess,
    resetToDefaultData,
    exportCSV,
    exportPDF,
    isAdvancedFilterOpen,
    setIsAdvancedFilterOpen,
    isUploadModalOpen,
    setIsUploadModalOpen,
  } = useDashboard();

  const currentViewMeta = VIEW_TITLES[view] || VIEW_TITLES.summary;

  return (
    <>
      <Sidebar
        activeView={view}
        onViewChange={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        isCustomData={isCustomData}
        totalRecords={allData.length}
      />

      <main className="main-content-layout">
        <Header
          activeView={view}
          isCustomData={isCustomData}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onExportCSV={exportCSV}
          onExportPDF={exportPDF}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Heading Section */}
        <section className="heading-section">
          <div>
            <span className="eyebrow">{currentViewMeta.eyebrow}</span>
            <h1 className="main-title">
              {currentViewMeta.title}
              <span>.</span>
            </h1>
            <p className="subtitle">{currentViewMeta.subtitle}</p>
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={exportPDF}
            title="Download executive PDF summary"
          >
            ↓ Export Executive PDF
          </button>
        </section>

        {/* Global Filter Bar (shown on all analytics views) */}
        {view !== 'methodology' && (
          <FilterBar
            filters={filters}
            filterOptions={filterOptions}
            onChange={updateFilter}
            onReset={resetFilters}
            recordCount={`${formatNumber(stats.total)} / ${formatNumber(allData.length)} records`}
            onOpenAdvanced={() => setIsAdvancedFilterOpen(true)}
            activeFilterCount={activeFilterCount}
            onRemoveFilter={removeFilter}
          />
        )}

        {/* VIEW 1: EXECUTIVE SUMMARY */}
        {view === 'summary' && (
          <div className="view-container">
            {/* Extended KPIs with Period Comparison % Deltas */}
            <KPICards stats={stats} periodComparison={periodComparison} />

            {/* Dynamic Automated Pattern Insights */}
            <InsightCards records={filteredRecords} />

            {/* Chart Grid: Trend & Risk Donut */}
            <div className="chart-grid">
              <TrendChart
                data={trendData}
                selectedYear={filters.year}
                onSelectYear={(yr) => updateFilter('year', yr)}
              />
              <RiskDonut
                data={riskData}
                selectedRisk={filters.riskLevel}
                onSelectRisk={(r) => updateFilter('riskLevel', r)}
              />
            </div>

            {/* Chart Grid: Threat Landscape & State Loss */}
            <div className="chart-grid">
              <BarChart
                title="Threat Landscape"
                subtitle="Incidents by threat category"
                data={getThreatData('Threat_Type')}
                selectedValue={filters.threatType}
                onSelectValue={(t) => updateFilter('threatType', t)}
                filterKeyName="Threat_Type"
              />
              <BarChart
                title="Financial Exposure by State"
                subtitle="Total monetary loss in INR"
                data={getLossData('State')}
                isMoney
                selectedValue={filters.state}
                onSelectValue={(s) => updateFilter('state', s)}
                filterKeyName="State"
              />
            </div>

            {/* Interactive India Map */}
            <IndiaMap
              records={filteredRecords}
              selectedState={filters.state}
              onSelectState={(s) => updateFilter('state', s)}
            />

            {/* Quick Preview of Incidents Table */}
            <IncidentExplorer
              records={filteredRecords}
              onExportCSV={exportCSV}
            />
          </div>
        )}

        {/* VIEW 2: THREAT & VECTOR ANALYTICS */}
        {view === 'analysis' && (
          <div className="view-container">
            <KPICards stats={stats} periodComparison={periodComparison} />

            <InsightCards records={filteredRecords} />

            <div className="chart-grid">
              <BarChart
                title="Attack Vectors & Mechanisms"
                subtitle="Incident frequency by technical vector"
                data={getThreatData('Attack_Method')}
                selectedValue={filters.attackMethod}
                onSelectValue={(a) => updateFilter('attackMethod', a)}
                filterKeyName="Attack_Method"
              />
              <BarChart
                title="Financial Exposure by Banking Channel"
                subtitle="Monetary loss sustained across touchpoints"
                data={getLossData('Channel')}
                isMoney
                selectedValue={filters.channel}
                onSelectValue={(c) => updateFilter('channel', c)}
                filterKeyName="Channel"
              />
            </div>

            <div className="chart-grid">
              <BarChart
                title="Exploited System Vulnerabilities"
                subtitle="Incident concentration by root-cause weakness"
                data={getThreatData('Vulnerability')}
                selectedValue={filters.vulnerability}
                onSelectValue={(v) => updateFilter('vulnerability', v)}
                filterKeyName="Vulnerability"
              />
              <BarChart
                title="Active Security Controls"
                subtitle="Defenses deployed during detected incidents"
                data={getThreatData('Security_Control')}
                selectedValue={filters.securityControl}
                onSelectValue={(sc) => updateFilter('securityControl', sc)}
                filterKeyName="Security_Control"
              />
            </div>

            <div className="chart-grid">
              <BarChart
                title="Transaction Modalities"
                subtitle="Incident volume across payment transaction types"
                data={getThreatData('Transaction_Type')}
                selectedValue={filters.transactionType}
                onSelectValue={(tt) => updateFilter('transactionType', tt)}
                filterKeyName="Transaction_Type"
              />
              <BarChart
                title="Technical Severity Stratification"
                subtitle="Incident volume by severity rating"
                data={getThreatData('Severity')}
                selectedValue={filters.severity}
                onSelectValue={(sev) => updateFilter('severity', sev)}
                filterKeyName="Severity"
              />
            </div>
          </div>
        )}

        {/* VIEW 3: GEOGRAPHIC MAP VIEW */}
        {view === 'geo' && (
          <div className="view-container">
            <IndiaMap
              records={filteredRecords}
              selectedState={filters.state}
              onSelectState={(s) => updateFilter('state', s)}
            />
            <div className="chart-grid">
              <BarChart
                title="Financial Loss by State Jurisdiction"
                subtitle="Recorded financial loss in INR"
                data={getLossData('State')}
                isMoney
                selectedValue={filters.state}
                onSelectValue={(s) => updateFilter('state', s)}
              />
              <BarChart
                title="Incident Volume by State"
                subtitle="Total incident count by jurisdiction"
                data={getThreatData('State')}
                selectedValue={filters.state}
                onSelectValue={(s) => updateFilter('state', s)}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: INCIDENT TABLE EXPLORER */}
        {view === 'details' && (
          <div className="view-container">
            <IncidentExplorer
              records={filteredRecords}
              onExportCSV={exportCSV}
            />
          </div>
        )}

        {/* VIEW 5: RESEARCH & METHODOLOGY (TOE FRAMEWORK) */}
        {view === 'methodology' && <ResearchMethodology />}

        {/* Footer */}
        <footer className="app-footer">
          <span>
            CYBER / RISK OBSERVATORY <span className="footer-divider">|</span> Online Banking Risk Intelligence · India
          </span>
          <span>
            Source: Research Dataset (cyber_security_risk_dataset.xlsx / CYber-security project.pbix)
          </span>
        </footer>
      </main>

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
        options={filterOptions}
      />

      {/* Excel Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onResetDefault={resetToDefaultData}
        isCustomData={isCustomData}
        totalRecords={allData.length}
      />
    </>
  );
}
