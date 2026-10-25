import { useCallback, useEffect, useMemo, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import OrdersHeader from "../components/OrdersHeader";
import OrderStats from "../components/OrderStats";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import ordersApi from "../services/ordersApi";

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setError(null);
    }
    try {
      const data = await ordersApi.listOrders({
        status,
        search,
      });
      setOrdersList(data || []);
      setError(null);
    } catch (err) {
      if (isInitial) {
        setError(err?.response?.data?.detail || err?.message || "Failed to load orders.");
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(true);
    }, 250);

    const pollInterval = setInterval(() => {
      fetchOrders(false);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearInterval(pollInterval);
    };
  }, [fetchOrders]);

  // Dynamically compute KPI stats from the company's orders
  const computedStats = useMemo(() => {
    const total = ordersList.length;
    let pending = 0;
    let accepted = 0;
    let ongoing = 0;
    let rejected = 0;

    ordersList.forEach((order) => {
      const s = String(order.status || "").toLowerCase();
      if (s === "pending" || s === "received") {
        pending += 1;
      } else if (s === "accepted") {
        accepted += 1;
      } else if (s === "ongoing") {
        ongoing += 1;
      } else if (s === "rejected") {
        rejected += 1;
      }
      if (order.tripId) {
        ongoing += 1;
      }
    });

    return [
      {
        label: "Total Orders",
        value: total,
        description: "All orders submitted",
        type: "total",
      },
      {
        label: "Pending",
        value: pending,
        description: "Awaiting acceptance",
        type: "pending",
      },
      {
        label: "Accepted",
        value: accepted,
        description: "Orders accepted",
        type: "accepted",
      },
      {
        label: "Ongoing",
        value: ongoing,
        description: "Trips in progress",
        type: "ongoing",
      },
      {
        label: "Rejected",
        value: rejected,
        description: "Orders rejected",
        type: "rejected",
      },
    ];
  }, [ordersList]);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page orders-page">
        <DashboardTopbar />

        <div className="orders-content">
          <OrdersHeader />

          {error && (
            <div
              role="alert"
              style={{
                margin: "0 0 1.5rem 0",
                padding: "0.875rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.875rem",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchOrders}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #f87171",
                  color: "#f87171",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </div>
          )}

          <OrderStats stats={computedStats} />

          <OrdersFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />

          <OrdersTable orders={ordersList} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default OrdersPage;