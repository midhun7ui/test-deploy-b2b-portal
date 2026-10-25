
function CompanyProfileHeader({ isEditing, onEdit, onCancel }) {
  return (
    <section className="company-profile-header">
      <div className="company-breadcrumb">
        <span>Dashboard</span>
        <span aria-hidden="true">/</span>
        <strong>Company Profile</strong>
      </div>

      <span className="company-eyebrow">ACCOUNT</span>

      <div className="company-heading-row">
        <div>
          <h1>Company Profile</h1>
          <p>
            Manage your business information and partner account details.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="company-primary-button"
            onClick={onEdit}
          >
            <span aria-hidden="true">✎</span>
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            className="company-secondary-button"
            onClick={onCancel}
          >
            Cancel editing
          </button>
        )}
      </div>
    </section>
  );
}

export default CompanyProfileHeader;
