function TripsFilters({
  search,
  setSearch,
  status,
  setStatus,
  driver,
  setDriver,
  availableDrivers = [],
}) {
  const driverOptions = availableDrivers.length > 0
    ? availableDrivers
    : [
        "Rahul Kumar",
        "Arun Das",
        "Vishnu Raj",
        "Sanjay M",
        "Akhil P",
        "Manu Joseph",
        "Not Assigned",
      ];

  return (
    <section className="trips-filters">
      <div className="trips-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by Trip ID, Order ID or route..."
          aria-label="Search trips"
        />
      </div>

      <div className="trips-filter-row">
        <label className="trips-filter-field">
          <span>Status</span>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="All">All statuses</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Assigned">Assigned</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label className="trips-filter-field">
          <span>Driver</span>

          <select
            value={driver}
            onChange={(event) =>
              setDriver(event.target.value)
            }
          >
            <option value="All">All drivers</option>
            {driverOptions.map((driverName) => (
              <option key={driverName} value={driverName}>
                {driverName}
              </option>
            ))}
          </select>
        </label>

        <label className="trips-filter-field">
          <span>Pickup City</span>

          <select defaultValue="All">
            <option value="All">All cities</option>
            <option value="Kochi">Kochi</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Kollam">Kollam</option>
            <option value="Kannur">Kannur</option>
            <option value="Palakkad">Palakkad</option>
            <option value="Kozhikode">
              Kozhikode
            </option>
            <option value="Alappuzha">
              Alappuzha
            </option>
          </select>
        </label>

        <label className="trips-filter-field">
          <span>Date</span>

          <input type="date" />
        </label>

        <button
          type="button"
          className="trips-reset-button"
          onClick={() => {
            setSearch("");
            setStatus("All");
            setDriver("All");
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default TripsFilters;