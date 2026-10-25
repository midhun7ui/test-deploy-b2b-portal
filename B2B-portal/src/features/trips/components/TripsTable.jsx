import { useNavigate } from "react-router-dom";

function TripsTable({ trips = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <section className="trips-table-panel">
      <div className="trips-table-header">
        <div>
          <span className="trips-table-eyebrow">
            TRIP HISTORY
          </span>

          <h2>
            All Trips
            <span>{trips.length}</span>
          </h2>
        </div>
      </div>

      <div className="trips-table-wrapper">
        <table className="trips-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Order ID</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Pickup</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Amount</th>
              <th aria-label="Actions" />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  Loading trips...
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  No trips found matching the selected criteria.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
              <tr key={trip.id}>
                <td>
                  <button
                    type="button"
                    className="trips-id-button"
                    onClick={() =>
                      navigate(`/trips/${trip.id}`)
                    }
                  >
                    {trip.id}
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    className="trips-order-button"
                    onClick={() =>
                      navigate(`/orders/${trip.orderId}`)
                    }
                  >
                    {trip.orderId}
                  </button>
                </td>

                <td>
                  <div className="trips-route">
                    <strong>
                      {trip.pickup} → {trip.delivery}
                    </strong>

                    <span>
                      {trip.pickup} → {trip.delivery}
                    </span>
                  </div>
                </td>

                <td>
                  <span
                    className={`trips-driver ${
                      trip.driver === "Not Assigned"
                        ? "unassigned"
                        : ""
                    }`}
                  >
                    {trip.driver}
                  </span>
                </td>

                <td>
                  <span className="trips-table-muted">
                    {trip.pickupDate}
                  </span>
                </td>

                <td>
                  <span className="trips-table-muted">
                    {trip.deliveryDate}
                  </span>
                </td>

                <td>
                  <span
                    className={`trips-status trips-status-${trip.status.toLowerCase()}`}
                  >
                    <span className="trips-status-dot" />
                    {trip.status}
                  </span>
                </td>

                <td>
                  <strong className="trips-amount">
                    {trip.amount}
                  </strong>
                </td>

                <td>
                  <button
                    type="button"
                    className="trips-row-action"
                    aria-label={`Actions for ${trip.id}`}
                  >
                    <span />
                    <span />
                    <span />
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      <div className="trips-table-footer">
        <span>
          Showing {trips.length > 0 ? 1 : 0}–{trips.length} of {trips.length} trips
        </span>

        <div className="trips-pagination">
          <button type="button" disabled>
            ‹
          </button>

          <button type="button" className="active">
            1
          </button>

          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">4</button>
          <button type="button">5</button>

          <span>...</span>

          <button type="button">10</button>

          <button type="button">›</button>
        </div>
      </div>
    </section>
  );
}

export default TripsTable;