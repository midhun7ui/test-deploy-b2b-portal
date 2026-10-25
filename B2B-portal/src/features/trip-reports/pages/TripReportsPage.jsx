import { useCallback, useEffect, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import TripReportsHeader from "../components/TripReportsHeader";
import TripReportStats from "../components/TripReportStats";
import TripReportsFilters from "../components/TripReportsFilters";
import TripReportsTable from "../components/TripReportsTable";
import tripReportsApi from "../services/tripReportsApi";

const DEFAULT_STATS = [
  {
    label: "Total Reports",
    value: "0",
    description: "Generated reports",
    type: "total",
  },
  {
    label: "This Month",
    value: "0",
    description: "Reports completed this month",
    type: "monthly",
  },
  {
    label: "Total Expenses",
    value: "₹0",
    description: "Reported trip expenses",
    type: "expenses",
  },
  {
    label: "Awaiting Closure",
    value: "0",
    description: "Trips not yet closed",
    type: "pending",
  },
];

function TripReportsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripReportsApi.listTripReports({
        status,
        search,
      });
      setReports(data?.reports || []);
      if (data?.stats && Array.isArray(data.stats) && data.stats.length > 0) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load trip reports from server."
      );
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchReports]);

  const handleReset = () => {
    setSearch("");
    setStatus("All");
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page trip-reports-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content trip-reports-content">
          <TripReportsHeader />

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

          <TripReportStats stats={stats} />

          <TripReportsFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            onReset={handleReset}
          />

          <TripReportsTable reports={reports} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default TripReportsPage;