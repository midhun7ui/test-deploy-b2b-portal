import { useNavigate } from "react-router-dom";

function NotificationsList({ notifications, onMarkAsRead, loading = false }) {
  const navigate = useNavigate();

  const openNotification = (notification) => {
    onMarkAsRead(notification.id);
    navigate(notification.link);
  };

  return (
    <section className="notifications-list-card">
      <div className="notifications-list-heading">
        <h2>Activity updates</h2>
        <span>
          {notifications.length}{" "}
          {notifications.length === 1 ? "notification" : "notifications"}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
          <div
            className="spinner"
            style={{
              margin: "0 auto 1rem auto",
              width: "24px",
              height: "24px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#0284c7",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Loading activity updates...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty-state">
          <span className="notifications-empty-icon" aria-hidden="true">
            ✓
          </span>
          <h3>No notifications found</h3>
          <p>Try another filter or search term.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`notifications-page-item ${
                notification.read ? "is-read" : "is-unread"
              }`}
            >
              <span
                className={`notifications-page-type notifications-page-type-${notification.type}`}
                aria-hidden="true"
              >
                {notification.type === "order" && "O"}
                {notification.type === "trip" && "T"}
                {notification.type === "statement" && "₹"}
                {notification.type !== "order" &&
                  notification.type !== "trip" &&
                  notification.type !== "statement" &&
                  "!"}
              </span>

              <button
                type="button"
                className="notifications-page-content"
                onClick={() => openNotification(notification)}
              >
                <strong>{notification.title}</strong>
                <span>{notification.message}</span>
                <small>{notification.createdAt}</small>
              </button>

              <div className="notifications-page-actions">
                {!notification.read && (
                  <>
                    <span className="notifications-page-unread-dot" />
                    <button
                      type="button"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default NotificationsList;
