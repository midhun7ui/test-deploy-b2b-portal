
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser, clearCurrentUser } from "../../auth/authState";
import { useNotifications } from "../../notifications/NotificationContext";

function DashboardTopbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const initials =
    user?.username?.slice(0, 2)?.toUpperCase() || "PT";

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openNotification = (notification) => {
    markAsRead(notification.id);
    setIsNotificationOpen(false);
    navigate(notification.link);
  };

  function openProfileDestination(path) {
    setIsProfileOpen(false);
    navigate(path);
  }

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-context">
        <span className="dashboard-topbar-label">
          B2B PARTNER PORTAL
        </span>
      </div>

      <div className="dashboard-topbar-actions">
        <div
          className="dashboard-notification-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className="dashboard-icon-button"
            aria-label={`Notifications${
              unreadCount ? `, ${unreadCount} unread` : ""
            }`}
            aria-expanded={isNotificationOpen}
            aria-haspopup="dialog"
            onClick={() => {
              setIsProfileOpen(false);
              setIsNotificationOpen((open) => !open);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
              <path d="M10 21h4" />
            </svg>

            {unreadCount > 0 && (
              <span className="notification-dot" />
            )}
          </button>

          {isNotificationOpen && (
            <section
              className="notification-popover"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="notification-popover-header">
                <div>
                  <h2>Notifications</h2>
                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount === 1 ? "" : "s"
                        }`
                      : "You're all caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notification-mark-all"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="notification-popover-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <article
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? "is-read" : "is-unread"
                      }`}
                    >
                      <button
                        type="button"
                        className="notification-item-content"
                        onClick={() => openNotification(notification)}
                      >
                        <span
                          className={`notification-type-icon notification-type-${notification.type}`}
                          aria-hidden="true"
                        >
                          {notification.type === "order" && "O"}
                          {notification.type === "trip" && "T"}
                          {notification.type === "statement" && "₹"}
                        </span>

                        <span className="notification-item-copy">
                          <strong>{notification.title}</strong>
                          <span>{notification.message}</span>
                          <small>{notification.createdAt}</small>
                        </span>

                        {!notification.read && (
                          <span
                            className="notification-unread-indicator"
                            aria-label="Unread"
                          />
                        )}
                      </button>

                      {!notification.read && (
                        <button
                          type="button"
                          className="notification-mark-read"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </button>
                      )}
                    </article>
                  ))
                ) : (
                  <div className="notification-empty">
                    <strong>No notifications yet</strong>
                    <span>
                      Updates about your orders and trips will appear here.
                    </span>
                  </div>
                )}
              </div>

              <div className="notification-popover-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationOpen(false);
                    navigate("/notifications");
                  }}
                >
                  View all notifications
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="dashboard-topbar-divider" />

        <div className="dashboard-profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="dashboard-profile-button"
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            onClick={() => {
              setIsNotificationOpen(false);
              setIsProfileOpen((open) => !open);
            }}
          >
            <span className="dashboard-profile-avatar">
              {initials}
            </span>

            <span className="dashboard-profile-info">
              <strong>{user?.username || "Partner"}</strong>
              <small>B2B Partner</small>
            </span>

            <svg
              className={`dashboard-profile-chevron ${
                isProfileOpen ? "is-open" : ""
              }`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m7 10 5 5 5-5" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="dashboard-profile-menu" role="menu">
              <div className="dashboard-profile-menu-header">
                <span className="dashboard-profile-avatar">
                  {initials}
                </span>

                <div>
                  <strong>{user?.username || "Partner"}</strong>
                  <small>B2B Partner Account</small>
                </div>
              </div>

              <div className="dashboard-profile-menu-divider" />

              <button
                type="button"
                className="dashboard-profile-menu-item"
                role="menuitem"
                onClick={() => openProfileDestination("/company")}
              >
                <span aria-hidden="true">▦</span>
                <span>Company Profile</span>
              </button>

              <button
                type="button"
                className="dashboard-profile-menu-item"
                role="menuitem"
                onClick={() => openProfileDestination("/settings")}
              >
                <span aria-hidden="true">⚙</span>
                <span>Settings</span>
              </button>

              <div className="dashboard-profile-menu-divider" />

              <button
                type="button"
                className="dashboard-profile-menu-item dashboard-profile-logout"
                role="menuitem"
                onClick={() => {
                  setIsProfileOpen(false);
                  clearCurrentUser();
                  navigate("/");
                }}
              >
                <span aria-hidden="true">↪</span>
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardTopbar;
