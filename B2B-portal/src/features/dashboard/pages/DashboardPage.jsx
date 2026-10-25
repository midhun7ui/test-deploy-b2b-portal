import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import RecentOrders from "../components/RecentOrders";
import ActiveTrips from "../components/ActiveTrips";
import RecentActivity from "../components/RecentActivity";
import useDashboardData from "../hooks/useDashboardData";

function DashboardPage() {
  const {
    loading,
    error,
    stats,
    recentOrders,
    activeTrips,
    activities,
    refresh,
  } = useDashboardData();

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page">
        <DashboardTopbar />

        <DashboardHeader />

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
              onClick={refresh}
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

        <section className="dashboard-stats">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={loading ? "—" : stat.value}
              description={stat.description}
            />
          ))}
        </section>

        <section className="dashboard-content-grid">
          <RecentOrders orders={recentOrders} loading={loading} />
          <ActiveTrips trips={activeTrips} loading={loading} />
        </section>

        <section className="dashboard-activity">
          <RecentActivity activities={activities} loading={loading} />
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;