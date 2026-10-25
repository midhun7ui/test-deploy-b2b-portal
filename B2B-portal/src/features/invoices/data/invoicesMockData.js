// Illustrative frontend data only.
// The backend will provide real published statements and financial values.
// B2B partners should only receive statements published after verification.

export const invoices = [
  {
    id: "STMT-2026-09",
    period: "September 2026",
    periodKey: "2026-09",
    tripCount: 18,
    totalTripAmount: 245600,
    driverShare: 147360,
    companyShare: 98240,
    totalExpenses: 18450,
    status: "Published",
    publishedDate: "05 Oct 2026",
  },
  {
    id: "STMT-2026-08",
    period: "August 2026",
    periodKey: "2026-08",
    tripCount: 22,
    totalTripAmount: 318400,
    driverShare: 191040,
    companyShare: 127360,
    totalExpenses: 23600,
    status: "Published",
    publishedDate: "04 Sep 2026",
  },
  {
    id: "STMT-2026-07",
    period: "July 2026",
    periodKey: "2026-07",
    tripCount: 16,
    totalTripAmount: 218000,
    driverShare: 130800,
    companyShare: 87200,
    totalExpenses: 15750,
    status: "Published",
    publishedDate: "05 Aug 2026",
  },
  {
    id: "STMT-2026-06",
    period: "June 2026",
    periodKey: "2026-06",
    tripCount: 20,
    totalTripAmount: 276500,
    driverShare: 165900,
    companyShare: 110600,
    totalExpenses: 21200,
    status: "Published",
    publishedDate: "04 Jul 2026",
  },
];

export const invoiceStats = [
  {
    label: "Published Statements",
    value: "4",
    description: "Available to view",
    type: "published",
  },
  {
    label: "Total Trips",
    value: "76",
    description: "Trips across listed periods",
    type: "trips",
  },
  {
    label: "Total Trip Amount",
    value: "₹10,58,500",
    description: "Across listed periods",
    type: "amount",
  },
  {
    label: "Company Share",
    value: "₹4,23,400",
    description: "Across listed periods",
    type: "share",
  },
];