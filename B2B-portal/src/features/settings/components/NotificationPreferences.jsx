
const preferenceOptions = [
  {
    key: "orderUpdates",
    label: "Order updates",
    description: "Receive updates when orders change status.",
  },
  {
    key: "tripUpdates",
    label: "Trip updates",
    description: "Stay informed about trip progress and completion.",
  },
  {
    key: "statementUpdates",
    label: "Statement updates",
    description: "Get notified when statements become available.",
  },
  {
    key: "supportUpdates",
    label: "Support ticket updates",
    description: "Receive updates on support requests.",
  },
];

export default function NotificationPreferences({
  preferences,
  onChange,
  onSave,
  onReset,
  hasChanges,
  saveMessage,
  isSaving,
}) {
  return (
    <section className="settings-card settings-notifications-card">
      <div className="settings-card-header">
        <div className="settings-card-icon" aria-hidden="true">
          <span>🔔</span>
        </div>

        <div>
          <h2>Notification preferences</h2>
          <p>Choose which updates and delivery channels you want to receive.</p>
        </div>
      </div>

      <div className="settings-preference-list">
        {preferenceOptions.map((option) => (
          <label className="settings-preference-row" key={option.key}>
            <div>
              <strong>{option.label}</strong>
              <p>{option.description}</p>
            </div>

            <input
              type="checkbox"
              checked={Boolean(preferences[option.key])}
              onChange={(event) =>
                onChange(option.key, event.target.checked)
              }
              disabled={isSaving}
            />
          </label>
        ))}
      </div>

      <div className="settings-delivery-options">
        <h3>Delivery channels</h3>

        <label className="settings-preference-row">
          <div>
            <strong>Email notifications</strong>
            <p>Send order confirmations and published statement alerts to your verified email.</p>
          </div>

          <input
            type="checkbox"
            checked={Boolean(preferences.emailNotifications)}
            onChange={(event) =>
              onChange("emailNotifications", event.target.checked)
            }
            disabled={isSaving}
          />
        </label>

        <label className="settings-preference-row">
          <div>
            <strong>In-app notifications</strong>
            <p>Display real-time updates and notifications in the partner topbar.</p>
          </div>

          <input
            type="checkbox"
            checked={Boolean(preferences.inAppNotifications)}
            onChange={(event) =>
              onChange("inAppNotifications", event.target.checked)
            }
            disabled={isSaving}
          />
        </label>
      </div>

      <div className="settings-actions">
        <span
          className="settings-save-message"
          role="status"
          style={{
            color: saveMessage.includes("Error") ? "#dc2626" : "var(--hired-blue, #2563eb)",
            fontWeight: "500",
          }}
        >
          {saveMessage}
        </span>

        <div className="settings-action-buttons">
          <button
            type="button"
            className="settings-reset-button"
            onClick={onReset}
            disabled={!hasChanges || isSaving}
          >
            Reset
          </button>

          <button
            type="button"
            className="settings-save-button"
            onClick={onSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <p className="settings-note">
        Notification delivery preferences are persisted in your company account profile.
      </p>
    </section>
  );
}
