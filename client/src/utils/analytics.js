/**
 * Cyber Risk Observatory - Analytics & Statistical Engine
 * Computes KPIs, period deltas, chart groupings, and dynamic insights
 * from the actual incident dataset.
 */

export function filterIncidents(data, filters) {
  if (!data || !Array.isArray(data)) return [];

  return data.filter(r => {
    // Basic dropdown filters
    if (filters.year && String(r.Year) !== String(filters.year)) return false;
    if (filters.state && r.State !== filters.state) return false;
    if (filters.city && r.City !== filters.city) return false;
    if (filters.riskLevel && r.Risk_Level !== filters.riskLevel) return false;

    // Advanced filters
    if (filters.threatType && r.Threat_Type !== filters.threatType) return false;
    if (filters.attackMethod && r.Attack_Method !== filters.attackMethod) return false;
    if (filters.channel && r.Channel !== filters.channel) return false;
    if (filters.status && r.Incident_Status !== filters.status) return false;
    if (filters.severity && r.Severity !== filters.severity) return false;
    if (filters.vulnerability && r.Vulnerability !== filters.vulnerability) return false;
    if (filters.securityControl && r.Security_Control !== filters.securityControl) return false;
    if (filters.transactionType && r.Transaction_Type !== filters.transactionType) return false;

    // Risk score range (0-100)
    if (filters.minRiskScore !== undefined && filters.minRiskScore !== '' && r.Risk_Score < Number(filters.minRiskScore)) {
      return false;
    }
    if (filters.maxRiskScore !== undefined && filters.maxRiskScore !== '' && r.Risk_Score > Number(filters.maxRiskScore)) {
      return false;
    }

    // Date range filter
    if (filters.startDate && r.Date < filters.startDate) return false;
    if (filters.endDate && r.Date > filters.endDate) return false;

    // Global text search across all attributes
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const match = Object.values(r).some(v => 
        v !== null && v !== undefined && String(v).toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    return true;
  });
}

export function computeStats(records) {
  const total = records.length;
  if (!total) {
    return {
      total: 0,
      financialLoss: 0,
      customersAffected: 0,
      avgRisk: 0,
      avgDowntime: 0,
      avgResolutionTime: 0,
      resolvedRate: 0,
    };
  }

  const financialLoss = records.reduce((s, r) => s + Number(r.Financial_Loss_INR || 0), 0);
  const customersAffected = records.reduce((s, r) => s + Number(r.Customers_Affected || 0), 0);
  const totalRisk = records.reduce((s, r) => s + Number(r.Risk_Score || 0), 0);
  const totalDowntime = records.reduce((s, r) => s + Number(r.Downtime_Hours || 0), 0);
  const totalResolution = records.reduce((s, r) => s + Number(r.Resolution_Time_Hours || 0), 0);
  
  const resolvedCount = records.filter(r => 
    r.Incident_Status === 'Resolved' || r.Incident_Status === 'Closed'
  ).length;

  return {
    total,
    financialLoss,
    customersAffected,
    avgRisk: Number((totalRisk / total).toFixed(1)),
    avgDowntime: Number((totalDowntime / total).toFixed(1)),
    avgResolutionTime: Number((totalResolution / total).toFixed(1)),
    resolvedRate: Number(((resolvedCount / total) * 100).toFixed(1)),
  };
}

export function computePeriodComparison(allData, filters) {
  // If no date range or comparison is requested, return null
  if (!filters.comparePeriod || !filters.startDate || !filters.endDate) {
    return null;
  }

  const currentStart = new Date(filters.startDate);
  const currentEnd = new Date(filters.endDate);
  const diffTime = currentEnd.getTime() - currentStart.getTime();
  const diffDays = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));

  // Prior period: same number of days immediately preceding currentStart
  const priorEnd = new Date(currentStart.getTime() - (1000 * 3600 * 24));
  const priorStart = new Date(priorEnd.getTime() - (diffDays * 1000 * 3600 * 24));

  const toISODate = (d) => d.toISOString().split('T')[0];
  const priorStartStr = toISODate(priorStart);
  const priorEndStr = toISODate(priorEnd);

  // Filter prior records with the same criteria except the date range
  const priorFilters = {
    ...filters,
    startDate: priorStartStr,
    endDate: priorEndStr,
    comparePeriod: false,
  };

  const currentRecords = filterIncidents(allData, filters);
  const priorRecords = filterIncidents(allData, priorFilters);

  const curStats = computeStats(currentRecords);
  const priStats = computeStats(priorRecords);

  const getDelta = (cur, pri) => {
    if (!pri) return cur > 0 ? 100 : 0;
    return Number((((cur - pri) / pri) * 100).toFixed(1));
  };

  return {
    priorPeriodLabel: `${priorStartStr} to ${priorEndStr}`,
    priorStats: priStats,
    deltas: {
      total: getDelta(curStats.total, priStats.total),
      financialLoss: getDelta(curStats.financialLoss, priStats.financialLoss),
      customersAffected: getDelta(curStats.customersAffected, priStats.customersAffected),
      avgRisk: getDelta(curStats.avgRisk, priStats.avgRisk),
      avgDowntime: getDelta(curStats.avgDowntime, priStats.avgDowntime),
      avgResolutionTime: getDelta(curStats.avgResolutionTime, priStats.avgResolutionTime),
    }
  };
}

export function computeDynamicInsights(records) {
  if (!records || records.length === 0) {
    return [
      {
        id: 'empty',
        tag: 'DATASET SELECTION',
        title: 'No matching records',
        highlight: '0 Incidents',
        description: 'Adjust or clear active filters to view dynamic analytics insights.',
        sentiment: 'neutral',
      }
    ];
  }

  const total = records.length;
  const totalLoss = records.reduce((s, r) => s + Number(r.Financial_Loss_INR || 0), 0);
  const totalCustomers = records.reduce((s, r) => s + Number(r.Customers_Affected || 0), 0);

  // 1. Peak Vulnerability Vector
  const vulnCounts = {};
  const vulnLoss = {};
  records.forEach(r => {
    const v = r.Vulnerability || 'Unspecified';
    vulnCounts[v] = (vulnCounts[v] || 0) + 1;
    vulnLoss[v] = (vulnLoss[v] || 0) + Number(r.Financial_Loss_INR || 0);
  });
  const topVuln = Object.entries(vulnCounts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  const topVulnLoss = vulnLoss[topVuln[0]] || 0;
  const topVulnLossPct = totalLoss ? ((topVulnLoss / totalLoss) * 100).toFixed(1) : 0;

  // 2. Most Impacted Channel
  const channelCust = {};
  const channelCount = {};
  records.forEach(r => {
    const ch = r.Channel || 'Unknown';
    channelCust[ch] = (channelCust[ch] || 0) + Number(r.Customers_Affected || 0);
    channelCount[ch] = (channelCount[ch] || 0) + 1;
  });
  const topChannelCust = Object.entries(channelCust).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  const topChannelPct = totalCustomers ? ((topChannelCust[1] / totalCustomers) * 100).toFixed(1) : 0;

  // 3. Operational MTTR & Downtime
  const avgDowntime = (records.reduce((s, r) => s + Number(r.Downtime_Hours || 0), 0) / total).toFixed(1);
  const avgResolution = (records.reduce((s, r) => s + Number(r.Resolution_Time_Hours || 0), 0) / total).toFixed(1);
  const fastResolvedCount = records.filter(r => Number(r.Resolution_Time_Hours || 0) <= 24).length;
  const fastResolvedPct = ((fastResolvedCount / total) * 100).toFixed(1);

  // 4. Primary Attack Vector
  const attackCounts = {};
  const threatCounts = {};
  records.forEach(r => {
    attackCounts[r.Attack_Method] = (attackCounts[r.Attack_Method] || 0) + 1;
    threatCounts[r.Threat_Type] = (threatCounts[r.Threat_Type] || 0) + 1;
  });
  const topAttack = Object.entries(attackCounts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  const topThreat = Object.entries(threatCounts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  // 5. Containment & Resolution Rate
  const resolvedCount = records.filter(r => r.Incident_Status === 'Resolved' || r.Incident_Status === 'Closed').length;
  const containmentPct = ((resolvedCount / total) * 100).toFixed(1);
  const openCount = records.filter(r => r.Incident_Status === 'Open' || r.Incident_Status === 'Investigating').length;

  // 6. Average Financial Impact
  const avgLoss = Math.round(totalLoss / total);
  const criticalCount = records.filter(r => r.Risk_Level === 'Critical').length;
  const criticalPct = ((criticalCount / total) * 100).toFixed(1);

  return [
    {
      id: 'vuln',
      tag: 'DOMINANT VULNERABILITY',
      title: topVuln[0],
      highlight: `${topVuln[1]} incidents (${((topVuln[1] / total) * 100).toFixed(0)}%)`,
      description: `Associated with ${topVulnLossPct}% of selected financial losses. Primary driver of unauthorized transaction exposure.`,
      sentiment: 'warning',
    },
    {
      id: 'channel',
      tag: 'CUSTOMER EXPOSURE',
      title: `${topChannelCust[0]} Channel`,
      highlight: `${topChannelPct}% of affected users`,
      description: `${channelCount[topChannelCust[0]] || 0} incidents targeted this channel, impacting ${topChannelCust[1].toLocaleString('en-IN')} customer accounts.`,
      sentiment: 'danger',
    },
    {
      id: 'mttr',
      tag: 'OPERATIONAL RESILIENCE',
      title: `MTTR ${avgResolution} hrs`,
      highlight: `${fastResolvedPct}% resolved ≤24h`,
      description: `Mean system downtime stands at ${avgDowntime} hours per event across the selected banking channels.`,
      sentiment: Number(fastResolvedPct) >= 50 ? 'success' : 'warning',
    },
    {
      id: 'containment',
      tag: 'SECURITY GOVERNANCE',
      title: `${containmentPct}% Containment`,
      highlight: `${openCount} active investigations`,
      description: `${resolvedCount} of ${total} recorded incidents have reached resolved or closed status within the reporting window.`,
      sentiment: Number(containmentPct) >= 75 ? 'success' : 'neutral',
    },
    {
      id: 'threat',
      tag: 'ATTACK PATTERN',
      title: `${topThreat[0]}`,
      highlight: `${topAttack[0]}`,
      description: `Most pervasive threat modality in the current filter, accounting for ${topThreat[1]} events across banking touchpoints.`,
      sentiment: 'info',
    },
    {
      id: 'exposure',
      tag: 'FINANCIAL SEVERITY',
      title: `₹${avgLoss.toLocaleString('en-IN')} / incident`,
      highlight: `${criticalPct}% Critical Risk`,
      description: `${criticalCount} incidents categorized at critical severity, requiring priority incident response escalation.`,
      sentiment: Number(criticalPct) > 20 ? 'danger' : 'neutral',
    }
  ];
}

export function computeStateAggregates(records) {
  const statesMap = {};
  records.forEach(r => {
    const s = r.State || 'Unknown';
    if (!statesMap[s]) {
      statesMap[s] = {
        state: s,
        count: 0,
        loss: 0,
        customers: 0,
        riskSum: 0,
        topThreat: {},
      };
    }
    statesMap[s].count++;
    statesMap[s].loss += Number(r.Financial_Loss_INR || 0);
    statesMap[s].customers += Number(r.Customers_Affected || 0);
    statesMap[s].riskSum += Number(r.Risk_Score || 0);
    statesMap[s].topThreat[r.Threat_Type] = (statesMap[s].topThreat[r.Threat_Type] || 0) + 1;
  });

  return Object.values(statesMap).map(s => {
    const topThreatName = Object.entries(s.topThreat).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return {
      state: s.state,
      count: s.count,
      loss: s.loss,
      customers: s.customers,
      avgRisk: s.count ? Number((s.riskSum / s.count).toFixed(1)) : 0,
      topThreat: topThreatName,
    };
  }).sort((a, b) => b.count - a.count);
}
