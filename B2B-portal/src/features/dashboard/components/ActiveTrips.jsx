import { useNavigate } from "react-router-dom";

function ActiveTrips({ trips = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <p className="panel-eyebrow">OPERATIONS</p>
          <h2>Active Trips</h2>
        </div>

        <button
          type="button"
          className="panel-action"
          onClick={() => navigate("/trips")}
        >
          View trips
        </button>
      </div>

      <div className="trips-list">
        {loading ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
            Loading active trips...
          </div>
        ) : trips.length === 0 ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
            No active trips in progress.
          </div>
        ) : (
          trips.map((trip) => {
            const displayId = trip.trip_id || (typeof trip.id === "number" ? `TRP-${trip.id}` : trip.id);
            const statusClass = (trip.status || "ongoing").toLowerCase();

            return (
              <article className="trip-row" key={trip.id || displayId}>
                <div className="trip-icon">→</div>

                <div className="trip-main">
                  <strong>{displayId}</strong>
                  <span>{trip.route}</span>
                  <small>{trip.driver}</small>
                </div>

                <span className={`status-badge status-${statusClass}`}>
                  {trip.status}
                </span>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ActiveTrips;
