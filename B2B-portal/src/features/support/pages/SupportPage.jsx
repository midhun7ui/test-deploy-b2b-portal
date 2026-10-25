import { useState } from "react";
import { useSupport } from "../SupportContext";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import SupportHeader from "../components/SupportHeader";
import SupportOverview from "../components/SupportOverview";
import SupportTicketsTable from "../components/SupportTicketsTable";
import SupportTicketForm from "../components/SupportTicketForm";

export default function SupportPage() {
  const { tickets, loading, error, isSyncing, lastSynced, createTicket, refreshTickets } = useSupport();

  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  async function handleCreateTicket(ticketData) {
    try {
      setIsSubmitting(true);
      setFormError("");
      const created = await createTicket(ticketData);
      setShowForm(false);
      setSuccessMessage(`Support ticket ${created.id} logged with operations desk.`);
      setStatusFilter("All");
    } catch (err) {
      const errMsg =
        err?.response?.data?.detail ||
        (err?.response?.data && Object.values(err.response.data)[0]) ||
        "Failed to submit support ticket. Please verify all fields.";
      setFormError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page support-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content support-content">
          <SupportHeader
            isSyncing={isSyncing}
            lastSynced={lastSynced}
            onRefresh={refreshTickets}
            onCreateTicket={() => {
              setSuccessMessage("");
              setFormError("");
              setShowForm(true);
            }}
          />

          {error && (
            <div
              style={{
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => refreshTickets()}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {successMessage && (
            <div className="support-success-message" role="status">
              {successMessage}
            </div>
          )}

          {formError && (
            <div
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                borderRadius: "0.375rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                fontSize: "0.875rem",
              }}
              role="alert"
            >
              {formError}
            </div>
          )}

          {showForm && (
            <SupportTicketForm
              onSubmit={handleCreateTicket}
              onCancel={() => {
                setShowForm(false);
                setFormError("");
              }}
              isSubmitting={isSubmitting}
            />
          )}

          <SupportOverview
            tickets={tickets}
            selectedFilter={statusFilter}
            onSelectFilter={(filterKey) => setStatusFilter(filterKey)}
          />

          <SupportTicketsTable
            tickets={tickets}
            loading={loading}
            statusFilter={statusFilter}
            onStatusChange={(newFilter) => setStatusFilter(newFilter)}
          />
        </div>
      </main>
    </div>
  );
}
