
function NotificationsHeader({ unreadCount, onMarkAllAsRead }) {
  return (
    <section className="notifications-page-header">
      <div className="notifications-breadcrumb">
        <span>Dashboard</span>
        <span aria-hidden="true">/</span>
        <strong>Notifications</strong>
      </div>

      <span className="notifications-eyebrow">ACCOUNT</span>

      <div className="notifications-heading-row">
        <div>
          <h1>Notifications</h1>
          <p>
            Stay up to date with your orders, trips, and monthly statements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="notifications-mark-all-button"
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
    </section>
  );
}

export default NotificationsHeader;
