import { useNavigate } from "react-router-dom";

function OrderDetailsHeader({ order }) {
  const navigate = useNavigate();

  const trip = order?.trip;
  const tripStatus = (trip?.status || order?.trip_status || "").toLowerCase();

  // Dynamically resolve display status according to actual trip & order lifecycle
  let displayStatus = order?.status || "Pending";
  if (tripStatus === "closed" || tripStatus === "completed" || tripStatus === "delivered") {
    displayStatus = "Completed";
  } else if (tripStatus === "ongoing") {
    displayStatus = "In Transit";
  }

  const statusClass = String(displayStatus).toLowerCase().replace(/\s+/g, "-");

  return (
    <section className="order-details-header">
      <div className="order-details-header-main">
        <button
          type="button"
          className="order-details-back"
          onClick={() => navigate("/orders")}
          aria-label="Back to orders"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>

          <span>Back to Orders</span>
        </button>

        <div className="order-details-heading">
          <div>
            <span className="order-details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>{order.id}</h1>

            <p>
              Created on {order.pickupDate}
            </p>
          </div>

          <span
            className={`order-details-status order-details-status-${statusClass}`}
          >
            <span className="order-details-status-dot" />
            {displayStatus}
          </span>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailsHeader;