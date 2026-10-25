import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import OrderRouteMap from "../../orders/components/OrderRouteMap";
import tripsApi from "../services/tripsApi";

function TripDetailsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTrip(isInitial = false) {
      if (!tripId) return;
      if (isInitial) {
        setLoading(true);
        setError(null);
      }
      try {
        const data = await tripsApi.getTripDetails(tripId);
        if (isMounted) {
          setTrip(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted && isInitial) {
          setError(
            err?.response?.data?.detail || "Trip not found or access denied."
          );
        }
      } finally {
        if (isMounted && isInitial) {
          setLoading(false);
        }
      }
    }

    fetchTrip(true);

    const pollTimer = setInterval(() => {
      fetchTrip(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, [tripId]);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <DashboardSidebar />

        <main className="dashboard-page trip-details-page">
          <DashboardTopbar />

          <section
            className="trip-details-not-found"
            style={{ textAlign: "center", padding: "4rem 2rem" }}
          >
            <h2>Loading trip details...</h2>
            <p>Fetching specifications and live progress for {tripId}.</p>
          </section>
        </main>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="dashboard-shell">
        <DashboardSidebar />

        <main className="dashboard-page trip-details-page">
          <DashboardTopbar />

          <section className="trip-details-not-found">
            <h1>Trip not found</h1>
            <p>{error || `We couldn't find trip ${tripId}.`}</p>

            <button
              type="button"
              onClick={() => navigate("/trips")}
            >
              Back to Trips
            </button>
          </section>
        </main>
      </div>
    );
  }

  const isCompleted = trip.status === "Completed" || trip.status === "Closed";
  const isOngoing = trip.status === "Ongoing";
  const isAssigned = trip.status !== "Unassigned";

  const timelineSteps = [
    {
      label: "Assigned",
      description: "Driver assigned",
      completed: isAssigned,
    },
    {
      label: "Ongoing",
      description: "Trip started",
      completed: isOngoing || isCompleted,
    },
    {
      label: "Closed",
      description: "Trip completed",
      completed: isCompleted,
    },
  ];

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trip-details-page">
        <DashboardTopbar />

        <div className="trip-details-content">
          <header className="trip-details-header">
            <button
              type="button"
              className="trip-details-back"
              onClick={() => navigate("/trips")}
            >
              <span aria-hidden="true">←</span>
              Back to Trips
            </button>

            <div className="trip-details-title-row">
              <div>
                <span className="trip-details-eyebrow">
                  TRIP DETAILS
                </span>

                <h1>{trip.id}</h1>

                <p>
                  Linked order{" "}
                  <button
                    type="button"
                    className="trip-linked-order"
                    onClick={() =>
                      navigate(`/orders/${trip.orderId}`)
                    }
                  >
                    {trip.orderId}
                  </button>
                </p>
              </div>

              <span
                className={`trip-details-status trip-details-status-${trip.status.toLowerCase()}`}
              >
                <span />
                {trip.status}
              </span>
            </div>
          </header>

          {trip.delivery_otp && (
            <section
              className="trip-details-card"
              style={{
                border: "1.5px solid #86EFAC",
                background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                borderRadius: "16px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      letterSpacing: "0.08em",
                      color: "#15803D",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    DELIVERY VERIFICATION CODE (PRD §5.4 / D-09)
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: "800",
                      color: "#14532D",
                    }}
                  >
                    Partner Drop-off OTP
                  </h3>
                  <p
                    style={{
                      margin: "0.25rem 0 0",
                      fontSize: "0.875rem",
                      color: "#166534",
                    }}
                  >
                    Provide this 6-digit code to the assigned driver upon arrival at destination to verify delivery and close trip.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "#FFFFFF",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "12px",
                    border: "2px dashed #16A34A",
                    boxShadow: "0 2px 8px rgba(22, 163, 74, 0.12)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "900",
                      letterSpacing: "0.2em",
                      fontFamily: "monospace",
                      color: "#15803D",
                    }}
                  >
                    {trip.delivery_otp}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      background: "#DCFCE7",
                      color: "#166534",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                    }}
                    onClick={() => {
                      navigator.clipboard?.writeText(trip.delivery_otp);
                      alert(`Copied Delivery OTP: ${trip.delivery_otp}`);
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="trip-details-card">
            <div className="trip-details-card-heading">
              <div>
                <span className="trip-details-card-eyebrow">
                  TRIP PROGRESS
                </span>
                <h2>Status Timeline</h2>
              </div>
            </div>

            <div className="trip-details-timeline">
              {timelineSteps.map((step, index) => (
                <div
                  className="trip-timeline-step"
                  key={step.label}
                >
                  <div
                    className={`trip-timeline-marker ${
                      step.completed ? "completed" : ""
                    }`}
                  >
                    {step.completed ? "✓" : index + 1}
                  </div>

                  <div className="trip-timeline-copy">
                    <strong>{step.label}</strong>
                    <span>{step.description}</span>
                  </div>

                  {index < timelineSteps.length - 1 && (
                    <span
                      className={`trip-timeline-line ${
                        step.completed ? "completed" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="trip-details-card">
            <div className="trip-details-card-heading">
              <div>
                <span className="trip-details-card-eyebrow">
                  ROUTE
                </span>
                <h2>Pickup & Delivery</h2>
              </div>
            </div>

            <OrderRouteMap
              pickupCity={trip.pickup}
              deliveryCity={trip.delivery}
              pickupCoords={
                trip.pickup_coords ||
                (trip.pickup_map_url?.match(/[?&]q=([0-9.-]+),([0-9.-]+)/)
                  ? [parseFloat(trip.pickup_map_url.match(/[?&]q=([0-9.-]+),([0-9.-]+)/)[2]), parseFloat(trip.pickup_map_url.match(/[?&]q=([0-9.-]+),([0-9.-]+)/)[1])]
                  : null)
              }
              deliveryCoords={
                trip.delivery_coords ||
                ((trip.drop_map_url || trip.delivery_map_url)?.match(/[?&]q=([0-9.-]+),([0-9.-]+)/)
                  ? [parseFloat((trip.drop_map_url || trip.delivery_map_url).match(/[?&]q=([0-9.-]+),([0-9.-]+)/)[2]), parseFloat((trip.drop_map_url || trip.delivery_map_url).match(/[?&]q=([0-9.-]+),([0-9.-]+)/)[1])]
                  : null)
              }
              pickupLabel={trip.pickup}
              deliveryLabel={trip.delivery}
              liveLocation={trip.live_location}
            />

            <div className="trip-route-summary">
              <div>
                <span className="trip-route-point pickup" />
                <div>
                  <span>PICKUP</span>
                  <strong>{trip.pickup}</strong>
                  {trip.pickup_map_url && (
                    <a
                      href={trip.pickup_map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                        color: "#38bdf8",
                        marginTop: "0.25rem",
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

              <span className="trip-route-arrow">→</span>

              <div>
                <span className="trip-route-point delivery" />
                <div>
                  <span>DELIVERY</span>
                  <strong>{trip.delivery}</strong>
                  {(trip.drop_map_url || trip.delivery_map_url) && (
                    <a
                      href={trip.drop_map_url || trip.delivery_map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                        color: "#38bdf8",
                        marginTop: "0.25rem",
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

          <div className="trip-details-grid">
            <section className="trip-details-card">
              <div className="trip-details-card-heading">
                <div>
                  <span className="trip-details-card-eyebrow">
                    ASSIGNMENT
                  </span>
                  <h2>Driver Details</h2>
                </div>
              </div>

              <div className="trip-driver-card">
                <div className="trip-driver-avatar">
                  {!trip.driver || trip.driver === "Not Assigned"
                    ? "—"
                    : trip.driver
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                </div>

                <div>
                  <strong>{trip.driver || "Not Assigned"}</strong>
                  <span>
                    {!trip.driver || trip.driver === "Not Assigned"
                      ? "Awaiting driver assignment"
                      : "Assigned driver"}
                  </span>
                </div>
              </div>

              <InfoRow
                label="Vehicle"
                value={trip.vehicle || "See linked order"}
              />
              <InfoRow
                label="Cargo Type"
                value={trip.cargo || "General Cargo"}
              />
              {trip.driver_phone && (
                <InfoRow
                  label="Driver Phone"
                  value={trip.driver_phone}
                />
              )}
            </section>

            <section className="trip-details-card">
              <div className="trip-details-card-heading">
                <div>
                  <span className="trip-details-card-eyebrow">
                    TRIP INFORMATION
                  </span>
                  <h2>Shipment Details</h2>
                </div>
              </div>

              <InfoRow label="Trip ID" value={trip.id} />
              <InfoRow label="Order ID" value={trip.orderId} />
              <InfoRow label="Pickup Date" value={trip.pickupDate || "—"} />
              <InfoRow
                label="Expected Delivery"
                value={trip.deliveryDate || "—"}
              />
              <InfoRow label="Trip Amount" value={trip.amount} />
            </section>
          </div>

          <section className="trip-details-card trip-report-card">
            <div className="trip-details-card-heading">
              <div>
                <span className="trip-details-card-eyebrow">
                  DOCUMENTATION
                </span>
                <h2>Trip Report</h2>
              </div>

              <span
                className={`trip-report-status ${
                  isCompleted ? "available" : ""
                }`}
              >
                {isCompleted ? "Completed trip" : "Awaiting closure"}
              </span>
            </div>

            {isCompleted ? (
              <p>
                This trip is marked completed. The trip report will
                appear here when the backend makes it available.
              </p>
            ) : (
              <p>
                The trip report becomes available after the trip is
                closed and the report has been generated.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="trip-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default TripDetailsPage;
