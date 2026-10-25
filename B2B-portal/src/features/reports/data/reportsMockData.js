
export const reports = [
  {
    id: "RPT-2026-09",
    period: "September 2026",
    periodKey: "2026-09",
    completedTrips: 18,
    totalTripValue: 245600,
    averageTripValue: 13644.44,
    completionRate: 90,
    status: "Available",
  },
  {
    id: "RPT-2026-08",
    period: "August 2026",
    periodKey: "2026-08",
    completedTrips: 22,
    totalTripValue: 318400,
    averageTripValue: 14472.73,
    completionRate: 92,
    status: "Available",
  },
  {
    id: "RPT-2026-07",
    period: "July 2026",
    periodKey: "2026-07",
    completedTrips: 16,
    totalTripValue: 218000,
    averageTripValue: 13625,
    completionRate: 89,
    status: "Available",
  },
  {
    id: "RPT-2026-06",
    period: "June 2026",
    periodKey: "2026-06",
    completedTrips: 20,
    totalTripValue: 276500,
    averageTripValue: 13825,
    completionRate: 94,
    status: "Available",
  },
];

export const reportStats = [
  {
    label: "Completed Trips",
    value: "76",
    description: "Across listed periods",
    type: "trips",
  },
  {
    label: "Total Trip Value",
    value: "₹10,58,500",
    description: "Across listed periods",
    type: "value",
  },
  {
    label: "Average Trip Value",
    value: "₹13,928",
    description: "Across listed periods",
    type: "average",
  },
  {
    label: "Average Completion Rate",
    value: "91.3%",
    description: "Across listed periods",
    type: "completion",
  },
];

export const monthlyTripTrends = [
  { month: "Jun", completedTrips: 20, tripValue: 276500 },
  { month: "Jul", completedTrips: 16, tripValue: 218000 },
  { month: "Aug", completedTrips: 22, tripValue: 318400 },
  { month: "Sep", completedTrips: 18, tripValue: 245600 },
];

export const routeInsights = [
  {
    route: "Kochi → Bengaluru",
    tripCount: 14,
    totalTripValue: 196000,
  },
  {
    route: "Palakkad → Coimbatore",
    tripCount: 11,
    totalTripValue: 132000,
  },
  {
    route: "Kozhikode → Kochi",
    tripCount: 9,
    totalTripValue: 118500,
  },
  {
    route: "Kannur → Mangaluru",
    tripCount: 7,
    totalTripValue: 94500,
  },
];

export const tripStatusBreakdown = [
  { status: "Completed", count: 76 },
  { status: "In Progress", count: 5 },
  { status: "Pending", count: 3 },
  { status: "Cancelled", count: 2 },
];
