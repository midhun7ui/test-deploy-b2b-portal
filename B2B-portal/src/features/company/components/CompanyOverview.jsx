
function CompanyOverview({ profile = {} }) {
  const companyName = profile.companyName || "";
  const initials = companyName
    ? companyName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "CO";

  return (
    <section className="company-overview-card">
      <div className="company-overview-identity">
        <div className="company-overview-avatar" aria-hidden="true">
          {initials || "CO"}
        </div>

        <div className="company-overview-name">
          <h2>{profile.companyName}</h2>
          <p>{profile.businessType}</p>
          <span className="company-account-status">
            <span />
            Partner account
          </span>
        </div>
      </div>

      <div className="company-overview-divider" />

      <div className="company-overview-meta">
        <span>PARTNER ID</span>
        <strong>{profile.partnerId}</strong>
      </div>

      <div className="company-overview-meta">
        <span>PRIMARY CONTACT</span>
        <strong>{profile.contactPerson || "Not provided"}</strong>
      </div>
    </section>
  );
}

export default CompanyOverview;
