function TripReportsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onReset,
}) {
  return (
    <section className="trip-reports-filters">
      <div className="trip-reports-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search report, trip, order, driver..."
          aria-label="Search trip reports"
        />
      </div>

      <div className="trip-reports-filter-actions">
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter reports by status"
        >
          <option value="All">All statuses</option>
          <option value="Available">Available</option>
          <option value="Awaiting Closure">Awaiting Closure</option>
        </select>

        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}

export default TripReportsFilters;