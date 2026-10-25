import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import OrderDetailsHeader from "../components/OrderDetailsHeader";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import OrderRouteCard from "../components/OrderRouteCard";
import OrderInformation from "../components/OrderInformation";
import ordersApi from "../services/ordersApi";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrder(isInitial = false) {
      if (!orderId) return;
      if (isInitial) {
        setLoading(true);
        setError(null);
      }
      try {
        const data = await ordersApi.getOrderDetails(orderId);
        if (isMounted) {
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted && isInitial) {
          setError(err?.response?.data?.detail || "Order not found or access denied.");
        }
      } finally {
        if (isMounted && isInitial) {
          setLoading(false);
        }
      }
    }

    fetchOrder(true);

    const pollTimer = setInterval(() => {
      fetchOrder(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <DashboardSidebar />

        <main className="dashboard-page order-details-page">
          <DashboardTopbar />

          <div className="order-details-content">
            <section
              className="order-details-not-found"
              style={{ textAlign: "center", padding: "4rem 2rem" }}
            >
              <h2>Loading order details...</h2>
              <p>Fetching specifications and trip tracking for {orderId}.</p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="dashboard-shell">
        <DashboardSidebar />

        <main className="dashboard-page order-details-page">
          <DashboardTopbar />

          <div className="order-details-content">
            <section className="order-details-not-found">
              <h1>Order not found</h1>

              <p>
                We couldn't find an order with ID{" "}
                <strong>{orderId}</strong>.
              </p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page order-details-page">
        <DashboardTopbar />

        <div className="order-details-content">
          <OrderDetailsHeader order={order} />

          <OrderStatusTimeline order={order} status={order.status} />

          <div className="order-details-grid">
            <OrderRouteCard order={order} />

            <OrderInformation order={order} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderDetailsPage;