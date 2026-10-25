import { useNavigate } from "react-router-dom";

function OrdersHeader() {
  const navigate = useNavigate();

  return (
    <section className="orders-header">
      <div className="orders-header-content">
        <div className="orders-breadcrumb">
          <span>Dashboard</span>
          <span className="orders-breadcrumb-separator">/</span>
          <strong>Orders</strong>
        </div>

        <span className="orders-eyebrow">
          OPERATIONS
        </span>

        <h1>Orders</h1>

        <p>Create and manage your transport orders.</p>
      </div>

      <button
        type="button"
        className="orders-create-button"
        onClick={() => navigate("/orders/create")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>

        <span>Create Order</span>
      </button>
    </section>
  );
}

export default OrdersHeader;