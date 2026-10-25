import { getCurrentUser } from "../../auth/authState";

function DashboardHeader() {
  const user = getCurrentUser();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="dashboard-header">
      <div className="dashboard-header-content">
        <span className="dashboard-header-eyebrow">
          OVERVIEW
        </span>

        <h1>Dashboard</h1>

        <p className="dashboard-welcome">
          Welcome back,{" "}
          <strong>{user?.username || "Partner"}</strong>.
          Here's an overview of your operations.
        </p>
      </div>

      <div className="dashboard-header-date">
        <span>Today</span>
        <strong>{today}</strong>
      </div>
    </section>
  );
}

export default DashboardHeader;