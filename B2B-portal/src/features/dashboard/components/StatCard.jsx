function StatCard({ label, value, description }) {
  const getCardType = () => {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.includes("pending")) {
      return "pending";
    }

    if (normalizedLabel.includes("rejected")) {
      return "rejected";
    }

    if (normalizedLabel.includes("ongoing")) {
      return "ongoing";
    }

    if (normalizedLabel.includes("completed")) {
      return "completed";
    }

    if (normalizedLabel.includes("accepted")) {
      return "accepted";
    }

    return "default";
  };

  return (
    <article className={`dashboard-stat-card stat-${getCardType()}`}>
      <div className="dashboard-stat-top">
        <span className="dashboard-stat-label">
          {label}
        </span>

        <span className="dashboard-stat-icon">
          {getCardType() === "pending" && "!"}
          {getCardType() === "rejected" && "×"}
          {getCardType() === "ongoing" && "→"}
          {getCardType() === "completed" && "✓"}
          {getCardType() === "accepted" && "✓"}
          {getCardType() === "default" && "•"}
        </span>
      </div>

      <strong className="dashboard-stat-value">
        {value}
      </strong>

      <p className="dashboard-stat-description">
        {description}
      </p>
    </article>
  );
}

export default StatCard;