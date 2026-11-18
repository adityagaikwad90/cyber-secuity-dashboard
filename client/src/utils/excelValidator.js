import * as XLSX from 'xlsx';

export const REQUIRED_COLUMNS = [
  'Incident_ID',
  'Date',
  'Threat_Type',
  'Risk_Score',
  'Financial_Loss_INR',
  'State'
];

export const ALL_COLUMNS = [
  'Incident_ID',
  'Date',
  'Year',
  'Month',
  'Month_Number',
  'Threat_Type',
  'Attack_Method',
  'Channel',
  'Transaction_Type',
  'Severity',
  'Vulnerability',
  'Risk_Score',
  'Risk_Level',
  'Security_Control',
  'State',
  'City',
  'Financial_Loss_INR',
  'Customers_Affected',
  'Downtime_Hours',
  'Incident_Status',
  'Resolution_Time_Hours'
];

export function parseAndValidateFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          return reject(new Error('Uploaded workbook contains no visible sheets.'));
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          return reject(new Error('Uploaded sheet is empty or contains no valid rows.'));
        }

        // Validate presence of required columns
        const firstRow = rawJson[0];
        const existingKeys = Object.keys(firstRow);
        const missing = REQUIRED_COLUMNS.filter(col => 
          !existingKeys.some(k => k.trim().toLowerCase() === col.toLowerCase())
        );

        if (missing.length > 0) {
          return reject(new Error(
            `Missing mandatory column(s): ${missing.join(', ')}. ` +
            `Ensure your file includes columns matching the reference dataset schema.`
          ));
        }

        // Standardize column names and sanitize data types
        const sanitized = rawJson.map((row, idx) => {
          const item = {};
          
          // Match key case-insensitively
          const getVal = (colName) => {
            const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === colName.toLowerCase());
            return foundKey !== undefined ? row[foundKey] : '';
          };

          const rawDate = getVal('Date');
          let dateStr = '';
          if (rawDate instanceof Date) {
            dateStr = rawDate.toISOString().split('T')[0];
          } else if (typeof rawDate === 'string') {
            dateStr = rawDate.trim();
          } else if (typeof rawDate === 'number') {
            // Excel serial date format
            const parsed = new Date((rawDate - (25567 + 2)) * 86400 * 1000);
            dateStr = !isNaN(parsed) ? parsed.toISOString().split('T')[0] : '2024-01-01';
          } else {
            dateStr = '2024-01-01';
          }

          const parsedYear = parseInt(getVal('Year')) || (dateStr ? new Date(dateStr).getFullYear() : 2024);
          const parsedRiskScore = Number(getVal('Risk_Score')) || 0;
          
          let riskLevel = getVal('Risk_Level');
          if (!riskLevel) {
            if (parsedRiskScore >= 80) riskLevel = 'Critical';
            else if (parsedRiskScore >= 60) riskLevel = 'High';
            else if (parsedRiskScore >= 40) riskLevel = 'Medium';
            else riskLevel = 'Low';
          }

          item.Incident_ID = String(getVal('Incident_ID') || `INC-UP-${idx + 1}`);
          item.Date = dateStr;
          item.Year = parsedYear;
          item.Month = String(getVal('Month') || 'January');
          item.Month_Number = Number(getVal('Month_Number')) || 1;
          item.Threat_Type = String(getVal('Threat_Type') || 'Unspecified Threat');
          item.Attack_Method = String(getVal('Attack_Method') || 'General Attack');
          item.Channel = String(getVal('Channel') || 'Internet Banking');
          item.Transaction_Type = String(getVal('Transaction_Type') || 'Fund Transfer');
          item.Severity = String(getVal('Severity') || 'Medium');
          item.Vulnerability = String(getVal('Vulnerability') || 'Weak Authentication');
          item.Risk_Score = parsedRiskScore;
          item.Risk_Level = riskLevel;
          item.Security_Control = String(getVal('Security_Control') || 'MFA');
          item.State = String(getVal('State') || 'National');
          item.City = String(getVal('City') || 'Metro');
          item.Financial_Loss_INR = Number(getVal('Financial_Loss_INR')) || 0;
          item.Customers_Affected = Number(getVal('Customers_Affected')) || 0;
          item.Downtime_Hours = Number(getVal('Downtime_Hours')) || 0;
          item.Incident_Status = String(getVal('Incident_Status') || 'Resolved');
          item.Resolution_Time_Hours = Number(getVal('Resolution_Time_Hours')) || 0;

          return item;
        });

        resolve(sanitized);
      } catch (err) {
        reject(new Error(`Failed to parse file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsArrayBuffer(file);
  });
}

export function downloadSampleTemplate() {
  const sampleData = [
    {
      Incident_ID: 'INC09999',
      Date: '2024-05-15',
      Year: 2024,
      Month: 'May',
      Month_Number: 5,
      Threat_Type: 'Phishing',
      Attack_Method: 'Credential Theft',
      Channel: 'Mobile Banking',
      Transaction_Type: 'UPI Payment',
      Severity: 'High',
      Vulnerability: 'Social Engineering Exposure',
      Risk_Score: 78,
      Risk_Level: 'High',
      Security_Control: 'MFA',
      State: 'Maharashtra',
      City: 'Mumbai',
      Financial_Loss_INR: 45000,
      Customers_Affected: 120,
      Downtime_Hours: 2.5,
      Incident_Status: 'Closed',
      Resolution_Time_Hours: 12.0
    },
    {
      Incident_ID: 'INC09998',
      Date: '2024-05-16',
      Year: 2024,
      Month: 'May',
      Month_Number: 5,
      Threat_Type: 'Payment Fraud',
      Attack_Method: 'Fake Payment Request',
      Channel: 'UPI',
      Transaction_Type: 'Fund Transfer',
      Severity: 'Critical',
      Vulnerability: 'Insecure API',
      Risk_Score: 92,
      Risk_Level: 'Critical',
      Security_Control: 'Transaction Monitoring',
      State: 'Delhi',
      City: 'New Delhi',
      Financial_Loss_INR: 125000,
      Customers_Affected: 350,
      Downtime_Hours: 4.0,
      Incident_Status: 'Resolved',
      Resolution_Time_Hours: 18.5
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidents');
  XLSX.writeFile(workbook, 'cyber_risk_sample_template.xlsx');
}
