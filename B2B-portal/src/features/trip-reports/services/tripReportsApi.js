import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Trip Reports.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const tripReportsApi = {
  /**
   * List trip reports for authenticated partner's company.
   * @param {Object} [params]
   * @param {string} [params.status] - Filter by report status: "All", "Available", "Awaiting Closure"
   * @param {string} [params.search] - Search keyword across report ID, trip ID, order ID, route, or driver
   * @returns {Promise<{stats: Array, reports: Array}>}
   */
  async listTripReports(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "All") {
      cleanParams.status = params.status;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/partner/trip-reports/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Retrieve single trip report details by report ID (e.g. "RPT-0839" or "839") or trip ID.
   * @param {string|number} reportId
   * @returns {Promise<Object>}
   */
  async getTripReportDetails(reportId) {
    const response = await apiClient.get(
      `/api/v1/partner/trip-reports/${reportId}/`
    );
    return response.data;
  },
};

export default tripReportsApi;
