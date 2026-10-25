import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function AccountPreferences({ account, onUpdateAccount }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">
          <span aria-hidden="true">👤</span>
        </div>

        <div>
          <h2>Account preferences</h2>
          <p>Your account information and partner role.</p>
        </div>

        {onUpdateAccount && (
          <div className="settings-card-header-actions" style={{ marginLeft: "auto" }}>
            <button
              type="button"
              className="settings-action-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="settings-fields-grid">
        <div className="settings-field">
          <span>Display name</span>
          <strong>{account.displayName || account.full_name || "Partner User"}</strong>
        </div>

        <div className="settings-field">
          <span>Email address</span>
          <strong>{account.email}</strong>
        </div>

        <div className="settings-field">
          <span>Phone number</span>
          <strong>{account.phone || account.phone_number || "Not provided"}</strong>
        </div>

        <div className="settings-field">
          <span>Account role</span>
          <strong>{account.role || "B2B Partner Administrator"}</strong>
        </div>

        {account.companyName && (
          <div className="settings-field">
            <span>Company organization</span>
            <strong>{account.companyName}</strong>
          </div>
        )}
      </div>

      <p className="settings-note">
        Profile updates synchronize across the partner portal and verified statements.
      </p>

      {onUpdateAccount && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          account={account}
          onSave={onUpdateAccount}
        />
      )}
    </section>
  );
}
