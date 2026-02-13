export const cyberIrelandData = {
  totalJobs: 7351,
  totalFirms: 489,
  totalRevenue: "€2.1bn",
  totalGva: "€1.1bn",
  gvaPerEmployee: "€150k",
  
  regions: {
    Dublin: { offices: 397, firms: 100, coordinates: { lat: 53.3498, lng: -6.2603 } },
    Cork: { offices: 129, firms: 37, coordinates: { lat: 51.8985, lng: -8.4756 } },
    Galway: { offices: 39, firms: 8, coordinates: { lat: 53.2707, lng: -9.0568 } },
    Limerick: { offices: 30, firms: 3, coordinates: { lat: 52.6638, lng: -8.6267 } }
  },
  
  firmTypes: {
    dedicated: { count: 160, percentage: 33, employees: 3368 },
    diversified: { count: 329, percentage: 67, employees: 3983 }
  },
  
  firmSizes: {
    large: { count: 217, percentage: 44 },
    medium: { count: 58, percentage: 12 },
    small: { count: 77, percentage: 16 },
    micro: { count: 137, percentage: 28 }
  },
  
  growthProjection2030: {
    jobs: 17333,
    gva: "€2.5bn"
  },
  
  taxonomy: {
    MSSP_Advisory: { firms: 174, percentage: 36, label: "MSSP & Advisory Services" },
    Applications_Networks_Cloud: { firms: 151, percentage: 31, label: "Applications, Networks & Cloud" },
    Risk_Compliance_Fraud: { firms: 138, percentage: 28, label: "Risk, Compliance & Fraud" },
    Threat_Intelligence: { firms: 129, percentage: 27, label: "Threat Intelligence & Monitoring" },
    OT_Security: { firms: 64, percentage: 13, label: "OT Security & Connected Devices" },
    IAM: { firms: 56, percentage: 11, label: "Identity & Access Management" }
  },

  yearlyGrowth: [
    { year: 2021, gva: 1075.5, employment: 7351 },
    { year: 2022, gva: 1183.1, employment: 8086 },
    { year: 2023, gva: 1301.4, employment: 8895 },
    { year: 2024, gva: 1431.5, employment: 9784 },
    { year: 2025, gva: 1574.7, employment: 10763 },
    { year: 2026, gva: 1732.1, employment: 11839 },
    { year: 2027, gva: 1905.4, employment: 13023 },
    { year: 2028, gva: 2095.9, employment: 14325 },
    { year: 2029, gva: 2305.5, employment: 15758 },
    { year: 2030, gva: 2536.0, employment: 17333 }
  ],

  pdfSource: {
    title: "State of the Cyber Security Sector in Ireland 2022",
    pages: {
      totalJobs: 12,
      firmBreakdown: 23,
      economicContribution: 36,
      growthProjections: 53
    }
  }
};
