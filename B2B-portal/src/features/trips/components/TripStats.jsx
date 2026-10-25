function TripStats({ stats }) {
  return (
    <section className="trips-stats">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={`trips-stat-card trips-stat-${stat.type}`}
        >
          <div className="trips-stat-top">
            <span className="trips-stat-label">
              {stat.label}
            </span>

            <span className="trips-stat-icon">
              {stat.type === "unassigned" && "!"}
              {stat.type === "assigned" && "→"}
              {stat.type === "ongoing" && "↗"}
              {stat.type === "completed" && "✓"}
              {stat.type === "total" && "•"}
            </span>
          </div>

          <strong className="trips-stat-value">
            {stat.value}
          </strong>

          <span className="trips-stat-description">
            {stat.description}
          </span>
        </article>
      ))}
    </section>
  );
}

export default TripStats;