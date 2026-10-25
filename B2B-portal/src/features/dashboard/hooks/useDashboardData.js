import { useCallback, useEffect, useState } from "react";
import dashboardApi from "../services/dashboardApi";

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState({
    total_orders: 0,
    pending_orders: 0,
    accepted_orders: 0,
    rejected_orders: 0,
    ongoing_trips: 0,
    completed_trips: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setError(null);
    }

    try {
      const [summaryRes, ordersRes, tripsRes, activityRes] =
        await Promise.allSettled([
          dashboardApi.getSummary(),
          dashboardApi.getRecentOrders(),
          dashboardApi.getActiveTrips(),
          dashboardApi.getActivity(),
        ]);

      if (summaryRes.status === "fulfilled") {
        setSummary(summaryRes.value);
      }
      if (ordersRes.status === "fulfilled") {
        setRecentOrders(ordersRes.value || []);
      }
      if (tripsRes.status === "fulfilled") {
        setActiveTrips(tripsRes.value || []);
      }
      if (activityRes.status === "fulfilled") {
        setActivities(activityRes.value || []);
      }

      // If all rejected, set general error
      const allRejected =
        summaryRes.status === "rejected" &&
        ordersRes.status === "rejected" &&
        tripsRes.status === "rejected";

      if (allRejected && isInitial) {
        setError(summaryRes.reason?.message || "Failed to load dashboard data.");
      } else if (!allRejected) {
        setError(null);
      }
    } catch (err) {
      if (isInitial) {
        setError(err?.message || "An unexpected error occurred while loading dashboard.");
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData(true);

    const pollInterval = setInterval(() => {
      fetchData(false);
    }, 4500);

    return () => clearInterval(pollInterval);
  }, [fetchData]);

  const stats = [
    {
      label: "Total Orders",
      value: summary?.total_orders ?? 0,
      description: "All orders submitted",
    },
    {
      label: "Pending Orders",
      value: summary?.pending_orders ?? 0,
      description: "Awaiting acceptance",
    },
    {
      label: "Accepted Orders",
      value: summary?.accepted_orders ?? 0,
      description: "Orders accepted",
    },
    {
      label: "Rejected Orders",
      value: summary?.rejected_orders ?? 0,
      description: "Orders rejected",
    },
    {
      label: "Ongoing Trips",
      value: summary?.ongoing_trips ?? 0,
      description: "Currently in progress",
    },
    {
      label: "Completed Trips",
      value: summary?.completed_trips ?? 0,
      description: "Successfully closed",
    },
  ];

  return {
    loading,
    error,
    stats,
    recentOrders,
    activeTrips,
    activities,
    refresh: fetchData,
  };
}

export default useDashboardData;
