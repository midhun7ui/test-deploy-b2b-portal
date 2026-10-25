import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySettings({ security, onPasswordChanged }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  function handleSuccess() {
    setSuccessToast("Password updated successfully.");
    if (onPasswordChanged) {
      onPasswordChanged();
    }
    setTimeout(() => {
      setSuccessToast("");
    }, 4000);
  }

  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <span aria-hidden="true">🛡️</span>
        </div>

        <div>
          <h2>Security</h2>
          <p>Security controls and credentials for your partner account.</p>
        </div>
      </div>

      {successToast && (
        <div
          style={{
            marginTop: "16px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
            fontSize: "13px",
          }}
          role="status"
        >
          ✓ {successToast}
        </div>
      )}

      <div className="settings-security-row">
        <div>
          <strong>Password</strong>
          <p>
            Your account password protects portal access and sensitive trip records.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="settings-status-badge settings-status-badge--success">
            {security?.passwordConfigured !== false ? "Secured" : "Configured"}
          </span>
          <button
            type="button"
            className="settings-action-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Change password
          </button>
        </div>
      </div>

      <div className="settings-security-row">
        <div>
          <strong>Active sessions</strong>
          <p>
            {security?.activeSessionsCount || 1} active session on this device. Secured by rotating JWT access tokens.
          </p>
        </div>

        <span className="settings-status-badge settings-status-badge--info">Active now</span>
      </div>

      <div className="settings-security-row">
        <div>
          <strong>Two-factor authentication</strong>
          <p>Admin-enforced for elevated financial operations and password recovery.</p>
        </div>

        <span className="settings-status-badge">
          {security?.twoFactorConfigured ? "Enforced" : "Configured"}
        </span>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </section>
  );
}
