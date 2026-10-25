function InvoiceStats({ stats }) {
  return (
    <section className="invoice-stats">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={`invoice-stat-card invoice-stat-${stat.type}`}
        >
          <div className="invoice-stat-top">
            <span className="invoice-stat-label">{stat.label}</span>

            <span className="invoice-stat-icon" aria-hidden="true">
              {stat.type === "published" && "▤"}
              {stat.type === "trips" && "↗"}
              {stat.type === "amount" && "₹"}
              {stat.type === "share" && "◉"}
            </span>
          </div>

          <strong className="invoice-stat-value">{stat.value}</strong>

          <span className="invoice-stat-description">
            {stat.description}
          </span>
        </article>
      ))}
    </section>
  );
}

export default InvoiceStats;