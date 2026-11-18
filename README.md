# Cyber Risk Observatory — Interactive Analytics Dashboard

A modern, production-grade cybersecurity incident observatory and risk analytics dashboard for online banking in India.

Built with **React 18**, **Vite**, **Recharts**, **Node.js/Express**, and **SheetJS (XLSX)**.

---

## 🚀 Key Features

1. **Cross-Filtering Clickable Charts**
   - Click any slice on the Risk Stratification donut to filter by risk tier (*Low*, *Medium*, *High*, *Critical*).
   - Click bars on Threat Landscape, Banking Channels, Attack Vectors, or State Exposure to instantly isolate records.
   - Click months on the Temporal Incident Trajectory area chart to filter by year.
   - Active filter tags bar at the top displays all applied criteria with one-click individual dismissal (`✕`) and "Clear all".

2. **Interactive India Geospatial Map**
   - Vector choropleth map of India highlighting the 10 commercial banking jurisdictions represented in the research dataset (*Maharashtra, Delhi, Tamil Nadu, Karnataka, Uttar Pradesh, Gujarat, West Bengal, Telangana, Rajasthan, Madhya Pradesh*).
   - Dynamic metric toggle: **Incident Volume** vs. **Financial Exposure (INR)** with proportional intensity shading.
   - Hover tooltips showing state incident count, total recorded loss, customer accounts compromised, mean risk score, and top threat vector.
   - Click any state on the map or ranking leaderboard to cross-filter the entire observatory.

3. **Date-Range Presets & Period Comparisons**
   - Quick date presets: *All Time*, *2023*, *2024*, *2025*, *2026*, *Last 12 Months*.
   - Precise HTML5 date-range pickers (`startDate` & `endDate`).
   - **Period Comparison Mode**: Compares the active window against an immediately preceding period of equal duration.
   - Computes and displays dynamic percentage change badges (`+14.2% ▲` / `-8.1% ▼`) across all 6 core KPIs with contextual positive/negative sentiment coloring.

4. **Multi-Factor Advanced Filters**
   - Dedicated filter modal for granular drill-downs:
     - Threat Classification (6 categories)
     - Attack Vector / Method (8 modalities)
     - Banking Touchpoint / Channel (UPI, Mobile, Internet Banking, ATM, Cards)
     - Investigation Lifecycle Status (*Closed, Resolved, Open, Investigating*)
     - Technical Severity (*Low, Medium, High, Critical*)
     - Root Vulnerability (*Insecure API, Outdated Software, Lack of MFA, etc.*)
     - Security Controls (*MFA, Encryption, Fraud Detection, etc.*)
     - Transaction Types (*UPI, Fund Transfer, Bill Payment, Card Payment, Cash Withdrawal, Login*)
     - Continuous Risk Score Interval filter (0–100 range).

5. **Dynamic Automated Pattern Insights**
   - 6 statistical pattern cards computed on-the-fly from the filtered records:
     - **Dominant Vulnerability**: Most frequent root-cause weakness and share of financial losses.
     - **Customer Exposure Channel**: Banking channel with peak account compromise.
     - **Operational Resilience**: Mean Time to Resolution (MTTR) and % of events resolved within 24 hours.
     - **Security Governance**: Containment rate (% closed/resolved) and active open investigations.
     - **Attack Modality**: Primary threat and attack pair.
     - **Financial Severity**: Mean monetary loss per incident and critical risk share.

6. **Incident Intelligence Table Explorer**
   - Comprehensive table displaying all incident records with multi-column sorting (ID, Date, Threat, Channel, Location, Risk Tier, Loss, Customers, Status).
   - Global real-time fuzzy text search.
   - Pagination with selectable page sizes (10, 25, 50, 100).
   - **Incident Record Inspector Modal**: Click any incident row or ID to inspect all 21 fields, complete with financial breakdowns, technical severity, operational downtime, and a "Copy Record JSON" action.

7. **Theme Engine & Accessibility**
   - Full **Dark Theme** (cyber NOC / SOC dark emerald aesthetic) and **Light Theme** (clean executive dashboard).
   - Theme toggle button in header and sidebar with `localStorage` persistence.
   - Meets WCAG AA contrast standards with custom semantic CSS custom properties.
   - Fully responsive layout optimized for mobile screens, tablets, and wide monitors.

8. **Executive PDF Report & CSV Export**
   - **Export Executive PDF**: Generates an executive 1-page summary report with active filter scope, KPI grid, threat distribution table, and top 10 critical incidents table using client-side `jsPDF` and `jspdf-autotable`.
   - **Export CSV**: Client-side RFC 4180 compliant CSV export with UTF-8 BOM encoding for seamless opening in Excel.

9. **Client-Side Excel Dataset Ingestion**
   - Drag-and-drop or file upload for `.xlsx`, `.xls`, `.csv`, or `.json` datasets.
   - Automated schema validation verifying required columns (`Incident_ID`, `Date`, `Threat_Type`, `Risk_Score`, `Financial_Loss_INR`, `State`).
   - Actionable error feedback when columns are missing or malformed.
   - **Download Sample Excel Template** button.
   - **Reset to Default Reference Dataset** action to return to the 5,000 baseline research records.
   - 100% private: Parsing occurs strictly in browser memory.

10. **Research & Methodology (TOE Framework)**
    - Dedicated tabbed research section detailing:
      - **TOE Model**: Interactive cards detailing Technological, Organizational, and Environmental contexts.
      - **Research Objectives**: RO-1 through RO-4 aligned with Power BI project specifications.
      - **Literature Survey**: Citations for Tornatzky & Fleischer (1990), RBI Cyber Security Framework (2016/2021), CERT-In, and Ponemon/IBM studies.
      - **Variable Codebook**: Comprehensive dictionary of all 21 variables, data types, units, and descriptions.
      - **Data Provenance & Ethics**: Clear distinction between research snapshot modeling and live monitoring feeds.

---

## 📁 Project Architecture

```
cyber-risk-website/
├── client/                          # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/              # Modular UI Components
│   │   │   ├── Sidebar.jsx          # Collapsible navigation, theme & dataset controls
│   │   │   ├── Header.jsx           # Global header with PDF/CSV export actions
│   │   │   ├── FilterBar.jsx        # Date presets, pickers, comparison & quick dropdowns
│   │   │   ├── AdvancedFilterModal.jsx # Multi-factor drill-down modal
│   │   │   ├── KPICards.jsx         # Executive metrics with period delta badges
│   │   │   ├── InsightCards.jsx     # 6 dynamic intelligence pattern cards
│   │   │   ├── IndiaMap.jsx         # Interactive SVG India choropleth & state ranking
│   │   │   ├── TrendChart.jsx       # Recharts area trend with click-to-filter
│   │   │   ├── RiskDonut.jsx        # Recharts donut with click-to-filter
│   │   │   ├── BarChart.jsx         # Recharts / CSS horizontal bars with click-to-filter
│   │   │   ├── IncidentExplorer.jsx # Sortable, paginated search table
│   │   │   ├── IncidentDetailModal.jsx # 21-field granular incident inspector
│   │   │   ├── UploadModal.jsx      # Excel/CSV upload, validation & template download
│   │   │   └── ResearchMethodology.jsx # TOE framework, codebook & literature review
│   │   ├── hooks/
│   │   │   ├── useDashboard.js      # Unified data, filtering & export state management
│   │   │   └── useTheme.js          # Dark/Light theme state with localStorage persistence
│   │   ├── utils/
│   │   │   ├── analytics.js         # Statistical engine, period deltas & insight derivation
│   │   │   ├── excelValidator.js    # SheetJS XLSX parser, schema validator & sample template
│   │   │   ├── format.js            # Indian numbering (Lakhs/Crores), currency & color maps
│   │   │   └── pdfGenerator.js      # jsPDF & autoTable executive report generator
│   │   ├── styles/
│   │   │   └── index.css            # Unified CSS custom properties, themes & responsive design
│   │   ├── data/
│   │   │   └── incidents.json       # 5,000 incident research records
│   │   ├── App.jsx                  # Main view coordinator
│   │   └── main.jsx                 # React root entry point
│   ├── index.html                   # HTML5 shell with Google Fonts
│   ├── vite.config.js               # Vite config with API proxy
│   └── package.json                 # Frontend dependencies (React, Recharts, XLSX, jsPDF)
├── server/
│   └── index.js                     # Optional Express REST API server
├── data/
│   └── incidents.json               # Canonical 5,000 incident dataset
├── dist/                            # Production build bundle for static deployment
├── cyber-risk-observatory.zip       # Standalone downloadable archive
├── package.json                     # Root orchestrator scripts
└── README.md                        # Documentation
```

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js** v18+ (tested on v22)
- **npm** v9+ (tested on v11)
- *No Python or external database required.*

### Option A: Run Full Stack (Vite Frontend + Express Backend)

1. Open your terminal in this directory:
   ```bash
   cd cyber-risk-website
   ```

2. Install all dependencies for both root and client:
   ```bash
   npm run install:all
   ```

3. Launch development servers:
   ```bash
   npm run dev
   ```

4. Open your browser:
   - **Frontend (Vite App):** [http://localhost:3000](http://localhost:3000)
   - **Backend (Express API):** [http://localhost:5001](http://localhost:5001)

---

### Option B: Run Static Production Build (No Backend Needed)

Because the entire analytics engine, Excel parser, and PDF generator operate 100% client-side, you can also run the pre-built `dist/` directory directly with any static file server:

```bash
# Using npx serve:
npx serve dist -l 8000

# Or using Python (if preferred on legacy environments):
python3 -m http.server 8000 --directory dist
```

Then visit [http://localhost:8000](http://localhost:8000).

---

## 📦 Downloadable Project ZIP

A complete, self-contained ZIP archive is generated in the root directory:
- **File:** [cyber-risk-observatory.zip](file:///Users/adityagaikwad/Downloads/cyber-risk-website/cyber-risk-observatory.zip) (approx. 2.1 MB)
- Contains all source code, pre-built production assets, and data files ready to be extracted on any computer.

---

## 🛡 Dataset & Research Provenance

- **Source Reference:** `cyber_security_risk_dataset.xlsx` (Incidents worksheet) & `CYber-security project.pbix`.
- **Dataset Size:** 5,000 incidents spanning January 2023 through March 2026.
- **Coverage:** 10 Indian states, 30 municipal banking centers, 6 banking channels, 6 macro threat types, 8 attack methods, and 8 root vulnerabilities.
- **Methodological Role:** Curated research and modeling dataset designed for simulated risk observatory evaluation; not a live SOC telemetry stream.
