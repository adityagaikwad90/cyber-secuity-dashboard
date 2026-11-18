import React, { useState } from 'react';
import { ALL_COLUMNS } from '../utils/excelValidator.js';

export default function ResearchMethodology() {
  const [activeTab, setActiveTab] = useState('toe');

  const variableCodebook = [
    { name: 'Incident_ID', type: 'String', desc: 'Unique alphanumeric identifier assigned to each recorded cybersecurity incident (e.g. INC03588).' },
    { name: 'Date', type: 'Date (YYYY-MM-DD)', desc: 'Calendar date when the incident occurred or was first detected by security telemetry.' },
    { name: 'Year', type: 'Integer (2023-2026)', desc: 'Calendar year partition for annual macro trend analysis.' },
    { name: 'Month', type: 'String', desc: 'Full English month name (e.g. January, October).' },
    { name: 'Month_Number', type: 'Integer (1-12)', desc: 'Numeric index of calendar month for temporal sorting.' },
    { name: 'Threat_Type', type: 'Categorical (6 types)', desc: 'Macro threat categorization: Phishing, Ransomware, Payment Fraud, Malware, Identity Theft, Data Breach.' },
    { name: 'Attack_Method', type: 'Categorical (8 vectors)', desc: 'Technical vector: Man-in-the-Middle, Account Takeover, SIM Swap, Credential Theft, Ransomware Attack, SQL Injection, Malicious File, Fake Payment Request.' },
    { name: 'Channel', type: 'Categorical (6 channels)', desc: 'Banking touchpoint: UPI, Mobile Banking, Internet Banking, ATM, Credit Card, Debit Card.' },
    { name: 'Transaction_Type', type: 'Categorical (6 types)', desc: 'Type of financial or session event: Card Payment, Fund Transfer, UPI Payment, Bill Payment, Login, Cash Withdrawal.' },
    { name: 'Severity', type: 'Categorical (4 levels)', desc: 'Initial technical severity assessment: Low, Medium, High, Critical.' },
    { name: 'Vulnerability', type: 'Categorical (8 types)', desc: 'Underlying root security weakness exploited (e.g., Insecure API, Outdated Software, Lack of MFA, Unpatched System).' },
    { name: 'Risk_Score', type: 'Numeric (0-100)', desc: 'Continuous composite risk rating derived from exploitability, asset value, and blast radius.' },
    { name: 'Risk_Level', type: 'Categorical (4 tiers)', desc: 'Standardized risk classification: Low (0-39), Medium (40-59), High (60-79), Critical (80-100).' },
    { name: 'Security_Control', type: 'Categorical (7 controls)', desc: 'Primary defense mechanism involved: MFA, Encryption, Fraud Detection, Transaction Monitoring, Endpoint Protection, Password Policy, Email Filtering.' },
    { name: 'State', type: 'Categorical (10 states)', desc: 'Indian State jurisdiction where the branch, server, or customer session originated.' },
    { name: 'City', type: 'Categorical (30 cities)', desc: 'Municipal banking hub associated with the affected banking nodes.' },
    { name: 'Financial_Loss_INR', type: 'Numeric (Currency)', desc: 'Direct recorded financial damage in Indian Rupees (INR) from fraudulent withdrawals, ransoms, or illicit transfers.' },
    { name: 'Customers_Affected', type: 'Integer', desc: 'Number of individual account holders compromised, locked out, or financially impacted per incident.' },
    { name: 'Downtime_Hours', type: 'Float (Hours)', desc: 'Duration of service outage or channel disruption caused by the security incident.' },
    { name: 'Incident_Status', type: 'Categorical (4 states)', desc: 'Incident response lifecycle stage: Open, Investigating, Resolved, Closed.' },
    { name: 'Resolution_Time_Hours', type: 'Float (Hours)', desc: 'Mean Time to Resolution (MTTR) from initial detection to full operational restoration.' },
  ];

  const literatureStudies = [
    {
      authors: 'Tornatzky & Fleischer',
      year: 1990,
      title: 'The Processes of Technological Innovation',
      contribution: 'Origin of the Technology-Organization-Environment (TOE) framework; foundational theoretical model for enterprise cybersecurity technology adoption.'
    },
    {
      authors: 'Reserve Bank of India (RBI)',
      year: 2016,
      title: 'Cyber Security Framework in Banks (Circular DBS.CO/CSITE/BC.11/33.01.001/2015-16)',
      contribution: 'Regulatory baseline for SOC monitoring, baseline cybersecurity controls, incident reporting within 2 to 6 hours, and cyber crisis management plans.'
    },
    {
      authors: 'Reserve Bank of India (RBI)',
      year: 2021,
      title: 'Master Direction on Digital Payment Security Controls',
      contribution: 'Mandated robust authentication mechanisms, multi-factor authentication (MFA) on retail payments, real-time transaction monitoring, and secure API gateways.'
    },
    {
      authors: 'CERT-In / MeitY',
      year: 2023,
      title: 'India Cyber Threat Profile & Financial Infrastructure Telemetry',
      contribution: 'Detailed empirical trends on SIM swapping, APK malware, rogue payment QR codes, and targeted phishing against mobile banking consumers.'
    },
    {
      authors: 'Ponemon Institute & IBM Security',
      year: 2023,
      title: 'Cost of a Data Breach Report: Financial Services Sector',
      contribution: 'Quantified global and regional financial impacts, confirming financial services sustain the highest per-record breach costs and longest containment windows.'
    }
  ];

  return (
    <section className="panel prose-panel">
      <div className="prose-header">
        <span className="eyebrow">ACADEMIC FOUNDATION & METHODOLOGY</span>
        <h2>Cybersecurity Risk Modeling in Online Banking</h2>
        <p className="prose-subtitle">
          Theoretical architecture, empirical dataset specification, and the Technology-Organization-Environment (TOE) analytical model.
        </p>
      </div>

      {/* Tabs */}
      <div className="methodology-tabs">
        <button
          className={activeTab === 'toe' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('toe')}
        >
          1. The TOE Framework
        </button>
        <button
          className={activeTab === 'objectives' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('objectives')}
        >
          2. Research Objectives
        </button>
        <button
          className={activeTab === 'literature' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('literature')}
        >
          3. Literature Survey
        </button>
        <button
          className={activeTab === 'codebook' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('codebook')}
        >
          4. Variable Codebook (21 Fields)
        </button>
        <button
          className={activeTab === 'provenance' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('provenance')}
        >
          5. Data Provenance & Ethics
        </button>
      </div>

      <div className="tab-content-area">
        {/* Tab 1: TOE Framework */}
        {activeTab === 'toe' && (
          <div className="toe-section">
            <h3>The Technology-Organization-Environment (TOE) Framework</h3>
            <p>
              Originally formulated by Tornatzky and Fleischer (1990), the TOE framework posits that an enterprise’s
              cybersecurity posture, vulnerability surface, and risk outcomes are determined by the interplay of three
              interdependent contexts:
            </p>

            <div className="toe-grid">
              <div className="toe-card tech-card">
                <div className="toe-pill">T</div>
                <h4>Technological Context</h4>
                <p>
                  Encompasses the infrastructure, digital touchpoints, and technical vulnerabilities of the banking stack:
                </p>
                <ul>
                  <li><b>Vulnerability Surface:</b> Insecure APIs, Unpatched Systems, Weak Authentication, Lack of MFA.</li>
                  <li><b>Attack Modalities:</b> Credential Theft, Man-in-the-Middle, Account Takeover, SQL Injection, SIM Swap.</li>
                  <li><b>Touchpoint Architecture:</b> UPI payment gateways, Mobile Apps, Internet Banking portals, ATM networks.</li>
                  <li><b>Preventative Defenses:</b> Hardware MFA, End-to-end Encryption, Web Application Firewalls.</li>
                </ul>
              </div>

              <div className="toe-card org-card">
                <div className="toe-pill">O</div>
                <h4>Organizational Context</h4>
                <p>
                  Captures institutional capacity, operational resilience, and direct business consequences:
                </p>
                <ul>
                  <li><b>Financial Exposure:</b> Direct INR loss from unauthorized debit and fraudulent fund transfers.</li>
                  <li><b>Customer Impact:</b> Number of compromised retail and commercial accounts.</li>
                  <li><b>Operational Resilience:</b> System downtime hours and Mean Time to Resolution (MTTR).</li>
                  <li><b>Security Governance:</b> Active incident lifecycle management (Open, Investigating, Resolved, Closed).</li>
                </ul>
              </div>

              <div className="toe-card env-card">
                <div className="toe-pill">E</div>
                <h4>Environmental Context</h4>
                <p>
                  Reflects regulatory mandates, geographic threat concentration, and external market dynamics:
                </p>
                <ul>
                  <li><b>Regulatory Standards:</b> RBI Cyber Security Framework, Digital Payment Security Directives.</li>
                  <li><b>Geographic Distribution:</b> State banking jurisdictions across 10 major Indian commercial hubs.</li>
                  <li><b>Ecosystem Velocity:</b> Rapid retail migration to UPI and smartphone mobile payments.</li>
                  <li><b>Adversary Pressure:</b> Organized syndicate operations and social engineering campaigns.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Research Objectives */}
        {activeTab === 'objectives' && (
          <div className="objectives-section">
            <h3>Research Questions & Empirical Objectives</h3>
            <div className="objectives-list">
              <div className="objective-item">
                <span className="ro-badge">RO-1</span>
                <div>
                  <h4>Quantify Channel Vulnerability vs. Financial Exposure</h4>
                  <p>
                    Determine which banking delivery channels (UPI, Mobile Banking, Internet Banking, Credit/Debit Cards, ATM)
                    sustain the greatest financial loss per incident and identify the underlying attack mechanisms.
                  </p>
                </div>
              </div>

              <div className="objective-item">
                <span className="ro-badge">RO-2</span>
                <div>
                  <h4>Evaluate Control Efficacy on Operational MTTR</h4>
                  <p>
                    Measure how preventative controls (e.g. MFA, Encryption) versus detective controls (e.g. Transaction Monitoring,
                    Fraud Detection) correlate with system downtime duration and Mean Time to Resolution.
                  </p>
                </div>
              </div>

              <div className="objective-item">
                <span className="ro-badge">RO-3</span>
                <div>
                  <h4>Analyze Geographic Stratification across Indian Banking Jurisdictions</h4>
                  <p>
                    Map incident density, threat types, and customer exposure across key Indian states (Maharashtra, Delhi,
                    Tamil Nadu, Karnataka, Uttar Pradesh, Gujarat, West Bengal, Telangana, Rajasthan, Madhya Pradesh).
                  </p>
                </div>
              </div>

              <div className="objective-item">
                <span className="ro-badge">RO-4</span>
                <div>
                  <h4>Establish Multi-Factor Risk Stratification Indices</h4>
                  <p>
                    Validate the 0–100 composite Risk Score model against real-world severity ratings, downtime hours,
                    and financial loss distributions to enable automated risk prioritization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Literature Survey */}
        {activeTab === 'literature' && (
          <div className="literature-section">
            <h3>Synthesized Literature Survey</h3>
            <p>
              Key empirical and regulatory studies informing the research hypothesis and dataset design:
            </p>
            <div className="table-wrap">
              <table className="lit-table">
                <thead>
                  <tr>
                    <th>Authors / Authority</th>
                    <th>Year</th>
                    <th>Publication / Circular</th>
                    <th>Core Research Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {literatureStudies.map((lit, idx) => (
                    <tr key={idx}>
                      <td><b>{lit.authors}</b></td>
                      <td>{lit.year}</td>
                      <td><i>{lit.title}</i></td>
                      <td>{lit.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Variable Codebook */}
        {activeTab === 'codebook' && (
          <div className="codebook-section">
            <h3>Complete Dataset Variable Codebook (21 Variables)</h3>
            <p>
              Full data dictionary specifying data types, semantics, and analytical roles across all 5,000 incident records:
            </p>
            <div className="table-wrap">
              <table className="codebook-table">
                <thead>
                  <tr>
                    <th>Field Identifier</th>
                    <th>Data Type</th>
                    <th>Operational Definition & Semantics</th>
                  </tr>
                </thead>
                <tbody>
                  {variableCodebook.map((col) => (
                    <tr key={col.name}>
                      <td><code>{col.name}</code></td>
                      <td><span className="type-badge">{col.type}</span></td>
                      <td>{col.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Provenance & Ethics */}
        {activeTab === 'provenance' && (
          <div className="provenance-section">
            <h3>Data Provenance, Methodology & Ethical Governance</h3>
            <div className="alert-box">
              <h4>Static Research Snapshot Disclaimer</h4>
              <p>
                This dataset represents a curated research snapshot (derived from <code>cyber_security_risk_dataset.xlsx</code>,
                Incidents worksheet, referenced alongside <code>CYber-security project.pbix</code>).
                It is engineered for cybersecurity risk modeling, statistical analysis, and decision-support simulation.
                It does <b>not</b> constitute a live telemetry SOC stream or real-time banking monitoring feed.
              </p>
            </div>

            <h4>Ethical Anonymization & PII Protection</h4>
            <p>
              In strict accordance with data privacy standards and banking secrecy guidelines:
            </p>
            <ul>
              <li>All Customer Accounts are represented purely as aggregate counts; zero personally identifiable information (PII) is recorded.</li>
              <li>Incident IDs are pseudo-randomized identifiers (e.g. INC03588).</li>
              <li>Financial institutions are categorized under regional state and municipal banking clusters to prevent targeted institution stigmatization.</li>
            </ul>

            <h4>Client-Side Processing Guarantee</h4>
            <p>
              When uploading custom datasets via the Upload feature, all parsing, validation, and dashboard computations
              execute 100% locally within your client browser session. No proprietary incident records or private files
              are transmitted to external servers.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
