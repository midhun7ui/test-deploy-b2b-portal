
function SupportHeader({ onCreateTicket, onRefresh, isSyncing = false, lastSynced = null }) {
  const formattedSync = lastSynced
    ? lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <section className="support-header">
      <div className="support-breadcrumb">
        <span>Dashboard</span>
        <span aria-hidden="true">/</span>
        <strong>Support</strong>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <span className="support-eyebrow">HELP CENTRE &amp; OPERATIONS DESK</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8rem", color: "#64748b" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
              }}
            />
            <span style={{ fontWeight: 600, color: "#065f46" }}>Desk Live</span>
          </span>
          {formattedSync && <span>• Synced at {formattedSync}</span>}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isSyncing}
              title="Refresh tickets from server"
              style={{
                background: "transparent",
                border: "1px solid #cbd5e1",
                borderRadius: "0.375rem",
                padding: "0.25rem 0.6rem",
                cursor: isSyncing ? "wait" : "pointer",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#334155",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span style={{ display: "inline-block", animation: isSyncing ? "spin 1s linear infinite" : "none" }}>↻</span>
              {isSyncing ? "Syncing..." : "Sync"}
            </button>
          )}
        </div>
      </div>

      <div className="support-heading-row">
        <div>
          <h1>Partner Support Centre</h1>
          <p>
            Submit operational enquiries, report trip discrepancies, or request invoice clarification directly from HireD Support.
          </p>
        </div>

        <button
          type="button"
          className="support-primary-button"
          onClick={onCreateTicket}
        >
          <span aria-hidden="true">+</span>
          Create Support Ticket
        </button>
      </div>
    </section>
  );
}

export default SupportHeader;
