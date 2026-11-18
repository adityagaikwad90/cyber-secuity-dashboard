import React from 'react';
import { computeDynamicInsights } from '../utils/analytics.js';

export default function InsightCards({ records }) {
  const insights = computeDynamicInsights(records);

  return (
    <section className="insight-section">
      <div className="section-title-row">
        <div>
          <span className="eyebrow">DYNAMIC RISK INTELLIGENCE</span>
          <h2 className="section-title">Automated Pattern Insights</h2>
        </div>
        <span className="insight-badge">Calculated from {records.length.toLocaleString('en-IN')} active records</span>
      </div>

      <div className="insight-grid">
        {insights.map((item) => (
          <article key={item.id} className={`insight-card sentiment-${item.sentiment}`}>
            <div className="insight-top">
              <span className="insight-tag">{item.tag}</span>
              <span className={`sentiment-dot ${item.sentiment}`} />
            </div>
            <h3 className="insight-title">{item.title}</h3>
            <div className="insight-highlight">{item.highlight}</div>
            <p className="insight-desc">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
