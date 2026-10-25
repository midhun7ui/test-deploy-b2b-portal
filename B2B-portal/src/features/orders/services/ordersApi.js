import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Orders.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const ordersApi = {
  /**
   * List orders for authenticated partner's company.
   * @param {Object} [params]
   * @param {string} [params.status] - Filter by status: "All", "Pending", "Accepted", "Rejected"
   * @param {string} [params.search] - Search keyword across route, cargo, vehicle, or order ID
   * @param {string} [params.ordering] - Ordering field e.g. "-created_at"
   * @returns {Promise<Array>}
   */
  async listOrders(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "All") {
      cleanParams.status = params.status;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params.ordering) {
      cleanParams.ordering = params.ordering;
    }

    const response = await apiClient.get("/api/v1/partner/orders/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Create a new transport order.
   * @param {Object} orderData
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    const response = await apiClient.post("/api/v1/partner/orders/", orderData);
    return response.data;
  },

  /**
   * Retrieve single order details by ID (e.g. "ORD-1028" or "1028").
   * @param {string|number} orderId
   * @returns {Promise<Object>}
   */
  async getOrderDetails(orderId) {
    const response = await apiClient.get(`/api/v1/partner/orders/${orderId}/`);
    return response.data;
  },

  /**
   * List vehicles registered by the partner's company.
   * @param {string} [status] - "ALL", "APPROVED", "PENDING", "REJECTED"
   * @returns {Promise<Array>}
   */
  async listCompanyVehicles(status = "ALL") {
    const params = status && status !== "ALL" ? { status } : {};
    const response = await apiClient.get("/api/v1/partner/vehicles/", { params });
    return response.data;
  },

  /**
   * Register a new vehicle for the partner's company.
   * @param {FormData|Object} vehicleData
   * @returns {Promise<Object>}
   */
  async registerVehicle(vehicleData) {
    const headers = vehicleData instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };
    const response = await apiClient.post("/api/v1/partner/vehicles/", vehicleData, { headers });
    return response.data;
  },
};

export default ordersApi;
