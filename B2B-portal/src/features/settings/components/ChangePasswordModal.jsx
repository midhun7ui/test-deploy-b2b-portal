import { useState } from "react";
import settingsApi from "../services/settingsApi";

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!oldPassword.trim()) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await settingsApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setSuccessMessage(res.detail || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (data.old_password) {
          setErrorMessage(Array.isArray(data.old_password) ? data.old_password[0] : data.old_password);
        } else if (data.confirm_password) {
          setErrorMessage(Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password);
        } else if (data.new_password) {
          setErrorMessage(Array.isArray(data.new_password) ? data.new_password[0] : data.new_password);
        } else if (data.detail) {
          setErrorMessage(data.detail);
        } else {
          setErrorMessage("Failed to update password. Please check your credentials.");
        }
      } else {
        setErrorMessage("Network error while updating password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="change-password-title">
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
          <span aria-hidden="true">🔒</span>
        </div>

        <div className="modal-header">
          <h2 id="change-password-title">Change Password</h2>
          <p>Update your account security password. Must be at least 8 characters.</p>
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

        {successMessage && (
          <div
            style={{
              padding: "10px 14px",
              marginBottom: "16px",
              borderRadius: "8px",
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              fontSize: "13px",
            }}
            role="status"
          >
            ✓ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
              Current Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="settings-edit-input"
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
              New Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="settings-edit-input"
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
              Confirm New Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="settings-edit-input"
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
            <input
              type="checkbox"
              id="show-pw-toggle"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              style={{ accentColor: "var(--hired-blue)" }}
            />
            <label htmlFor="show-pw-toggle" style={{ fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
              Show passwords
            </label>
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
