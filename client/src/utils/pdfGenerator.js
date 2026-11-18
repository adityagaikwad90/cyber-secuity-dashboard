import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatNumber, formatMoney } from './format.js';
import { computeStats } from './analytics.js';

export function generateDashboardPDF({
  filteredRecords,
  filters,
  datasetSource = 'Research Reference Dataset'
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const stats = computeStats(filteredRecords);
  const nowStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Colors
  const emeraldPrimary = [20, 44, 41];
  const emeraldAccent = [28, 113, 96];
  const textDark = [30, 40, 38];
  const mutedText = [120, 136, 133];

  // Header Banner
  doc.setFillColor(...emeraldPrimary);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CYBER RISK OBSERVATORY', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 225, 215);
  doc.text('Executive Cybersecurity Incident & Exposure Report · Online Banking India', 14, 18);
  doc.text(`Generated: ${nowStr} | Dataset: ${datasetSource}`, 14, 23);

  let currentY = 36;

  // Active Filters Box
  doc.setFillColor(245, 247, 245);
  doc.setDrawColor(230, 235, 232);
  doc.roundedRect(14, currentY, 182, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...emeraldAccent);
  doc.text('APPLIED FILTER SCOPE:', 18, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.setFontSize(8);
  
  const filterParts = [];
  if (filters.year) filterParts.push(`Year: ${filters.year}`);
  if (filters.state) filterParts.push(`State: ${filters.state}`);
  if (filters.city) filterParts.push(`City: ${filters.city}`);
  if (filters.riskLevel) filterParts.push(`Risk Level: ${filters.riskLevel}`);
  if (filters.threatType) filterParts.push(`Threat: ${filters.threatType}`);
  if (filters.channel) filterParts.push(`Channel: ${filters.channel}`);
  if (filters.status) filterParts.push(`Status: ${filters.status}`);
  if (filters.startDate && filters.endDate) {
    filterParts.push(`Date: ${filters.startDate} to ${filters.endDate}`);
  }
  if (filters.search) filterParts.push(`Search: "${filters.search}"`);

  const filterString = filterParts.length > 0 ? filterParts.join('  |  ') : 'All Incidents (No restrictive filters)';
  doc.text(filterString, 18, currentY + 12, { maxWidth: 174 });

  currentY += 25;

  // Key Metrics Grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...emeraldPrimary);
  doc.text('Executive Key Performance Indicators', 14, currentY);
  currentY += 4;

  const kpis = [
    { label: 'Total Incidents', value: formatNumber(stats.total) },
    { label: 'Total Financial Loss', value: formatMoney(stats.financialLoss) },
    { label: 'Customers Affected', value: formatNumber(stats.customersAffected) },
    { label: 'Average Risk Score', value: stats.total ? `${stats.avgRisk} / 100` : 'N/A' },
  ];

  const colWidth = 43;
  kpis.forEach((kpi, idx) => {
    const xPos = 14 + idx * (colWidth + 3.3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 230, 225);
    doc.roundedRect(xPos, currentY, colWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.text(kpi.label, xPos + 4, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...emeraldPrimary);
    doc.text(kpi.value, xPos + 4, currentY + 13);
  });

  currentY += 26;

  // Threat Breakdown Table
  const threatCounts = {};
  const threatLoss = {};
  filteredRecords.forEach(r => {
    threatCounts[r.Threat_Type] = (threatCounts[r.Threat_Type] || 0) + 1;
    threatLoss[r.Threat_Type] = (threatLoss[r.Threat_Type] || 0) + Number(r.Financial_Loss_INR || 0);
  });

  const threatRows = Object.entries(threatCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([threat, count]) => {
      const loss = threatLoss[threat] || 0;
      const share = stats.total ? ((count / stats.total) * 100).toFixed(1) + '%' : '0%';
      return [threat, formatNumber(count), share, formatMoney(loss)];
    });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...emeraldPrimary);
  doc.text('Threat Landscape Distribution', 14, currentY);
  currentY += 2;

  autoTable(doc, {
    startY: currentY,
    head: [['Threat Classification', 'Incident Count', 'Volume Share', 'Recorded Loss (INR)']],
    body: threatRows,
    theme: 'grid',
    headStyles: {
      fillColor: emeraldPrimary,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: textDark,
    },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // Sample Critical Incidents Table (Top 10 by loss or highest risk)
  const topCritical = [...filteredRecords]
    .sort((a, b) => Number(b.Financial_Loss_INR || 0) - Number(a.Financial_Loss_INR || 0))
    .slice(0, 10)
    .map(r => [
      r.Incident_ID,
      r.Date,
      r.Threat_Type,
      r.Channel,
      `${r.City}, ${r.State}`,
      `${r.Risk_Level} (${r.Risk_Score})`,
      formatMoney(r.Financial_Loss_INR),
      r.Incident_Status
    ]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...emeraldPrimary);
  doc.text('Highest Financial Exposure Incidents (Top 10 Sample)', 14, currentY);
  currentY += 2;

  autoTable(doc, {
    startY: currentY,
    head: [['ID', 'Date', 'Threat', 'Channel', 'Location', 'Risk', 'Loss (INR)', 'Status']],
    body: topCritical,
    theme: 'striped',
    headStyles: {
      fillColor: emeraldAccent,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: textDark,
    },
    columnStyles: {
      6: { halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer Disclaimer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...mutedText);
  doc.text(
    'Notice: Research Snapshot for analytical modeling and cybersecurity risk visualization. Not a real-time SOC stream.',
    14,
    pageHeight - 8
  );
  doc.text(`Page 1 of 1 · Cyber Risk Observatory`, 175, pageHeight - 8);

  doc.save(`cyber_risk_report_${new Date().toISOString().split('T')[0]}.pdf`);
}
