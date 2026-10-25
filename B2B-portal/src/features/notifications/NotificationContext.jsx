import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { notificationsApi } from "./services/notificationsApi";
import { initialNotifications } from "./data/notificationsMockData";
import { getCurrentUser } from "../auth/authState";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    initialNotifications.map((notification) => ({ ...notification }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await notificationsApi.getNotifications(params);
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.warn("Failed to load notifications from backend, using fallback:", err);
      setError(err?.response?.data?.detail || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (notificationId) => {
    // Optimistic UI update
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    try {
      await notificationsApi.markAsRead(notificationId);
    } catch (err) {
      console.warn("Failed to mark notification read on backend:", err);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic UI update
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.warn("Failed to mark all notifications read on backend:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }

  return context;
}
