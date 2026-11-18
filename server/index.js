import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Load dataset once at startup
let incidents = [];

async function loadData() {
  const raw = await readFile(path.join(__dirname, '..', 'data', 'incidents.json'), 'utf-8');
  incidents = JSON.parse(raw);
  console.log(`✓ Loaded ${incidents.length} incident records`);
}

// ─── API Routes ──────────────────────────────────────────

// GET /api/incidents — returns filtered & paginated incidents
app.get('/api/incidents', (req, res) => {
  const { year, state, city, riskLevel, search, page = 1, limit = 20 } = req.query;

  let result = incidents;

  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);
  if (riskLevel) result = result.filter(r => r.Risk_Level === riskLevel);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }

  const total = result.length;
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(100, Math.max(1, parseInt(limit)));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = result.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  res.json({
    data: paginated,
    pagination: { page: pageNum, limit: pageSize, total, totalPages }
  });
});

// GET /api/incidents/:id — single incident detail
app.get('/api/incidents/:id', (req, res) => {
  const incident = incidents.find(r => r.Incident_ID === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  res.json(incident);
});

// GET /api/stats — aggregated KPIs for current filters
app.get('/api/stats', (req, res) => {
  const { year, state, city, riskLevel } = req.query;

  let result = incidents;
  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);
  if (riskLevel) result = result.filter(r => r.Risk_Level === riskLevel);

  const total = result.length;
  const financialLoss = result.reduce((s, r) => s + Number(r.Financial_Loss_INR || 0), 0);
  const customersAffected = result.reduce((s, r) => s + Number(r.Customers_Affected || 0), 0);
  const avgRisk = total ? result.reduce((s, r) => s + Number(r.Risk_Score || 0), 0) / total : 0;

  res.json({ total, financialLoss, customersAffected, avgRisk: Number(avgRisk.toFixed(1)) });
});

// GET /api/filters — available filter options
app.get('/api/filters', (req, res) => {
  const { state } = req.query;

  const years = [...new Set(incidents.map(r => r.Year))].sort();
  const states = [...new Set(incidents.map(r => r.State))].sort();
  const riskLevels = ['Low', 'Medium', 'High', 'Critical'];

  let cities;
  if (state) {
    cities = [...new Set(incidents.filter(r => r.State === state).map(r => r.City))].sort();
  } else {
    cities = [...new Set(incidents.map(r => r.City))].sort();
  }

  res.json({ years, states, cities, riskLevels });
});

// GET /api/charts/trend — monthly incident counts
app.get('/api/charts/trend', (req, res) => {
  const { year, state, city, riskLevel } = req.query;

  let result = incidents;
  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);
  if (riskLevel) result = result.filter(r => r.Risk_Level === riskLevel);

  const byMonth = {};
  result.forEach(r => {
    const key = r.Date.slice(0, 7); // "YYYY-MM"
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  const months = [...new Set(incidents.map(r => r.Date.slice(0, 7)))].sort();
  const data = months.map(m => ({ month: m, count: byMonth[m] || 0 }));

  res.json(data);
});

// GET /api/charts/risk — risk level distribution
app.get('/api/charts/risk', (req, res) => {
  const { year, state, city } = req.query;

  let result = incidents;
  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);

  const dist = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  result.forEach(r => { if (dist[r.Risk_Level] !== undefined) dist[r.Risk_Level]++; });

  const total = result.length;
  res.json(Object.entries(dist).map(([level, count]) => ({
    level,
    count,
    percentage: total ? Math.round(count / total * 100) : 0
  })));
});

// GET /api/charts/threats — top threat types or attack methods
app.get('/api/charts/threats', (req, res) => {
  const { year, state, city, riskLevel, groupBy = 'Threat_Type' } = req.query;

  let result = incidents;
  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);
  if (riskLevel) result = result.filter(r => r.Risk_Level === riskLevel);

  const field = groupBy === 'Attack_Method' ? 'Attack_Method' : 'Threat_Type';
  const counts = {};
  result.forEach(r => { counts[r[field]] = (counts[r[field]] || 0) + 1; });

  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  res.json(data);
});

// GET /api/charts/states — financial exposure by state or channel
app.get('/api/charts/states', (req, res) => {
  const { year, state, city, riskLevel, groupBy = 'State' } = req.query;

  let result = incidents;
  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);
  if (riskLevel) result = result.filter(r => r.Risk_Level === riskLevel);

  const field = groupBy === 'Channel' ? 'Channel' : 'State';
  const sums = {};
  result.forEach(r => { sums[r[field]] = (sums[r[field]] || 0) + Number(r.Financial_Loss_INR || 0); });

  const data = Object.entries(sums)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, loss]) => ({ name, loss }));

  res.json(data);
});

// GET /api/export — full filtered CSV download
app.get('/api/export', (req, res) => {
  const { year, state, city, riskLevel, search } = req.query;

  let result = incidents;
  if (year) result = result.filter(r => String(r.Year) === year);
  if (state) result = result.filter(r => r.State === state);
  if (city) result = result.filter(r => r.City === city);
  if (riskLevel) result = result.filter(r => r.Risk_Level === riskLevel);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }

  if (!result.length) return res.status(404).json({ error: 'No data to export' });

  const keys = Object.keys(incidents[0]);
  const csv = [keys.join(','), ...result.map(r =>
    keys.map(k => `"${String(r[k]).replace(/"/g, '""')}"`).join(',')
  )].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=cyber-risk-incidents.csv');
  res.send(csv);
});

// ─── Serve React build in production ─────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// ─── Start ───────────────────────────────────────────────
loadData().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Cyber Risk Observatory API running at http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}).catch(err => {
  console.error('Failed to load data:', err);
  process.exit(1);
});
