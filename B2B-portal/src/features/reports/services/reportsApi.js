import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Reports & Analytics.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const reportsApi = {
  /**
   * Retrieve operational reports and analytics for the authenticated partner's company.
   * @param {Object} [params]
   * @param {string} [params.year] - Filter by reporting year e.g. "2026" or "all"
   * @param {string} [params.search] - Search keyword across report ID or period
   * @returns {Promise<{
   *   stats: Array,
   *   monthlyTripTrends: Array,
   *   tripStatusBreakdown: Array,
   *   routeInsights: Array,
   *   reports: Array,
   *   years: Array
   * }>}
   */
  async getReportsOverview(params = {}) {
    const cleanParams = {};
    if (params.year && params.year !== "all") {
      cleanParams.year = params.year;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/partner/reports/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Retrieve period performance report details by report ID (e.g. "RPT-2026-09" or "2026-09").
   * @param {string} reportId
   * @returns {Promise<Object>}
   */
  async getReportDetails(reportId) {
    const response = await apiClient.get(
      `/api/v1/partner/reports/${reportId}/`
    );
    return response.data;
  },
};

export default reportsApi;
