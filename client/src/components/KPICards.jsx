import React from 'react';
import { formatNumber, formatMoney, formatPercent } from '../utils/format.js';

export default function KPICards({ stats, periodComparison }) {
  const getDeltaBadge = (deltaKey, invertGood = false) => {
    if (!periodComparison || !periodComparison.deltas) return null;
    const delta = periodComparison.deltas[deltaKey];
    if (delta === undefined || delta === null) return null;

    // For incidents/loss/downtime/risk, an increase is usually negative (danger/red), decrease is positive (success/green)
    const isIncrease = delta > 0;
    const isZero = delta === 0;
    const isPositiveOutcome = invertGood ? isIncrease : !isIncrease;

    let badgeClass = 'delta-neutral';
    if (!isZero) {
      badgeClass = isPositiveOutcome ? 'delta-good' : 'delta-bad';
    }

    return (
      <span className={`kpi-delta ${badgeClass}`} title={`vs. prior period (${periodComparison.priorPeriodLabel})`}>
        {isIncrease ? '▲ ' : delta < 0 ? '▼ ' : '— '}
        {formatPercent(delta)}
        <small> vs prior</small>
      </span>
    );
  };

  const cards = [
    {
      id: 'incidents',
      label: 'Total Incidents',
      value: formatNumber(stats.total),
      note: 'Filtered incident volume',
      icon: '◈',
      deltaKey: 'total',
    },
    {
      id: 'loss',
      label: 'Financial Exposure',
      value: formatMoney(stats.financialLoss),
      note: 'Total recorded monetary loss',
      icon: '↗',
      deltaKey: 'financialLoss',
    },
    {
      id: 'customers',
      label: 'Customers Affected',
      value: formatNumber(stats.customersAffected),
      note: 'Impacted user accounts',
      icon: '♧',
      deltaKey: 'customersAffected',
    },
    {
      id: 'risk',
      label: 'Average Risk Score',
      value: stats.total ? `${stats.avgRisk} / 100` : '—',
      note: 'Composite severity index',
      icon: '◎',
      deltaKey: 'avgRisk',
    },
    {
      id: 'mttr',
      label: 'Mean Time to Resolution',
      value: stats.total ? `${stats.avgResolutionTime} hrs` : '—',
      note: 'Average containment duration',
      icon: '⏱',
      deltaKey: 'avgResolutionTime',
    },
    {
      id: 'downtime',
      label: 'Average Downtime',
      value: stats.total ? `${stats.avgDowntime} hrs` : '—',
      note: 'Banking service interruption',
      icon: '◷',
      deltaKey: 'avgDowntime',
    },
  ];

  return (
    <div className="kpis-extended">
      {cards.map((c) => (
        <article className="kpi" key={c.id}>
          <div className="kpi-header">
            <span className="kpi-label">{c.label}</span>
            <span className="kpi-symbol">{c.icon}</span>
          </div>
          <div className="kpi-value">{c.value}</div>
          <div className="kpi-footer">
            {getDeltaBadge(c.deltaKey)}
            <span className="kpi-note">{c.note}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
