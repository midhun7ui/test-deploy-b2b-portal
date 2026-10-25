import { Link } from "react-router-dom";

function OrderInformation({ order }) {
  const trip = order?.trip;
  const tripId =
    order?.tripId ||
    (trip?.id
      ? String(trip.id).startsWith("TRP-")
        ? trip.id
        : `TRP-${trip.id}`
      : null);
  const driverName =
    trip?.driver_name && trip.driver_name !== "Not Assigned"
      ? trip.driver_name
      : null;

  return (
    <section className="order-details-card">
      <div className="order-details-card-heading">
        <div>
          <span className="order-details-card-eyebrow">
            ORDER INFORMATION
          </span>

          <h2>Shipment Details</h2>
        </div>
      </div>

      <div className="order-information-grid">
        <InfoItem
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
              <path d="M4 7.5 12 12l8-4.5" />
              <path d="M12 12v9" />
            </svg>
          }
          label="Cargo Type"
          value={order.cargo}
        />

        <InfoItem
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h11v11H3z" />
              <path d="M14 10h4l3 3v4h-7z" />
              <circle cx="7" cy="19" r="2" />
              <circle cx="18" cy="19" r="2" />
            </svg>
          }
          label="Vehicle Type"
          value={order.vehicle}
        />

        <InfoItem
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="5" width="16" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M4 10h16" />
            </svg>
          }
          label="Pickup Date"
          value={order.pickupDate}
        />

        <InfoItem
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h14v16H5z" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          }
          label="Expected Delivery"
          value={order.deliveryDate}
        />

        <InfoItem
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v18" />
              <path d="M17 7.5c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" />
            </svg>
          }
          label="Order Amount"
          value={order.amount}
          highlight
        />

        <InfoItem
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 8h8M8 12h5M8 16h3" />
            </svg>
          }
          label="Order ID"
          value={order.id}
        />

        {tripId && (
          <div className="order-information-item">
            <div className="order-information-label">
              <span className="order-information-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <span>Linked Trip</span>
            </div>
            <strong>
              <Link
                to={`/trips/${tripId}`}
                style={{
                  color: "var(--hired-blue, #2563eb)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{tripId}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </strong>
          </div>
        )}

        {driverName && (
          <InfoItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
            label="Assigned Driver"
            value={driverName}
          />
        )}
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="order-information-item">
      <div className="order-information-label">
        <span className="order-information-icon">
          {icon}
        </span>

        <span>{label}</span>
      </div>

      <strong className={highlight ? "highlight" : ""}>
        {value}
      </strong>
    </div>
  );
}

export default OrderInformation;