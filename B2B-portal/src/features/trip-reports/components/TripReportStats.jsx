
function TripReportStats({ stats }) {
  return (
    <section className="trip-report-stats">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={`trip-report-stat-card trip-report-stat-${stat.type}`}
        >
          <div className="trip-report-stat-top">
            <span className="trip-report-stat-label">
              {stat.label}
            </span>

            <span className="trip-report-stat-icon" aria-hidden="true">
              {stat.type === "total" && "▤"}
              {stat.type === "monthly" && "▦"}
              {stat.type === "expenses" && "₹"}
              {stat.type === "pending" && "!"}
            </span>
          </div>

          <strong className="trip-report-stat-value">
            {stat.value}
          </strong>

          <span className="trip-report-stat-description">
            {stat.description}
          </span>
        </article>
      ))}
    </section>
  );
}

export default TripReportStats;
