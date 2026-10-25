function TripsHeader() {
  return (
    <section className="trips-header">
      <div className="trips-header-content">
        <div className="trips-breadcrumb">
          <span>Dashboard</span>
          <span className="trips-breadcrumb-separator">
            /
          </span>
          <strong>Trips</strong>
        </div>

        <span className="trips-eyebrow">
          OPERATIONS
        </span>

        <h1>Trips</h1>

        <p>
          Track and manage your active and completed trips.
        </p>
      </div>
    </section>
  );
}

export default TripsHeader;