
import { useState } from "react";
import {
  supportCategories,
  supportPriorities,
} from "../data/supportMockData";

function SupportTicketForm({ onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    subject: "",
    category: "Orders",
    priority: "Normal",
    description: "",
  });

  const [errors, setErrors] = useState({});

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
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.subject.trim()) {
      nextErrors.subject = "Enter a ticket subject.";
    } else if (formData.subject.trim().length < 5) {
      nextErrors.subject = "Subject must contain at least 5 characters.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Describe the issue you're experiencing.";
    } else if (formData.description.trim().length < 15) {
      nextErrors.description = "Please provide at least 15 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...formData,
      subject: formData.subject.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <form className="support-ticket-form" onSubmit={handleSubmit} noValidate>
      <div className="support-form-heading">
        <h2>Create a support ticket</h2>
        <p>Give us enough detail to understand and investigate your issue.</p>
      </div>

      <div className="support-form-grid">
        <div className="support-form-field support-form-field-full">
          <label htmlFor="support-subject">Subject *</label>
          <input
            id="support-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Briefly describe the issue"
            maxLength={120}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "support-subject-error" : undefined}
          />
          {errors.subject && (
            <small id="support-subject-error" role="alert">
              {errors.subject}
            </small>
          )}
        </div>

        <div className="support-form-field">
          <label htmlFor="support-category">Category</label>
          <select
            id="support-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {supportCategories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="support-form-field">
          <label htmlFor="support-priority">Priority</label>
          <select
            id="support-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {supportPriorities.map((priority) => (
              <option value={priority} key={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="support-form-field support-form-field-full">
          <label htmlFor="support-description">Description *</label>
          <textarea
            id="support-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what happened, what you expected, and any relevant reference IDs."
            rows={5}
            maxLength={3000}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "support-description-error" : undefined
            }
          />
          <div className="support-description-footer">
            {errors.description && (
              <small id="support-description-error" role="alert">
                {errors.description}
              </small>
            )}
            <span>{formData.description.length}/3000</span>
          </div>
        </div>
      </div>

      <div className="support-form-footer">
        <p>Your ticket will be routed directly to the 24x7 HireD operations desk.</p>

        <div>
          <button
            type="button"
            className="support-secondary-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="support-primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SupportTicketForm;
