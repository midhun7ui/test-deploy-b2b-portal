import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import { useSupport } from "../SupportContext";
import { supportApi } from "../services/supportApi";

function SupportTicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { tickets, sendReplyMessage } = useSupport();

  const contextTicket = tickets.find((item) => item.id === ticketId);
  const [ticket, setTicket] = useState(contextTicket || null);
  const [loading, setLoading] = useState(!contextTicket);
  const [error, setError] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  const conversationEndRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTicket(silent = false) {
      try {
        if (!silent) setLoading(true);
        setError(null);
        const data = await supportApi.getTicketDetails(ticketId);
        if (isMounted) {
          setTicket(data);
        }
      } catch (err) {
        if (isMounted && !silent) {
          if (!contextTicket) {
            setError(err?.response?.data?.detail || "Support ticket not found.");
          }
        }
      } finally {
        if (isMounted && !silent) {
          setLoading(false);
        }
      }
    }

    loadTicket(false);

    // Live background polling every 8 seconds to fetch admin replies in real time
    pollingRef.current = setInterval(() => {
      if (!document.hidden) {
        loadTicket(true);
      }
    }, 8000);

    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [ticketId, contextTicket]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  async function handleSendReply(event) {
    event.preventDefault();
    const text = replyText.trim();
    if (!text) return;

    try {
      setIsSendingReply(true);
      setReplyError("");
      const newMsg = await sendReplyMessage(ticketId, text);
      setTicket((current) => ({
        ...current,
        status: current?.status === "Resolved" || current?.status === "Closed" ? "In Progress" : current?.status,
        messages: [...(current?.messages || []), newMsg],
        updatedAt: "Just now",
      }));
      setReplyText("");
    } catch (err) {
      setReplyError(
        err?.response?.data?.detail ||
          "Failed to send reply. Please try again."
      );
    } finally {
      setIsSendingReply(false);
    }
  }

  const activeTicket = ticket || contextTicket;
  const isResolved = activeTicket?.status === "Resolved" || activeTicket?.status === "Closed";

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page support-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content support-content">
          <button
            type="button"
            className="support-back-button"
            onClick={() => navigate("/support")}
          >
            <span aria-hidden="true">←</span>
            Back to Support Requests
          </button>

          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
              <div
                className="spinner"
                style={{
                  margin: "0 auto 1rem auto",
                  width: "28px",
                  height: "28px",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#0284c7",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ margin: 0, fontSize: "0.875rem" }}>
                Connecting to live support thread...
              </p>
            </div>
          ) : error || !activeTicket ? (
            <section className="support-ticket-not-found">
              <h1>Ticket not found</h1>
              <p>
                {error || "This support ticket could not be found or you do not have permission to view it."}
              </p>
              <button
                type="button"
                className="support-primary-button"
                onClick={() => navigate("/support")}
              >
                Return to Support Centre
              </button>
            </section>
          ) : (
            <>
              <section className="support-ticket-detail-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span className="support-eyebrow">{activeTicket.id}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>• Live Dispatch Desk Connected</span>
                  </div>
                  <h1>{activeTicket.subject}</h1>
                  <p>
                    Created {activeTicket.createdAt} · Category: <strong>{activeTicket.category}</strong>
                  </p>
                </div>

                <span
                  className={`support-status support-status-${(activeTicket.status || "open")
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {isResolved ? `✓ ${activeTicket.status}` : activeTicket.status}
                </span>
              </section>

              {/* Resolution Banner if resolved */}
              {isResolved && (
                <div
                  style={{
                    backgroundColor: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: "0.5rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#065f46",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>✓</span>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.9rem" }}>
                      Issue Resolved by HireD Operations
                    </strong>
                    <span style={{ fontSize: "0.825rem", color: "#047857" }}>
                      This request has been resolved. If you have any further questions, you can send a reply below and the ticket will automatically reopen.
                    </span>
                  </div>
                </div>
              )}

              <section className="support-ticket-detail-card">
                <div className="support-ticket-detail-section">
                  <h2>Original Problem Description</h2>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{activeTicket.description}</p>
                </div>

                <div className="support-ticket-detail-meta">
                  <div>
                    <span>Priority</span>
                    <strong>{activeTicket.priority}</strong>
                  </div>

                  <div>
                    <span>Category</span>
                    <strong>{activeTicket.category}</strong>
                  </div>

                  <div>
                    <span>Last updated</span>
                    <strong>{activeTicket.updatedAt}</strong>
                  </div>
                </div>
              </section>

              <section className="support-conversation-card">
                <div className="support-conversation-heading">
                  <div>
                    <h2>Conversation &amp; Operational Updates</h2>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.775rem", color: "#64748b" }}>
                      Direct secure channel between your operations team and HireD dispatch.
                    </p>
                  </div>
                  <span className="support-ticket-count">
                    {(activeTicket.messages || []).length} messages
                  </span>
                </div>

                {(!activeTicket.messages || activeTicket.messages.length === 0) ? (
                  <div className="support-conversation-empty">
                    No replies yet. An operations officer will review this request and reply shortly.
                  </div>
                ) : (
                  <div className="support-conversation-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {activeTicket.messages.map((message) => {
                      const isPartner =
                        message.sender === "Partner" ||
                        message.sender_type === "Partner";

                      return (
                        <article
                          className={`support-message ${
                            isPartner ? "support-message-partner" : "support-message-agent"
                          }`}
                          key={message.id}
                          style={{
                            alignSelf: isPartner ? "flex-end" : "flex-start",
                            maxWidth: "85%",
                            backgroundColor: isPartner ? "#eff6ff" : "#f8fafc",
                            border: isPartner ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                            borderRadius: "0.75rem",
                            padding: "0.85rem 1rem",
                          }}
                        >
                          <div
                            className="support-message-meta"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "1rem",
                              marginBottom: "0.35rem",
                              fontSize: "0.75rem",
                            }}
                          >
                            <span style={{ fontWeight: 700, color: isPartner ? "#1d4ed8" : "#0f172a", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              {isPartner ? "👤 You (Partner)" : "🛡️ HireD Operations Desk"}
                            </span>
                            <span style={{ color: "#64748b" }}>{message.createdAt}</span>
                          </div>

                          <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                            {message.message}
                          </p>
                        </article>
                      );
                    })}
                    <div ref={conversationEndRef} />
                  </div>
                )}

                {replyError && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#991b1b",
                      fontSize: "0.875rem",
                    }}
                  >
                    {replyError}
                  </div>
                )}

                <form
                  onSubmit={handleSendReply}
                  style={{
                    marginTop: "1.5rem",
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "1.25rem",
                    display: "flex",
                    gap: "0.75rem",
                  }}
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      isResolved
                        ? "Need further help? Type a follow-up reply to reopen this ticket..."
                        : "Type an update, provide reference IDs, or reply to operations..."
                    }
                    style={{
                      flex: 1,
                      padding: "0.625rem 0.875rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.875rem",
                    }}
                    disabled={isSendingReply}
                  />
                  <button
                    type="submit"
                    className="support-primary-button"
                    disabled={isSendingReply || !replyText.trim()}
                  >
                    {isSendingReply ? "Sending..." : isResolved ? "Reopen & Reply" : "Send Reply"}
                  </button>
                </form>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default SupportTicketDetailsPage;
