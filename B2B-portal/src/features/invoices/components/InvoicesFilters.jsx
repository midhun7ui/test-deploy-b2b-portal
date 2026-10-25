function InvoicesFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
  onReset,
}) {
  return (
    <section className="invoices-filters">
      <div className="invoices-search">
        <span aria-hidden="true">⌕</span>

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search statement ID or reporting period..."
          aria-label="Search statements"
        />
      </div>

      <div className="invoices-filter-actions">
        <select
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          aria-label="Filter statements by year"
        >
          <option value="All">All years</option>

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

export default InvoicesFilters;