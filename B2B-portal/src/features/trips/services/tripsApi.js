import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Trips.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const tripsApi = {
  /**
   * List trips for authenticated partner's company.
   * @param {Object} [params]
   * @param {string} [params.status] - Filter by status: "All", "Unassigned", "Assigned", "Ongoing", "Completed"
   * @param {string} [params.driver] - Filter by driver name or "Not Assigned"
   * @param {string} [params.search] - Search keyword across route, driver, trip ID, or order ID
   * @param {string} [params.ordering] - Ordering field e.g. "-created_at"
   * @returns {Promise<Array>}
   */
  async listTrips(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "All") {
      cleanParams.status = params.status;
    }
    if (params.driver && params.driver !== "All") {
      cleanParams.driver = params.driver;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params.ordering) {
      cleanParams.ordering = params.ordering;
    }

    const response = await apiClient.get("/api/v1/partner/trips/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Retrieve single trip details by ID (e.g. "TRP-0842" or "842").
   * @param {string|number} tripId
   * @returns {Promise<Object>}
   */
  async getTripDetails(tripId) {
    const response = await apiClient.get(`/api/v1/partner/trips/${tripId}/`);
    return response.data;
  },
};

export default tripsApi;
