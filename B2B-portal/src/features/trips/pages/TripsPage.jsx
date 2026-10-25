import { useCallback, useEffect, useMemo, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import TripsHeader from "../components/TripsHeader";
import TripStats from "../components/TripStats";
import TripsFilters from "../components/TripsFilters";
import TripsTable from "../components/TripsTable";
import tripsApi from "../services/tripsApi";

function TripsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [driver, setDriver] = useState("All");
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripsApi.listTrips({
        status,
        driver,
        search,
      });
      setTripsList(data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail || err?.message || "Failed to load trips."
      );
    } finally {
      setLoading(false);
    }
  }, [status, driver, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrips();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchTrips]);

  // Extract unique drivers from company's trips
  const availableDrivers = useMemo(() => {
    const driverSet = new Set();
    tripsList.forEach((t) => {
      if (t.driver) {
        driverSet.add(t.driver);
      }
    });
    if (tripsList.some((t) => !t.driver || t.driver === "Not Assigned")) {
      driverSet.add("Not Assigned");
    }
    return Array.from(driverSet).sort();
  }, [tripsList]);

  // Dynamically compute KPI stats from the company's trips
  const computedStats = useMemo(() => {
    const total = tripsList.length;
    let unassigned = 0;
    let assigned = 0;
    let ongoing = 0;
    let completed = 0;

    tripsList.forEach((trip) => {
      const s = String(trip.status || "").toLowerCase();
      if (s === "unassigned") {
        unassigned += 1;
      } else if (s === "assigned") {
        assigned += 1;
      } else if (s === "ongoing") {
        ongoing += 1;
      } else if (s === "completed" || s === "closed") {
        completed += 1;
      }
    });

    return [
      {
        label: "Total Trips",
        value: total,
        description: "All trips generated",
        type: "total",
      },
      {
        label: "Unassigned",
        value: unassigned,
        description: "Awaiting driver assignment",
        type: "unassigned",
      },
      {
        label: "Assigned",
        value: assigned,
        description: "Driver assigned",
        type: "assigned",
      },
      {
        label: "Ongoing",
        value: ongoing,
        description: "Currently in progress",
        type: "ongoing",
      },
      {
        label: "Completed",
        value: completed,
        description: "Successfully closed",
        type: "completed",
      },
    ];
  }, [tripsList]);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page">
        <DashboardTopbar />

        <div className="trips-content">
          <TripsHeader />

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
                onClick={fetchTrips}
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

          <TripStats stats={computedStats} />

          <TripsFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            driver={driver}
            setDriver={setDriver}
            availableDrivers={availableDrivers}
          />

          <TripsTable trips={tripsList} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default TripsPage;