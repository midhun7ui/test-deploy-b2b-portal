
function SupportOverview({ tickets, selectedFilter = "All", onSelectFilter }) {
  const stats = [
    {
      label: "Total Tickets",
      filterKey: "All",
      value: tickets.length,
      description: "All logged partner tickets",
      type: "total",
    },
    {
      label: "Open",
      filterKey: "Open",
      value: tickets.filter((ticket) => ticket.status === "Open").length,
      description: "Awaiting ops assignment",
      type: "open",
    },
    {
      label: "In Progress",
      filterKey: "In Progress",
      value: tickets.filter((ticket) => ticket.status === "In Progress").length,
      description: "Under active investigation",
      type: "progress",
    },
    {
      label: "Resolved",
      filterKey: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "Resolved" || ticket.status === "Closed").length,
      description: "Problem successfully fixed",
      type: "resolved",
    },
  ];

  return (
    <section className="support-stats">
      {stats.map((stat) => {
        const isSelected = selectedFilter === stat.filterKey;
        return (
          <article
            className={`support-stat-card ${isSelected ? "selected" : ""}`}
            key={stat.type}
            onClick={() => onSelectFilter && onSelectFilter(stat.filterKey)}
            style={{
              cursor: onSelectFilter ? "pointer" : "default",
              border: isSelected ? "2px solid #2563eb" : undefined,
              boxShadow: isSelected ? "0 4px 12px rgba(37, 99, 235, 0.15)" : undefined,
              transition: "all 0.2s ease",
            }}
          >
            <div className="support-stat-top">
              <span>{stat.label}</span>
              <span
                className={`support-stat-icon support-stat-icon-${stat.type}`}
                aria-hidden="true"
              >
                {stat.type === "total" && "▤"}
                {stat.type === "open" && "○"}
                {stat.type === "progress" && "↻"}
                {stat.type === "resolved" && "✓"}
              </span>
            </div>

            <strong>{stat.value}</strong>
            <small>{stat.description}</small>
          </article>
        );
      })}
    </section>
  );
}

export default SupportOverview;
