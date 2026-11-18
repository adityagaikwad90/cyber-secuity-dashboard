import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function TrendChart({ data, selectedYear, onSelectYear }) {
  const formatted = (data || []).map(d => ({
    ...d,
    label: d.month ? new Date(d.month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }) : '',
  }));

  const handleClick = (e) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const clickedData = e.activePayload[0].payload;
      if (clickedData && clickedData.month) {
        const clickedYear = clickedData.month.split('-')[0];
        onSelectYear(selectedYear === clickedYear ? '' : clickedYear);
      }
    }
  };

  return (
    <article className="panel trend-panel">
      <div className="panel-head">
        <div>
          <h2>Temporal Incident Trajectory</h2>
          <p>Monthly distribution (Click month/point to filter by year)</p>
        </div>
        <div className="chart-head-meta">
          {selectedYear && (
            <span className="filter-active-indicator">
              Filtered: {selectedYear}
            </span>
          )}
          <span className="legend"><i></i> Incidents</span>
        </div>
      </div>
      <div className="chart-canvas-wrap">
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart
            data={formatted}
            margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
              interval="preserveStartEnd"
              stroke="var(--border)"
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
              width={35}
              stroke="var(--border)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '11px',
                boxShadow: '0 8px 24px var(--shadow-color)',
              }}
              formatter={(val) => [val, 'Incidents']}
              labelFormatter={(label) => `${label} (Click to filter)`}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--chart-primary)"
              strokeWidth={2.5}
              fill="url(#trendGradient)"
              dot={{ r: 2.5, fill: 'var(--chart-primary)' }}
              activeDot={{ r: 5, fill: 'var(--accent)', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
