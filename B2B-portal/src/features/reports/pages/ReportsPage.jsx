import { useCallback, useEffect, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import ReportsHeader from "../components/ReportsHeader";
import ReportStats from "../components/ReportStats";
import ReportsFilters from "../components/ReportsFilters";
import ReportsTable from "../components/ReportsTable";
import reportsApi from "../services/reportsApi";

const DEFAULT_STATS = [
  {
    label: "Completed Trips",
    value: "0",
    description: "Across listed periods",
    type: "trips",
  },
  {
    label: "Total Trip Value",
    value: "₹0",
    description: "Across listed periods",
    type: "value",
  },
  {
    label: "Average Trip Value",
    value: "₹0",
    description: "Across listed periods",
    type: "average",
  },
  {
    label: "Average Completion Rate",
    value: "0%",
    description: "Across listed periods",
    type: "completion",
  },
];

function ReportsPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [monthlyTripTrends, setMonthlyTripTrends] = useState([]);
  const [tripStatusBreakdown, setTripStatusBreakdown] = useState([]);
  const [routeInsights, setRouteInsights] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsApi.getReportsOverview({
        year,
        search,
      });

      if (data?.stats && Array.isArray(data.stats) && data.stats.length > 0) {
        setStats(data.stats);
      }
      setMonthlyTripTrends(data?.monthlyTripTrends || []);
      setTripStatusBreakdown(data?.tripStatusBreakdown || []);
      setRouteInsights(data?.routeInsights || []);
      setReportsList(data?.reports || []);
      if (data?.years && Array.isArray(data.years) && data.years.length > 0) {
        setYears(data.years);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load analytics and performance reports."
      );
    } finally {
      setLoading(false);
    }
  }, [year, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchReports]);

  const resetFilters = () => {
    setSearch("");
    setYear("all");
  };

  const maxTrips = Math.max(
    ...(monthlyTripTrends.length > 0
      ? monthlyTripTrends.map((trend) => trend.completedTrips)
      : [1]),
    1
  );

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page reports-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content reports-content">
          <ReportsHeader />

          {error && (
            <div
              role="alert"
              style={{
                margin: "0 0 1.5rem 0",
                padding: "0.875rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.875rem",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchReports}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #f87171",
                  color: "#f87171",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </div>
          )}

          <ReportStats stats={stats} />

          <section className="reports-analytics-grid">
            <article className="reports-analytics-card">
              <div className="reports-analytics-card-header">
                <div>
                  <h2>Monthly Trip Trends</h2>
                  <p>Completed trips by reporting month</p>
                </div>
                <span className="reports-card-tag">Monthly</span>
              </div>

              <div className="reports-trend-list">
                {monthlyTripTrends.length > 0 ? (
                  monthlyTripTrends.map((item) => (
                    <div className="reports-trend-item" key={`${item.month}-${item.year || ""}`}>
                      <div className="reports-trend-labels">
                        <span>{item.month}</span>
                        <strong>{item.completedTrips} trips</strong>
                      </div>

                      <div className="reports-trend-track">
                        <div
                          className="reports-trend-bar"
                          style={{
                            width: `${(item.completedTrips / maxTrips) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "16px 0", color: "var(--text-muted)", fontSize: "12px" }}>
                    No trend data available for this filter.
                  </div>
                )}
              </div>
            </article>

            <article className="reports-analytics-card">
              <div className="reports-analytics-card-header">
                <div>
                  <h2>Trip Status Breakdown</h2>
                  <p>Recorded trip statuses for your company</p>
                </div>
              </div>

              <div className="reports-status-list">
                {tripStatusBreakdown.length > 0 ? (
                  tripStatusBreakdown.map((item) => (
                    <div className="reports-status-item" key={item.status}>
                      <span className="reports-status-dot" />
                      <span>{item.status}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "16px 0", color: "var(--text-muted)", fontSize: "12px" }}>
                    No status data available.
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="reports-analytics-card reports-routes-card">
            <div className="reports-analytics-card-header">
              <div>
                <h2>Top Routes</h2>
                <p>Trip volume and value by route</p>
              </div>
            </div>

            <div className="reports-routes-list">
              {routeInsights.length > 0 ? (
                routeInsights.map((route) => (
                  <div className="reports-route-item" key={route.route}>
                    <div>
                      <strong>{route.route}</strong>
                      <span>{route.tripCount} trips</span>
                    </div>

                    <strong>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(route.totalTripValue)}
                    </strong>
                  </div>
                ))
              ) : (
                <div style={{ padding: "16px 0", color: "var(--text-muted)", fontSize: "12px" }}>
                  No route insights available for this period.
                </div>
              )}
            </div>
          </section>

          <ReportsFilters
            search={search}
            onSearchChange={setSearch}
            year={year}
            onYearChange={setYear}
            years={years}
            onReset={resetFilters}
          />

          <ReportsTable reports={reportsList} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default ReportsPage;
