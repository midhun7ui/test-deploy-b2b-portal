
import { useEffect, useState } from "react";

const fieldGroups = [
  {
    title: "Business Information",
    description: "Your company's business details.",
    fields: [
      { name: "companyName", label: "Company Name", required: true },
      { name: "businessType", label: "Business Type", required: true },
      { name: "website", label: "Website", type: "url" },
    ],
  },
  {
    title: "Contact Information",
    description: "Contact details for your company.",
    fields: [
      { name: "email", label: "Business Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
    ],
  },
  {
    title: "Business Address",
    description: "Your primary business location.",
    fields: [
      { name: "addressLine1", label: "Address Line 1", required: true },
      { name: "addressLine2", label: "Address Line 2" },
      { name: "city", label: "City", required: true },
      { name: "state", label: "State", required: true },
      { name: "postalCode", label: "Postal Code", required: true },
      { name: "country", label: "Country", required: true },
    ],
  },
  {
    title: "Primary Contact",
    description: "The person responsible for this partner account.",
    fields: [
      { name: "contactPerson", label: "Contact Person", required: true },
      { name: "designation", label: "Designation" },
    ],
  },
];

function CompanyProfileForm({ profile, onSave, onCancel, isSaving = false }) {
  const [formData, setFormData] = useState({ ...profile });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setFormData({ ...profile });
    setErrors({});
    setSaveError("");
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSaveError("");
  };

  const validate = () => {
    const nextErrors = {};

    fieldGroups.forEach((group) => {
      group.fields.forEach((field) => {
        const value = formData[field.name]?.trim() ?? "";

        if (field.required && !value) {
          nextErrors[field.name] = `${field.label} is required.`;
        }
      });
    });

    if (
      formData.email &&
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (formData.website && formData.website.trim()) {
      try {
        const website = new URL(formData.website.trim());

        if (!["http:", "https:"].includes(website.protocol)) {
          nextErrors.website = "Use an HTTP or HTTPS website URL.";
        }
      } catch {
        nextErrors.website = "Enter a valid URL, including https://.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveError("");

    if (!validate()) return;

    try {
      await onSave({
        ...formData,
        companyName: (formData.companyName || "").trim(),
        businessType: (formData.businessType || "").trim(),
        email: (formData.email || "").trim(),
        phone: (formData.phone || "").trim(),
        website: (formData.website || "").trim(),
        addressLine1: (formData.addressLine1 || "").trim(),
        addressLine2: (formData.addressLine2 || "").trim(),
        city: (formData.city || "").trim(),
        state: (formData.state || "").trim(),
        postalCode: (formData.postalCode || "").trim(),
        country: (formData.country || "").trim(),
        contactPerson: (formData.contactPerson || "").trim(),
        designation: (formData.designation || "").trim(),
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "object"
          ? Object.entries(err.response.data)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join(" | ")
          : null) ||
        err?.message ||
        "Unable to update the profile. Please try again.";
      setSaveError(errorMsg);
    }
  };

  return (
    <form className="company-profile-form" onSubmit={handleSubmit} noValidate>
      {fieldGroups.map((group) => (
        <section className="company-form-section" key={group.title}>
          <div className="company-form-section-heading">
            <h2>{group.title}</h2>
            <p>{group.description}</p>
          </div>

          <div className="company-form-grid">
            {group.fields.map((field) => (
              <div
                className={`company-form-field ${
                  field.name === "addressLine1" ||
                  field.name === "addressLine2"
                    ? "company-form-field-full"
                    : ""
                }`}
                key={field.name}
              >
                <label htmlFor={`company-${field.name}`}>
                  {field.label}
                  {field.required && (
                    <span className="company-required"> *</span>
                  )}
                </label>

                <input
                  id={`company-${field.name}`}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name] ?? ""}
                  onChange={handleChange}
                  required={field.required}
                  disabled={isSaving}
                  autoComplete="off"
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name]
                      ? `company-${field.name}-error`
                      : undefined
                  }
                />

                {errors[field.name] && (
                  <span
                    className="company-field-error"
                    id={`company-${field.name}-error`}
                    role="alert"
                  >
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {saveError && (
        <p className="company-save-error" role="alert">
          {saveError}
        </p>
      )}

      <div className="company-form-footer">
        <p>
          Updates are saved directly to your registered company profile.
        </p>

        <div>
          <button
            type="button"
            className="company-secondary-button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="company-primary-button"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CompanyProfileForm;
