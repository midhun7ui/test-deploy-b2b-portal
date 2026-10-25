import { useNavigate } from "react-router-dom";

function RecentOrders({ orders = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <p className="panel-eyebrow">ORDERS</p>
          <h2>Recent Orders</h2>
        </div>

        <button
          type="button"
          className="panel-action"
          onClick={() => navigate("/orders")}
        >
          View all
        </button>
      </div>

      <div className="orders-list">
        {loading ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
            Loading recent orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted, #94a3b8)", textAlign: "center" }}>
            No recent orders found.
          </div>
        ) : (
          orders.map((order) => {
            const displayId = order.order_id || (typeof order.id === "number" ? `ORD-${order.id}` : order.id);
            const statusClass = (order.status || "pending").toLowerCase();

            return (
              <article className="order-row" key={order.id || displayId}>
                <div className="order-main">
                  <strong>{displayId}</strong>
                  <span>{order.route}</span>
                </div>

                <div className="order-meta">
                  <span>{order.date}</span>

                  <span className={`status-badge status-${statusClass}`}>
                    {order.status}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default RecentOrders;