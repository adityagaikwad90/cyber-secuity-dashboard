import React, { useState, useMemo } from 'react';
import { formatNumber, formatMoney, RISK_COLORS, STATUS_COLORS } from '../utils/format.js';
import IncidentDetailModal from './IncidentDetailModal.jsx';

export default function IncidentExplorer({ records = [], onExportCSV }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('Date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Local search filter
  const searched = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const q = searchTerm.toLowerCase().trim();
    return records.filter((r) =>
      Object.values(r).some(
        (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q)
      )
    );
  }, [records, searchTerm]);

  // Sorting
  const sorted = useMemo(() => {
    return [...searched].sort((a, b) => {
      let vA = a[sortField];
      let vB = b[sortField];

      if (typeof vA === 'string') {
        const comp = vA.localeCompare(vB);
        return sortDir === 'asc' ? comp : -comp;
      }

      vA = Number(vA) || 0;
      vB = Number(vB) || 0;
      return sortDir === 'asc' ? vA - vB : vB - vA;
    });
  }, [searched, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  const sortIcon = (field) => {
    if (sortField !== field) return ' ⇅';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <section className="panel explorer-panel">
      <div className="panel-head explorer-header">
        <div>
          <h2>Incident Intelligence Table</h2>
          <p>Search, inspect, sort, and export granular incident records ({formatNumber(records.length)} total)</p>
        </div>
        <div className="explorer-actions">
          <input
            type="search"
            className="search-input"
            placeholder="Search all fields (ID, Threat, City, Vulnerability)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            aria-label="Search incidents"
          />
          <button type="button" className="secondary-btn export-csv-btn" onClick={onExportCSV}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="incident-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('Incident_ID')} className="sortable">
                Incident ID {sortIcon('Incident_ID')}
              </th>
              <th onClick={() => handleSort('Date')} className="sortable">
                Date {sortIcon('Date')}
              </th>
              <th onClick={() => handleSort('Threat_Type')} className="sortable">
                Threat Classification {sortIcon('Threat_Type')}
              </th>
              <th onClick={() => handleSort('Channel')} className="sortable">
                Channel {sortIcon('Channel')}
              </th>
              <th onClick={() => handleSort('State')} className="sortable">
                Location {sortIcon('State')}
              </th>
              <th onClick={() => handleSort('Risk_Score')} className="sortable">
                Risk Tier {sortIcon('Risk_Score')}
              </th>
              <th onClick={() => handleSort('Financial_Loss_INR')} className="sortable num-col">
                Loss (INR) {sortIcon('Financial_Loss_INR')}
              </th>
              <th onClick={() => handleSort('Customers_Affected')} className="sortable num-col">
                Customers {sortIcon('Customers_Affected')}
              </th>
              <th onClick={() => handleSort('Incident_Status')} className="sortable">
                Status {sortIcon('Incident_Status')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedRecords.length > 0 ? (
              pagedRecords.map((r) => (
                <tr key={r.Incident_ID} onClick={() => setSelectedIncident(r)} className="clickable-row">
                  <td>
                    <button
                      type="button"
                      className="id-link-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(r);
                      }}
                    >
                      {r.Incident_ID}
                    </button>
                  </td>
                  <td>{r.Date}</td>
                  <td>
                    <div className="threat-cell">
                      <span>{r.Threat_Type}</span>
                      <small className="cell-sub">{r.Attack_Method}</small>
                    </div>
                  </td>
                  <td>{r.Channel}</td>
                  <td>
                    <div className="location-cell">
                      <span>{r.City}</span>
                      <small className="cell-sub">{r.State}</small>
                    </div>
                  </td>
                  <td>
                    <span
                      className="pill-badge"
                      style={{
                        backgroundColor: `${RISK_COLORS[r.Risk_Level]}22`,
                        color: RISK_COLORS[r.Risk_Level],
                        borderColor: RISK_COLORS[r.Risk_Level],
                      }}
                    >
                      {r.Risk_Level} · {r.Risk_Score}
                    </span>
                  </td>
                  <td className="num-col">
                    <b>{formatMoney(r.Financial_Loss_INR)}</b>
                  </td>
                  <td className="num-col">{formatNumber(r.Customers_Affected)}</td>
                  <td>
                    <span
                      className="status-pill"
                      style={{
                        color: STATUS_COLORS[r.Incident_Status] || '#888',
                      }}
                    >
                      ● {r.Incident_Status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="inspect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(r);
                      }}
                    >
                      Inspect ↗
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="table-empty">
                  No matching incidents found. Try adjusting your search query or active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="pagination-bar">
        <div className="pagination-info">
          Showing <b>{formatNumber(pagedRecords.length)}</b> of <b>{formatNumber(sorted.length)}</b> records
          {sorted.length !== records.length && ` (filtered from ${formatNumber(records.length)})`}
        </div>

        <div className="pagination-controls">
          <label className="page-size-selector">
            Rows per page:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>

          <span className="page-counter">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="pager-btn"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <button
            type="button"
            className="pager-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </section>
  );
}
