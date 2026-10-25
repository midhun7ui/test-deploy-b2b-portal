import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Dashboard.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const dashboardApi = {
  /**
   * Fetches aggregated KPI operational counts.
   * @returns {Promise<{total_orders: number, pending_orders: number, accepted_orders: number, rejected_orders: number, ongoing_trips: number, completed_trips: number}>}
   */
  async getSummary() {
    const response = await apiClient.get("/api/v1/partner/dashboard/summary/");
    return response.data;
  },

  /**
   * Fetches recent 5 orders for partner company.
   * @returns {Promise<Array<{id: number, order_id: string, route: string, pickup_location: string, drop_location: string, date: string, status: string, amount: string}>>}
   */
  async getRecentOrders() {
    const response = await apiClient.get("/api/v1/partner/dashboard/recent-orders/");
    return response.data;
  },

  /**
   * Fetches active (Assigned / Ongoing) trips for partner company.
   * @returns {Promise<Array<{id: number, trip_id: string, order_id: string, route: string, driver: string, status: string, amount: string, eta: string}>>}
   */
  async getActiveTrips() {
    const response = await apiClient.get("/api/v1/partner/dashboard/active-trips/");
    return response.data;
  },

  /**
   * Fetches timeline activity feed for partner company.
   * @returns {Promise<Array<{id: string, title: string, time: string, timestamp: string, type: string}>>}
   */
  async getActivity() {
    const response = await apiClient.get("/api/v1/partner/dashboard/activity/");
    return response.data;
  },
};

export default dashboardApi;
