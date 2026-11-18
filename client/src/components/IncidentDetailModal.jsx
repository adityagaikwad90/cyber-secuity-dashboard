import React from 'react';
import { formatNumber, formatMoney, RISK_COLORS, STATUS_COLORS } from '../utils/format.js';

export default function IncidentDetailModal({ incident, onClose }) {
  if (!incident) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="incident-detail-title"
      >
        <div className="modal-header">
          <div className="detail-header-left">
            <span className="eyebrow">INCIDENT RECORD INSPECTOR</span>
            <h2 id="incident-detail-title">
              {incident.Incident_ID}
              <span className="detail-date">{incident.Date}</span>
            </h2>
          </div>
          <div className="detail-header-badges">
            <span
              className="pill-badge risk-badge"
              style={{
                backgroundColor: `${RISK_COLORS[incident.Risk_Level]}22`,
                color: RISK_COLORS[incident.Risk_Level],
                borderColor: RISK_COLORS[incident.Risk_Level],
              }}
            >
              Risk: {incident.Risk_Level} ({incident.Risk_Score}/100)
            </span>
            <span
              className="pill-badge status-badge"
              style={{
                backgroundColor: `${STATUS_COLORS[incident.Incident_Status] || '#888'}22`,
                color: STATUS_COLORS[incident.Incident_Status] || '#888',
                borderColor: STATUS_COLORS[incident.Incident_Status] || '#888',
              }}
            >
              {incident.Incident_Status}
            </span>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body detail-sections">
          {/* Section 1: Financial & Customer Impact */}
          <div className="detail-card impact-card">
            <div className="detail-card-title">Direct Impact & Exposure</div>
            <div className="impact-stats-grid">
              <div>
                <span className="impact-label">Financial Loss</span>
                <span className="impact-value highlight-loss">
                  {formatMoney(incident.Financial_Loss_INR)}
                </span>
                <small className="impact-sub">₹{formatNumber(incident.Financial_Loss_INR)}</small>
              </div>
              <div>
                <span className="impact-label">Customers Affected</span>
                <span className="impact-value">
                  {formatNumber(incident.Customers_Affected)}
                </span>
                <small className="impact-sub">Compromised user accounts</small>
              </div>
              <div>
                <span className="impact-label">Operational Downtime</span>
                <span className="impact-value">
                  {incident.Downtime_Hours} hrs
                </span>
                <small className="impact-sub">Banking service disruption</small>
              </div>
              <div>
                <span className="impact-label">Resolution Time</span>
                <span className="impact-value">
                  {incident.Resolution_Time_Hours} hrs
                </span>
                <small className="impact-sub">Total containment duration</small>
              </div>
            </div>
          </div>

          {/* Section 2: Threat & Vector Details */}
          <div className="detail-card">
            <div className="detail-card-title">Threat & Vulnerability Profile</div>
            <dl className="detail-dl">
              <div>
                <dt>Threat Classification</dt>
                <dd><b>{incident.Threat_Type}</b></dd>
              </div>
              <div>
                <dt>Attack Vector / Method</dt>
                <dd>{incident.Attack_Method}</dd>
              </div>
              <div>
                <dt>Exploited Vulnerability</dt>
                <dd><span className="vuln-tag">{incident.Vulnerability}</span></dd>
              </div>
              <div>
                <dt>Technical Severity</dt>
                <dd><span className={`severity-pill ${incident.Severity}`}>{incident.Severity}</span></dd>
              </div>
            </dl>
          </div>

          {/* Section 3: Banking Touchpoint & Location */}
          <div className="detail-card">
            <div className="detail-card-title">Banking Infrastructure & Location</div>
            <dl className="detail-dl">
              <div>
                <dt>Banking Channel</dt>
                <dd><b>{incident.Channel}</b></dd>
              </div>
              <div>
                <dt>Transaction Type</dt>
                <dd>{incident.Transaction_Type}</dd>
              </div>
              <div>
                <dt>State Jurisdiction</dt>
                <dd>{incident.State}</dd>
              </div>
              <div>
                <dt>City / Hub</dt>
                <dd>{incident.City}</dd>
              </div>
            </dl>
          </div>

          {/* Section 4: Security Posture */}
          <div className="detail-card">
            <div className="detail-card-title">Security Governance & Controls</div>
            <dl className="detail-dl">
              <div>
                <dt>Applied Security Control</dt>
                <dd><span className="control-tag">{incident.Security_Control}</span></dd>
              </div>
              <div>
                <dt>Reporting Period</dt>
                <dd>{incident.Month} {incident.Year}</dd>
              </div>
              <div>
                <dt>Lifecycle State</dt>
                <dd>{incident.Incident_Status}</dd>
              </div>
              <div>
                <dt>Composite Risk Score</dt>
                <dd><b>{incident.Risk_Score} / 100</b> ({incident.Risk_Level})</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              navigator.clipboard?.writeText(JSON.stringify(incident, null, 2));
              alert('Incident record copied as JSON');
            }}
          >
            Copy Record JSON
          </button>
          <button type="button" className="primary-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
