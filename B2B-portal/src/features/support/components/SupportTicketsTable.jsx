import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supportCategories } from "../data/supportMockData";

function SupportTicketsTable({
  tickets,
  loading = false,
  statusFilter = "All",
  onStatusChange,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter !== "All") {
        if (statusFilter === "Resolved") {
          if (ticket.status !== "Resolved" && ticket.status !== "Closed") return false;
        } else if (ticket.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== "All" && ticket.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesId = (ticket.id || "").toLowerCase().includes(q);
        const matchesSubject = (ticket.subject || "").toLowerCase().includes(q);
        const matchesDesc = (ticket.description || "").toLowerCase().includes(q);
        if (!matchesId && !matchesSubject && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, statusFilter, categoryFilter, search]);

  const statusTabs = ["All", "Open", "In Progress", "Resolved"];

  return (
    <section className="support-tickets-card">
      <div className="support-tickets-heading">
        <div>
          <h2>Your Support Requests</h2>
          <p>Track progress, review solutions, and converse directly with operations officers.</p>
        </div>

        <span className="support-ticket-count">
          {filteredTickets.length} of {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
        </span>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          flexWrap: "wrap",
        }}
      >
        {/* Status Tab Chips */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {statusTabs.map((tab) => {
            const isTabActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onStatusChange && onStatusChange(tab)}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: isTabActive ? 700 : 500,
                  border: isTabActive ? "1px solid #2563eb" : "1px solid #cbd5e1",
                  backgroundColor: isTabActive ? "#2563eb" : "#ffffff",
                  color: isTabActive ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: "flex", gap: "0.75rem", flex: "1 1 300px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.825rem",
              backgroundColor: "#ffffff",
              color: "#334155",
            }}
          >
            <option value="All">All Categories</option>
            {supportCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, IDs, or topics..."
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "0.375rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.825rem",
              minWidth: "220px",
              backgroundColor: "#ffffff",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
          <div
            className="spinner"
            style={{
              margin: "0 auto 1rem auto",
              width: "24px",
              height: "24px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#0284c7",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Synchronizing support tickets with dispatch desk...
          </p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="support-empty-state" style={{ padding: "3rem 1.5rem" }}>
          <span aria-hidden="true" style={{ fontSize: "2rem", color: "#94a3b8" }}>✓</span>
          <h3 style={{ margin: "0.75rem 0 0.25rem 0", fontSize: "1.1rem", color: "#1e293b" }}>
            No matching support tickets
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.875rem", maxWidth: "380px", margin: "0 auto" }}>
            {search || categoryFilter !== "All" || statusFilter !== "All"
              ? "No tickets match your active filter criteria. Try clearing search or selecting All."
              : "You have not submitted any support tickets yet. Click '+ Create Support Ticket' above to report an issue."}
          </p>
          {(search || categoryFilter !== "All" || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("All");
                if (onStatusChange) onStatusChange("All");
              }}
              style={{
                marginTop: "1rem",
                background: "none",
                border: "none",
                color: "#2563eb",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="support-table-wrapper">
          <table className="support-table">
            <thead>
              <tr>
                <th>Ticket Reference</th>
                <th>Subject &amp; Issue Summary</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket) => {
                const isResolved = ticket.status === "Resolved" || ticket.status === "Closed";
                const isUrgent = ticket.priority === "Urgent" || ticket.priority === "High";

                return (
                  <tr key={ticket.id}>
                    <td>
                      <button
                        type="button"
                        className="support-ticket-link"
                        onClick={() => navigate(`/support/${ticket.id}`)}
                        style={{ fontWeight: 700 }}
                      >
                        {ticket.id}
                      </button>
                    </td>

                    <td className="support-subject-cell">
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{ticket.subject}</span>
                        {ticket.description && (
                          <span style={{ fontSize: "0.75rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "340px" }}>
                            {ticket.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.825rem", color: "#334155" }}>{ticket.category}</span>
                    </td>

                    <td>
                      <span
                        className={`support-priority support-priority-${ticket.priority.toLowerCase()}`}
                        style={{
                          fontWeight: isUrgent ? 700 : 500,
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`support-status support-status-${ticket.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {isResolved ? `✓ ${ticket.status}` : ticket.status}
                      </span>
                    </td>

                    <td style={{ fontSize: "0.825rem", color: "#64748b" }}>{ticket.createdAt}</td>

                    <td>
                      <button
                        type="button"
                        className="support-view-button"
                        onClick={() => navigate(`/support/${ticket.id}`)}
                      >
                        Open Thread →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default SupportTicketsTable;
