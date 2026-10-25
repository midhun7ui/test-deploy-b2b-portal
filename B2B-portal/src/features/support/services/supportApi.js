import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Support Tickets & Messaging.
 * All requests include Bearer JWT token automatically via apiClient.
 */
export const supportApi = {
  /**
   * List partner company support tickets with optional filtering.
   * @param {Object} [params]
   * @param {string} [params.status]
   * @param {string} [params.category]
   * @param {string} [params.search]
   * @returns {Promise<Array>}
   */
  async getTickets(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "All") {
      cleanParams.status = params.status;
    }
    if (params.category && params.category !== "All") {
      cleanParams.category = params.category;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/partner/support/tickets/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Retrieve support ticket specifications and message history.
   * @param {string} ticketId
   * @returns {Promise<Object>}
   */
  async getTicketDetails(ticketId) {
    const response = await apiClient.get(
      `/api/v1/partner/support/tickets/${ticketId}/`
    );
    return response.data;
  },

  /**
   * Submit a new support ticket.
   * @param {Object} ticketData
   * @param {string} ticketData.subject
   * @param {string} ticketData.category
   * @param {string} ticketData.priority
   * @param {string} ticketData.description
   * @returns {Promise<Object>}
   */
  async createTicket(ticketData) {
    const response = await apiClient.post(
      "/api/v1/partner/support/tickets/",
      ticketData
    );
    return response.data;
  },

  /**
   * Send a reply message to an existing ticket thread.
   * @param {string} ticketId
   * @param {string} message
   * @returns {Promise<Object>}
   */
  async sendTicketMessage(ticketId, message) {
    const response = await apiClient.post(
      `/api/v1/partner/support/tickets/${ticketId}/messages/`,
      { message }
    );
    return response.data;
  },
};

export default supportApi;
