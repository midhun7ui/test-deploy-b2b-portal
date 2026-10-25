import apiClient from "../../../lib/apiClient";

/**
 * REST API client for B2B Partner Company Profile.
 * All calls automatically include Bearer JWT token via apiClient interceptor.
 */
export const companyApi = {
  /**
   * Fetch company profile for authenticated partner.
   * @returns {Promise<Object>}
   */
  async getCompanyProfile() {
    const response = await apiClient.get("/api/v1/partner/company/");
    return response.data;
  },

  /**
   * Update partner's company profile details.
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async updateCompanyProfile(profileData) {
    const response = await apiClient.patch("/api/v1/partner/company/", profileData);
    return response.data;
  },
};

export default companyApi;
