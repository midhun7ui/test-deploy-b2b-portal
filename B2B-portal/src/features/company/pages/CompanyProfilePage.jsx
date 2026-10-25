import { useCallback, useEffect, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import { initialCompanyProfile } from "../data/companyMockData";
import CompanyProfileHeader from "../components/CompanyProfileHeader";
import CompanyOverview from "../components/CompanyOverview";
import CompanyProfileForm from "../components/CompanyProfileForm";
import companyApi from "../services/companyApi";

const detailSections = [
  {
    title: "Business Information",
    description: "Your registered business details.",
    fields: [
      { key: "companyName", label: "Company Name" },
      { key: "businessType", label: "Business Type" },
      { key: "website", label: "Website" },
    ],
  },
  {
    title: "Contact Information",
    description: "Contact details for your company.",
    fields: [
      { key: "email", label: "Business Email" },
      { key: "phone", label: "Phone Number" },
    ],
  },
  {
    title: "Business Address",
    description: "Your company's primary business location.",
    fields: [
      { key: "addressLine1", label: "Address Line 1" },
      { key: "addressLine2", label: "Address Line 2" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "postalCode", label: "Postal Code" },
      { key: "country", label: "Country" },
    ],
  },
  {
    title: "Primary Contact",
    description: "The person responsible for this partner account.",
    fields: [
      { key: "contactPerson", label: "Contact Person" },
      { key: "designation", label: "Designation" },
    ],
  },
];

function formatWebsite(value) {
  if (!value?.trim()) return "";

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`
    );

    if (!["http:", "https:"].includes(url.protocol)) return value;

    return url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, "");
  } catch {
    return value;
  }
}

function CompanyDetails({ profile }) {
  if (!profile) return null;

  return (
    <div className="company-details-grid">
      {detailSections.map((section) => (
        <section className="company-detail-card" key={section.title}>
          <div className="company-detail-card-header">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </div>

          <div className="company-detail-fields">
            {section.fields.map((field) => {
              let value = profile[field.key]?.trim();

              if (field.key === "website" && value) {
                value = formatWebsite(value);
              }

              return (
                <div className="company-detail-field" key={field.key}>
                  <span>{field.label}</span>

                  {value ? (
                    field.key === "website" ? (
                      <a
                        href={
                          /^https?:\/\//i.test(profile.website.trim())
                            ? profile.website.trim()
                            : `https://${profile.website.trim()}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {value}
                      </a>
                    ) : (
                      <strong>{value}</strong>
                    )
                  ) : (
                    <span className="company-detail-empty">
                      Not provided
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function CompanyProfilePage() {
  const [profile, setProfile] = useState(() => ({
    ...initialCompanyProfile,
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyApi.getCompanyProfile();
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load company profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const startEditing = () => {
    setShowSuccess(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setShowSuccess(false);
  };

  const saveProfile = async (updatedProfile) => {
    setIsSaving(true);
    try {
      const saved = await companyApi.updateCompanyProfile(updatedProfile);
      setProfile(saved || updatedProfile);
      setIsEditing(false);
      setShowSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page company-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content company-content">
          <CompanyProfileHeader
            isEditing={isEditing}
            onEdit={startEditing}
            onCancel={cancelEditing}
          />

          {error && (
            <div
              role="alert"
              style={{
                margin: "0 0 1.5rem 0",
                padding: "0.875rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.875rem",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchProfile}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #f87171",
                  color: "#f87171",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </div>
          )}

          {showSuccess && (
            <div className="company-success-message" role="status">
              Company profile updated successfully.
            </div>
          )}

          {loading ? (
            <section
              className="company-detail-card"
              style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted, #94a3b8)" }}
            >
              <h2>Loading company profile...</h2>
              <p>Fetching your registered business details.</p>
            </section>
          ) : (
            <>
              <CompanyOverview profile={profile} />

              {isEditing ? (
                <CompanyProfileForm
                  profile={profile}
                  onSave={saveProfile}
                  onCancel={cancelEditing}
                  isSaving={isSaving}
                />
              ) : (
                <CompanyDetails profile={profile} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CompanyProfilePage;
