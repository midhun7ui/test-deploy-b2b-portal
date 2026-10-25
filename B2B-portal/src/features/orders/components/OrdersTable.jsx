
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrdersTable({ orders = [], loading = false }) {
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const menuRefs = useRef({});

  useEffect(() => {
    function handleOutsideClick(event) {
      const clickedInsideMenu = Object.values(menuRefs.current).some(
        (element) => element?.contains(event.target)
      );

      if (!clickedInsideMenu) {
        setOpenMenuId(null);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function openOrderDetails(order) {
    setOpenMenuId(null);
    navigate(`/orders/${order.id}`);
  }

  function canTrackTrip(order) {
    return Boolean(
      order.tripId ||
      ["ongoing", "assigned", "completed", "closed"].includes(
        String(order.status || "").toLowerCase()
      )
    );
  }

  function trackTrip(order) {
    setOpenMenuId(null);

    if (order.tripId) {
      navigate(`/trips/${order.tripId}`);
      return;
    }

    navigate("/trips");
  }

  async function copyOrderId(order) {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopyMessage(`${order.id} copied`);
    } catch {
      setCopyMessage("Unable to copy. Please copy the Order ID manually.");
    }

    setOpenMenuId(null);
  }

  return (
    <section className="orders-table-panel">
      <div className="orders-table-header">
        <div>
          <span className="orders-table-eyebrow">ORDER HISTORY</span>

          <h2>
            All Orders
            <span>{orders.length}</span>
          </h2>
        </div>
      </div>

      {copyMessage && (
        <div className="orders-copy-message" role="status">
          {copyMessage}
          <button
            type="button"
            onClick={() => setCopyMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Route</th>
              <th>Cargo</th>
              <th>Vehicle</th>
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
                    padding: "2.5rem 1rem",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "2.5rem 1rem",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  No orders found matching your criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <button
                    type="button"
                    className="orders-id-button"
                    onClick={() => openOrderDetails(order)}
                  >
                    {order.id}
                  </button>
                </td>

                <td>
                  <div className="orders-route">
                    <strong>
                      {order.pickup} → {order.delivery}
                    </strong>

                    <span>
                      {order.pickup} → {order.delivery}
                    </span>
                  </div>
                </td>

                <td>
                  <span className="orders-table-text">
                    {order.cargo}
                  </span>
                </td>

                <td>
                  <span className="orders-table-text">
                    {order.vehicle}
                  </span>
                </td>

                <td>
                  <span className="orders-table-muted">
                    {order.pickupDate}
                  </span>
                </td>

                <td>
                  <span className="orders-table-muted">
                    {order.deliveryDate}
                  </span>
                </td>

                <td>
                  <span
                    className={`orders-status orders-status-${String(
                      order.status
                    ).toLowerCase()}`}
                  >
                    <span className="orders-status-dot" />
                    {order.status}
                  </span>
                </td>

                <td>
                  <strong className="orders-amount">
                    {order.amount}
                  </strong>
                </td>

                <td>
                  <div
                    className="orders-row-action-wrapper"
                    ref={(element) => {
                      if (element) {
                        menuRefs.current[order.id] = element;
                      } else {
                        delete menuRefs.current[order.id];
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="orders-row-action"
                      aria-label={`Actions for ${order.id}`}
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === order.id}
                      onClick={() => {
                        setCopyMessage("");
                        setOpenMenuId((current) =>
                          current === order.id ? null : order.id
                        );
                      }}
                    >
                      <span />
                      <span />
                      <span />
                    </button>

                    {openMenuId === order.id && (
                      <div className="orders-row-action-menu" role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => openOrderDetails(order)}
                        >
                          <span aria-hidden="true">↗</span>
                          View details
                        </button>

                        {canTrackTrip(order) && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => trackTrip(order)}
                          >
                            <span aria-hidden="true">→</span>
                            Track trip
                          </button>
                        )}

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => copyOrderId(order)}
                        >
                          <span aria-hidden="true">▢</span>
                          Copy Order ID
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      <div className="orders-table-footer">
        <span>Showing 1–{orders.length} of 128 orders</span>

        <div className="orders-pagination">
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

          <button type="button">26</button>

          <button type="button">›</button>
        </div>
      </div>
    </section>
  );
}

export default OrdersTable;
