import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Notifications.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const notificationsApi = {
  /**
   * Retrieve notifications and unread count for the authenticated partner's company.
   * @param {Object} [params]
   * @param {string} [params.filter] - "all" | "unread" | "read"
   * @param {string} [params.search] - Search keyword matching title or message
   * @returns {Promise<{ notifications: Array, unread_count: number }>}
   */
  async getNotifications(params = {}) {
    const cleanParams = {};
    if (params.filter && params.filter !== "all") {
      cleanParams.filter = params.filter;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/partner/notifications/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Mark an individual notification as read.
   * @param {string|number} notificationId
   * @returns {Promise<Object>}
   */
  async markAsRead(notificationId) {
    const response = await apiClient.post(
      `/api/v1/partner/notifications/${notificationId}/read/`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read for the partner company.
   * @returns {Promise<{ message: string, unread_count: number }>}
   */
  async markAllAsRead() {
    const response = await apiClient.post(
      "/api/v1/partner/notifications/read-all/"
    );
    return response.data;
  },
};

export default notificationsApi;
