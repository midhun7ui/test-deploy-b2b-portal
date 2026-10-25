function OrderStats({ stats }) {
  return (
    <section className="orders-stats">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={`orders-stat-card orders-stat-${stat.type}`}
        >
          <div className="orders-stat-top">
            <span className="orders-stat-label">
              {stat.label}
            </span>

            <span className="orders-stat-icon">
              {stat.type === "pending" && "!"}
              {stat.type === "accepted" && "✓"}
              {stat.type === "ongoing" && "→"}
              {stat.type === "rejected" && "×"}
              {stat.type === "total" && "•"}
            </span>
          </div>

          <strong className="orders-stat-value">
            {stat.value}
          </strong>

          <span className="orders-stat-description">
            {stat.description}
          </span>
        </article>
      ))}
    </section>
  );
}

export default OrderStats;