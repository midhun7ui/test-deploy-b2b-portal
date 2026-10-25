import OrderRouteMap from "./OrderRouteMap";

function extractCoords(coords, mapUrl) {
  if (Array.isArray(coords) && coords.length === 2 && coords[0] != null && coords[1] != null) {
    return [Number(coords[0]), Number(coords[1])];
  }
  if (typeof mapUrl === "string") {
    const match = mapUrl.match(/[?&]q=([0-9.-]+),([0-9.-]+)/);
    if (match) {
      return [parseFloat(match[2]), parseFloat(match[1])]; // [lng, lat]
    }
  }
  return null;
}

function OrderRouteCard({ order }) {
  const pickupCoords = extractCoords(order.pickup_coords, order.pickup_map_url);
  const deliveryCoords = extractCoords(
    order.delivery_coords,
    order.drop_map_url || order.delivery_map_url
  );

  return (
    <section className="order-details-card order-route-card">
      <div className="order-details-card-heading">
        <div>
          <span className="order-details-card-eyebrow">
            ROUTE
          </span>

          <h2>Pickup & Delivery</h2>
        </div>
      </div>

      <OrderRouteMap
        pickupCity={order.pickup}
        deliveryCity={order.delivery}
        pickupCoords={pickupCoords}
        deliveryCoords={deliveryCoords}
        pickupLabel={order.pickup_address || order.pickup}
        deliveryLabel={order.delivery_address || order.delivery}
        liveLocation={order.live_location}
      />

      <div className="order-route-details">
        <div className="order-route-point">
          <span className="order-route-marker pickup" />

          <div>
            <span className="order-route-label">
              PICKUP
            </span>

            <strong>{order.pickup}</strong>

            <p>{order.pickup_address || `${order.pickup} pickup location`}</p>

            {order.pickup_map_url && (
              <a
                href={order.pickup_map_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#38bdf8",
                  marginTop: "0.35rem",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <span>View on Google Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>

        <div className="order-route-connector" />

        <div className="order-route-point">
          <span className="order-route-marker delivery" />

          <div>
            <span className="order-route-label">
              DELIVERY
            </span>

            <strong>{order.delivery}</strong>

            <p>{order.delivery_address || `${order.delivery} delivery location`}</p>

            {(order.drop_map_url || order.delivery_map_url) && (
              <a
                href={order.drop_map_url || order.delivery_map_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#38bdf8",
                  marginTop: "0.35rem",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <span>View on Google Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderRouteCard;