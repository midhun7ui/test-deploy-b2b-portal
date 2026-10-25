import { useMemo, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import { useNotifications } from "../NotificationContext";
import NotificationsHeader from "../components/NotificationsHeader";
import NotificationFilters from "../components/NotificationFilters";
import NotificationsList from "../components/NotificationsList";

function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.read) ||
        (filter === "read" && notification.read);

      const matchesSearch =
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        (notification.id && notification.id.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, search]);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page notifications-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content notifications-content">
          <NotificationsHeader
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
          />

          {error && (
            <div
              style={{
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => refreshNotifications()}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Retry
              </button>
            </div>
          )}

          <NotificationFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            unreadCount={unreadCount}
          />

          <NotificationsList
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default NotificationsPage;
