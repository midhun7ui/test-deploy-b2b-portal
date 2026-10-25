import { useState, useEffect } from "react";

export default function EditProfileModal({ isOpen, onClose, account, onSave }) {
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (account) {
      setDisplayName(account.displayName || account.full_name || "");
      setPhone(account.phone || account.phone_number || "");
    }
  }, [account, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!displayName.trim()) {
      setErrorMessage("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        displayName: displayName.trim(),
        phone: phone.trim(),
      });
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.phone_number) {
        setErrorMessage(Array.isArray(data.phone_number) ? data.phone_number[0] : data.phone_number);
      } else if (data?.full_name) {
        setErrorMessage(Array.isArray(data.full_name) ? data.full_name[0] : data.full_name);
      } else if (data?.detail) {
        setErrorMessage(data.detail);
      } else {
        setErrorMessage("Failed to update profile details.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="modal-icon-badge">
          <span aria-hidden="true">👤</span>
        </div>

        <div className="modal-header">
          <h2 id="edit-profile-title">Edit Account Profile</h2>
          <p>Update your personal information visible in the partner portal.</p>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: "10px 14px",
              marginBottom: "16px",
              borderRadius: "8px",
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              fontSize: "13px",
            }}
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
              Display Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Salim Al-Partner"
              className="settings-edit-input"
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966501234567"
              className="settings-edit-input"
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={account.email || ""}
              readOnly
              className="settings-edit-input"
              style={{ background: "var(--surface-soft)", cursor: "not-allowed", color: "var(--text-muted)" }}
            />
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Login email cannot be modified directly. Contact your admin for email changes.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              className="settings-reset-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="settings-save-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
