function RecentActivity({ activities = [], loading = false }) {
  return (
    <section className="dashboard-panel dashboard-activity-panel">
      <div className="dashboard-panel-header">
        <div>
          <p className="panel-eyebrow">ACTIVITY</p>
          <h2>Recent Activity</h2>
        </div>
      </div>

      <div className="activity-list">
        {loading ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
            Loading activity feed...
          </div>
        ) : activities.length === 0 ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
            No recent activity recorded.
          </div>
        ) : (
          activities.map((activity) => (
            <article className="activity-row" key={activity.id}>
              <span className={`activity-indicator activity-${activity.type || "order"}`} />

              <div className="activity-content">
                <strong>{activity.title}</strong>
                <span>{activity.time}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default RecentActivity;