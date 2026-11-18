import React from 'react';

export default function AboutSection() {
  return (
    <section className="panel prose">
      <div className="eyebrow">THE RESEARCH</div>
      <h2>Cybersecurity in online banking</h2>
      <p>
        This interactive website brings the supplied cybersecurity risk dataset to the web,
        drawing on the Summary, Overview, and Details pages in the accompanying Power BI report.
      </p>

      <h3>Dataset coverage</h3>
      <p>
        5,000 incident records with 21 fields, including threat type, attack method, banking channel,
        state, city, risk score, financial loss, customers affected, downtime, and resolution time.
        Use the filters to investigate patterns across the supplied records.
      </p>

      <h3>How to read the dashboard</h3>
      <p>
        Financial loss and customers affected are summed across selected incidents. Average risk is
        the arithmetic mean of the supplied Risk_Score. Risk groups use the original Risk_Level values.
        Customer counts represent incident-level totals and may include repeat customers.
      </p>

      <h3>Source and interpretation</h3>
      <p>
        Source: cyber_security_risk_dataset.xlsx, Incidents worksheet. Visual references:
        CYber-security project.pbix and supplied dashboard screenshots. This is a static snapshot
        of the uploaded research dataset, not a live security monitoring service. Its real-world
        provenance has not been verified.
      </p>
    </section>
  );
}
