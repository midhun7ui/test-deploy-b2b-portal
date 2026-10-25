
function NotificationFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  unreadCount,
}) {
  return (
    <section className="notifications-toolbar">
      <div className="notifications-filter-tabs" aria-label="Notification filter">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => onFilterChange("all")}
        >
          All
        </button>

        <button
          type="button"
          className={filter === "unread" ? "active" : ""}
          onClick={() => onFilterChange("unread")}
        >
          Unread
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </button>

        <button
          type="button"
          className={filter === "read" ? "active" : ""}
          onClick={() => onFilterChange("read")}
        >
          Read
        </button>
      </div>

      <label className="notifications-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search notifications..."
          aria-label="Search notifications"
        />
      </label>
    </section>
  );
}

export default NotificationFilters;
