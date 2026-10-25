
function ReportStats({ stats }) {
  const getIcon = (type) => {
    switch (type) {
      case "trips":
        return "↗";
      case "value":
        return "₹";
      case "average":
        return "∑";
      case "completion":
        return "✓";
      default:
        return "•";
    }
  };

  return (
    <section className="report-stats" aria-label="Analytics overview">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={`report-stat-card report-stat-${stat.type}`}
        >
          <div className="report-stat-top">
            <span className="report-stat-label">{stat.label}</span>

            <span className="report-stat-icon" aria-hidden="true">
              {getIcon(stat.type)}
            </span>
          </div>

          <strong className="report-stat-value">{stat.value}</strong>

          <span className="report-stat-description">
            {stat.description}
          </span>
        </article>
      ))}
    </section>
  );
}

export default ReportStats;
