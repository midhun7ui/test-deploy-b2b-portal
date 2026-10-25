import apiClient from "../../../lib/apiClient";

/**
 * REST API service for B2B Partner Settings, Notification Preferences, and Security.
 * All requests automatically carry JWT credentials via apiClient.
 */
export const settingsApi = {
  /**
   * Fetch complete settings overview (Account details, notification preferences, security status).
   * @returns {Promise<{ account: Object, preferences: Object, security: Object }>}
   */
  async getSettingsOverview() {
    const response = await apiClient.get("/api/v1/partner/settings/");
    return response.data;
  },

  /**
   * Update full or partial settings (account information and/or notification preferences).
   * @param {Object} payload
   * @returns {Promise<{ account: Object, preferences: Object, security: Object }>}
   */
  async updateSettings(payload) {
    const response = await apiClient.patch("/api/v1/partner/settings/", payload);
    return response.data;
  },

  /**
   * Fetch notification preferences only.
   * @returns {Promise<Object>}
   */
  async getNotificationPreferences() {
    const response = await apiClient.get("/api/v1/partner/settings/preferences/");
    return response.data;
  },

  /**
   * Update notification preferences.
   * @param {Object} preferences
   * @returns {Promise<Object>}
   */
  async updateNotificationPreferences(preferences) {
    const response = await apiClient.patch(
      "/api/v1/partner/settings/preferences/",
      preferences
    );
    return response.data;
  },

  /**
   * Update partner account profile (displayName/full_name, phone/phone_number).
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async updateAccountProfile(profileData) {
    const response = await apiClient.patch(
      "/api/v1/partner/profile/",
      profileData
    );
    return response.data;
  },

  /**
   * Change partner password with backend verification.
   * @param {Object} params
   * @param {string} params.old_password
   * @param {string} params.new_password
   * @param {string} params.confirm_password
   * @returns {Promise<{ detail: string }>}
   */
  async changePassword({ old_password, new_password, confirm_password }) {
    const response = await apiClient.post("/api/v1/partner/change-password/", {
      old_password,
      new_password,
      confirm_password,
    });
    return response.data;
  },
};

export default settingsApi;
