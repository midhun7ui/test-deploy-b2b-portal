function OrdersFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <section className="orders-filters">
      <div className="orders-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by Order ID, route or location..."
          aria-label="Search orders"
        />
      </div>

      <div className="orders-filter-row">
        <label className="orders-filter-field">
          <span>Status</span>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>

        <label className="orders-filter-field">
          <span>Pickup City</span>

          <select defaultValue="All">
            <option value="All">All cities</option>
            <option value="Kochi">Kochi</option>
            <option value="Kozhikode">Kozhikode</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Kollam">Kollam</option>
          </select>
        </label>

        <label className="orders-filter-field">
          <span>Delivery City</span>

          <select defaultValue="All">
            <option value="All">All cities</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Kochi">Kochi</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </label>

        <label className="orders-filter-field">
          <span>Date</span>

          <input type="date" />
        </label>

        <button
          type="button"
          className="orders-reset-button"
          onClick={() => {
            setSearch("");
            setStatus("All");
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default OrdersFilters;