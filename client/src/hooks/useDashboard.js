import { useState, useMemo, useCallback } from 'react';
import defaultIncidents from '../data/incidents.json';
import {
  filterIncidents,
  computeStats,
  computePeriodComparison
} from '../utils/analytics.js';
import { generateDashboardPDF } from '../utils/pdfGenerator.js';

export function useDashboard() {
  const [allData, setAllData] = useState(defaultIncidents);
  const [isCustomData, setIsCustomData] = useState(false);
  const [customFileName, setCustomFileName] = useState('');

  // Active filter state
  const [filters, setFilters] = useState({
    year: '',
    state: '',
    city: '',
    riskLevel: '',
    threatType: '',
    attackMethod: '',
    channel: '',
    status: '',
    severity: '',
    vulnerability: '',
    securityControl: '',
    transactionType: '',
    minRiskScore: '',
    maxRiskScore: '',
    startDate: '',
    endDate: '',
    search: '',
    comparePeriod: false,
  });

  // Modals state
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterIncidents(allData, filters);
  }, [allData, filters]);

  // KPIs
  const stats = useMemo(() => {
    return computeStats(filteredRecords);
  }, [filteredRecords]);

  // Period Comparison
  const periodComparison = useMemo(() => {
    return computePeriodComparison(allData, filters);
  }, [allData, filters]);

  // Dynamic filter options based on dataset
  const filterOptions = useMemo(() => {
    const years = [...new Set(allData.map(r => r.Year))].filter(Boolean).sort();
    const states = [...new Set(allData.map(r => r.State))].filter(Boolean).sort();
    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];

    // Cities dependent on selected state
    let cities;
    if (filters.state) {
      cities = [...new Set(allData.filter(r => r.State === filters.state).map(r => r.City))].filter(Boolean).sort();
    } else {
      cities = [...new Set(allData.map(r => r.City))].filter(Boolean).sort();
    }

    const threatTypes = [...new Set(allData.map(r => r.Threat_Type))].filter(Boolean).sort();
    const attackMethods = [...new Set(allData.map(r => r.Attack_Method))].filter(Boolean).sort();
    const channels = [...new Set(allData.map(r => r.Channel))].filter(Boolean).sort();
    const statuses = [...new Set(allData.map(r => r.Incident_Status))].filter(Boolean).sort();
    const severities = ['Low', 'Medium', 'High', 'Critical'];
    const vulnerabilities = [...new Set(allData.map(r => r.Vulnerability))].filter(Boolean).sort();
    const securityControls = [...new Set(allData.map(r => r.Security_Control))].filter(Boolean).sort();
    const transactionTypes = [...new Set(allData.map(r => r.Transaction_Type))].filter(Boolean).sort();

    return {
      years,
      states,
      cities,
      riskLevels,
      threatTypes,
      attackMethods,
      channels,
      statuses,
      severities,
      vulnerabilities,
      securityControls,
      transactionTypes,
    };
  }, [allData, filters.state]);

  // Chart Data: Monthly Trend
  const trendData = useMemo(() => {
    const monthCounts = {};
    filteredRecords.forEach(r => {
      const ym = r.Date ? r.Date.slice(0, 7) : '';
      if (ym) {
        monthCounts[ym] = (monthCounts[ym] || 0) + 1;
      }
    });

    const allMonths = [...new Set(allData.map(r => (r.Date ? r.Date.slice(0, 7) : '')))]
      .filter(Boolean)
      .sort();

    return allMonths.map(m => ({
      month: m,
      count: monthCounts[m] || 0,
    }));
  }, [filteredRecords, allData]);

  // Chart Data: Risk Distribution
  const riskData = useMemo(() => {
    const dist = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    filteredRecords.forEach(r => {
      if (dist[r.Risk_Level] !== undefined) dist[r.Risk_Level]++;
    });
    const total = filteredRecords.length;
    return Object.entries(dist).map(([level, count]) => ({
      level,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    }));
  }, [filteredRecords]);

  // Chart Data: Top Threats or Attack Methods
  const getThreatData = useCallback((field = 'Threat_Type') => {
    const counts = {};
    filteredRecords.forEach(r => {
      const val = r[field] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [filteredRecords]);

  // Chart Data: State or Channel Exposure (Loss)
  const getLossData = useCallback((field = 'State') => {
    const sums = {};
    filteredRecords.forEach(r => {
      const val = r[field] || 'Unknown';
      sums[val] = (sums[val] || 0) + Number(r.Financial_Loss_INR || 0);
    });
    return Object.entries(sums)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, loss]) => ({ name, loss }));
  }, [filteredRecords]);

  // Actions
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'state') next.city = '';
      return next;
    });
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const next = { ...prev };
      if (key === 'dates') {
        next.startDate = '';
        next.endDate = '';
      } else if (key === 'riskScoreRange') {
        next.minRiskScore = '';
        next.maxRiskScore = '';
      } else {
        next[key] = '';
      }
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      year: '',
      state: '',
      city: '',
      riskLevel: '',
      threatType: '',
      attackMethod: '',
      channel: '',
      status: '',
      severity: '',
      vulnerability: '',
      securityControl: '',
      transactionType: '',
      minRiskScore: '',
      maxRiskScore: '',
      startDate: '',
      endDate: '',
      search: '',
      comparePeriod: false,
    });
  }, []);

  // Count active non-empty filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([k, v]) => {
      if (k === 'comparePeriod') return;
      if (v !== '' && v !== null && v !== undefined) count++;
    });
    return count;
  }, [filters]);

  // Upload handler
  const handleUploadSuccess = useCallback((newRecords, fileName) => {
    setAllData(newRecords);
    setIsCustomData(true);
    setCustomFileName(fileName);
    resetFilters();
  }, [resetFilters]);

  // Reset to default dataset
  const resetToDefaultData = useCallback(() => {
    setAllData(defaultIncidents);
    setIsCustomData(false);
    setCustomFileName('');
    resetFilters();
  }, [resetFilters]);

  // CSV Export
  const exportCSV = useCallback(() => {
    if (!filteredRecords.length) {
      alert('No incident records to export under current filters.');
      return;
    }
    const keys = Object.keys(filteredRecords[0]);
    const csvRows = [
      keys.join(','),
      ...filteredRecords.map(r =>
        keys.map(k => `"${String(r[k] !== undefined && r[k] !== null ? r[k] : '').replace(/"/g, '""')}"`).join(',')
      )
    ];
    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyber_risk_incidents_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [filteredRecords]);

  // PDF Export
  const exportPDF = useCallback(() => {
    if (!filteredRecords.length) {
      alert('No incident records to include in the PDF report.');
      return;
    }
    generateDashboardPDF({
      filteredRecords,
      filters,
      datasetSource: isCustomData ? `Custom Uploaded Data (${customFileName || 'Local'})` : 'Research Reference Dataset (5,000 records)',
    });
  }, [filteredRecords, filters, isCustomData, customFileName]);

  return {
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
  };
}
