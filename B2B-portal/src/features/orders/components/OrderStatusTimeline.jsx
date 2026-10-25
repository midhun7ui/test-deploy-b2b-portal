function OrderStatusTimeline({ order, status }) {
  const currentOrder = order || {};
  const rawStatus = currentOrder.status || status || "";
  const currentStatus = String(rawStatus).trim();
  const trip = currentOrder.trip;
  const tripId =
    currentOrder.tripId ||
    (trip?.id
      ? String(trip.id).startsWith("TRP-")
        ? trip.id
        : `TRP-${trip.id}`
      : null);
  const tripStatus = String(trip?.status || currentOrder.trip_status || "")
    .trim()
    .toLowerCase();

  const isRejected = currentStatus.toLowerCase() === "rejected";
  const isAccepted =
    isRejected ||
    currentStatus.toLowerCase() === "accepted" ||
    currentStatus.toLowerCase() === "ongoing" ||
    currentStatus.toLowerCase() === "in transit" ||
    currentStatus.toLowerCase() === "completed" ||
    currentStatus.toLowerCase() === "closed" ||
    Boolean(tripId);

  const isTripCreated =
    Boolean(tripId) ||
    ["ongoing", "in transit", "completed", "closed"].includes(
      currentStatus.toLowerCase()
    ) ||
    Boolean(tripStatus);

  const isCompleted =
    tripStatus === "closed" ||
    tripStatus === "completed" ||
    tripStatus === "delivered" ||
    currentStatus.toLowerCase() === "completed" ||
    currentStatus.toLowerCase() === "closed";

  const isOngoing =
    tripStatus === "ongoing" ||
    currentStatus.toLowerCase() === "ongoing" ||
    currentStatus.toLowerCase() === "in transit";

  const steps = [
    {
      label: "Order Received",
      description: currentOrder.pickupDate
        ? `Order submitted (${currentOrder.pickupDate})`
        : "Order submitted",
      completed: true,
    },
    {
      label: isRejected ? "Rejected" : "Accepted",
      description: isRejected
        ? currentOrder.rejection_reason || "Order was rejected"
        : "Order accepted",
      completed: isAccepted,
    },
    {
      label: "Trip Created",
      description: tripId
        ? `Trip ${tripId} generated${
            trip?.driver_name && trip.driver_name !== "Not Assigned"
              ? ` • ${trip.driver_name}`
              : ""
          }`
        : "Trip generated",
      completed: isTripCreated,
    },
    {
      label: "Completed",
      description: isCompleted
        ? "Trip completed & delivered"
        : isOngoing
        ? "In transit • Delivery in progress"
        : "Trip completed",
      completed: isCompleted,
    },
  ];

  return (
    <section className="order-details-card">
      <div className="order-details-card-heading">
        <div>
          <span className="order-details-card-eyebrow">
            ORDER PROGRESS
          </span>

          <h2>Status Timeline</h2>
        </div>
      </div>

      <div className="order-status-timeline">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={`order-status-step ${
              step.completed ? "completed" : ""
            } ${
              isRejected && index === 1 ? "rejected" : ""
            } ${
              isOngoing && index === 2 ? "active" : ""
            }`}
          >
            <div className="order-status-step-marker">
              {step.completed ? "✓" : index + 1}
            </div>

            <div className="order-status-step-content">
              <strong>{step.label}</strong>
              <span>{step.description}</span>
            </div>

            {index < steps.length - 1 && (
              <span
                className={`order-status-step-line ${
                  step.completed && steps[index + 1].completed ? "completed" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default OrderStatusTimeline;