const API_BASE = '/api';

export async function fetchStats(filters = {}) {
  const params = new URLSearchParams(cleanFilters(filters));
  const res = await fetch(`${API_BASE}/stats?${params}`);
  return res.json();
}

export async function fetchIncidents(filters = {}, page = 1, limit = 12, search = '') {
  const params = new URLSearchParams({ ...cleanFilters(filters), page, limit, search });
  const res = await fetch(`${API_BASE}/incidents?${params}`);
  return res.json();
}

export async function fetchIncidentById(id) {
  const res = await fetch(`${API_BASE}/incidents/${id}`);
  return res.json();
}

export async function fetchFilters(state = '') {
  const params = state ? new URLSearchParams({ state }) : '';
  const res = await fetch(`${API_BASE}/filters?${params}`);
  return res.json();
}

export async function fetchTrendData(filters = {}) {
  const params = new URLSearchParams(cleanFilters(filters));
  const res = await fetch(`${API_BASE}/charts/trend?${params}`);
  return res.json();
}

export async function fetchRiskData(filters = {}) {
  const params = new URLSearchParams(cleanFilters(filters));
  const res = await fetch(`${API_BASE}/charts/risk?${params}`);
  return res.json();
}

export async function fetchThreatData(filters = {}, groupBy = 'Threat_Type') {
  const params = new URLSearchParams({ ...cleanFilters(filters), groupBy });
  const res = await fetch(`${API_BASE}/charts/threats?${params}`);
  return res.json();
}

export async function fetchStateData(filters = {}, groupBy = 'State') {
  const params = new URLSearchParams({ ...cleanFilters(filters), groupBy });
  const res = await fetch(`${API_BASE}/charts/states?${params}`);
  return res.json();
}

export function getExportUrl(filters = {}, search = '') {
  const params = new URLSearchParams({ ...cleanFilters(filters), search });
  return `${API_BASE}/export?${params}`;
}

function cleanFilters(filters) {
  const clean = {};
  Object.entries(filters).forEach(([k, v]) => {
    if (v) clean[k] = v;
  });
  return clean;
}
