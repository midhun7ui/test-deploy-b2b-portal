
function ReportsFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
  onReset,
}) {
  return (
    <section className="reports-filters" aria-label="Filter reports">
      <div className="reports-search">
        <span className="reports-search-icon" aria-hidden="true">
          ⌕
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search report ID or reporting period..."
          aria-label="Search reports"
        />
      </div>

      <div className="reports-filter-actions">
        <select
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          aria-label="Filter by year"
        >
          <option value="all">All years</option>

          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}

export default ReportsFilters;
