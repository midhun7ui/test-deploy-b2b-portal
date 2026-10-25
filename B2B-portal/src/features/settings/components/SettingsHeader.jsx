
export default function SettingsHeader() {
  return (
    <header className="settings-header">
      <div className="settings-breadcrumb">
        <span>Dashboard</span>
        <span aria-hidden="true">/</span>
        <span>Settings</span>
      </div>

      <div className="settings-header-main">
        <div>
          <span className="settings-eyebrow">PREFERENCES & SECURITY</span>
          <h1>Settings</h1>
          <p>
            Manage your account preferences, notifications, and security.
          </p>
        </div>
      </div>
    </header>
  );
}
