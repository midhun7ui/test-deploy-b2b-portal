import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Invoices & Statements.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const invoicesApi = {
  /**
   * List published monthly statements for the authenticated partner's company.
   * @param {Object} [params]
   * @param {string|number} [params.year] - Filter by reporting year e.g. "2026" or "All"
   * @param {string|number} [params.month] - Filter by reporting month (1-12)
   * @param {string} [params.search] - Search keyword across statement ID or period
   * @returns {Promise<{stats: Array, statements: Array, years: Array}>}
   */
  async listStatements(params = {}) {
    const cleanParams = {};
    if (params.year && params.year !== "All") {
      cleanParams.year = params.year;
    }
    if (params.month) {
      cleanParams.month = params.month;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/partner/statements/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Retrieve single published statement details by statement ID (e.g. "STMT-2026-09" or numeric ID).
   * @param {string|number} statementId
   * @returns {Promise<Object>}
   */
  async getStatementDetails(statementId) {
    const response = await apiClient.get(
      `/api/v1/partner/statements/${statementId}/`
    );
    return response.data;
  },

  /**
   * List individual Order Tax Invoices for the authenticated partner company.
   * @param {Object} [params]
   * @param {string} [params.search]
   * @param {string} [params.status]
   * @returns {Promise<{invoices: Array, uninvoiced_orders: Array, stats: Object}>}
   */
  async listOrderInvoices(params = {}) {
    const response = await apiClient.get("/api/v1/partner/order-invoices/", {
      params,
    });
    return response.data;
  },

  /**
   * Retrieve single order tax invoice details.
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getOrderInvoiceDetails(id) {
    const response = await apiClient.get(`/api/v1/partner/order-invoices/${id}/`);
    return response.data;
  },

  /**
   * Get S3 PDF download link for an order tax invoice.
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getOrderInvoicePdf(id) {
    const response = await apiClient.get(`/api/v1/partner/order-invoices/${id}/pdf/`);
    return response.data;
  },

  /**
   * Request / Generate on-demand invoice for a partner's order.
   * @param {number|string} orderId
   * @returns {Promise<Object>}
   */
  async generateOrderInvoice(orderId) {
    const response = await apiClient.post(`/api/v1/partner/orders/${orderId}/invoice/`);
    return response.data;
  },
};

export default invoicesApi;

