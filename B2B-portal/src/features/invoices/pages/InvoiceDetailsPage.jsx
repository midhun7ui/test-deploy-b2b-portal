import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";
import invoicesApi from "../services/invoicesApi";

function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    invoicesApi
      .getStatementDetails(invoiceId)
      .then((data) => {
        if (isMounted) {
          setStatement(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err?.response?.data?.detail ||
              err?.message ||
              "Failed to load statement."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invoiceId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page invoice-details-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content invoice-details-content">
          <button
            type="button"
            className="invoice-back-button"
            onClick={() => navigate("/invoices")}
          >
            ← Back to Invoices &amp; Statements
          </button>

          {loading ? (
            <section className="invoice-details-empty">
              <h1>Loading statement details...</h1>
              <p>Fetching statement data from the server.</p>
            </section>
          ) : error || !statement ? (
            <section className="invoice-details-empty">
              <h1>Statement not found</h1>
              <p>
                {error ||
                  "This statement is unavailable or has not been published for your company."}
              </p>

              <button
                type="button"
                className="invoice-view-button"
                style={{ marginTop: "16px" }}
                onClick={() => navigate("/invoices")}
              >
                View statements
              </button>
            </section>
          ) : (
            <>
              <header className="invoice-details-header">
                <div>
                  <div className="invoice-details-breadcrumb">
                    <span>Finance</span>
                    <span aria-hidden="true">/</span>
                    <span>Invoices &amp; Statements</span>
                    <span aria-hidden="true">/</span>
                    <strong>{statement.id}</strong>
                  </div>

                  <span className="invoices-eyebrow">
                    MONTHLY STATEMENT
                  </span>

                  <h1>{statement.id}</h1>

                  <p>
                    Financial statement for {statement.period}.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="invoice-status invoice-status-published">
                    {statement.status || "Published"}
                  </span>
                  {(statement.pdf_url || statement.pdfUrl) && (
                    <a
                      href={statement.pdf_url || statement.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="invoice-view-button"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        textDecoration: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: "#1E3A8A",
                        color: "#ffffff",
                      }}
                    >
                      <span>📥</span>
                      Download S3 PDF
                    </a>
                  )}
                </div>
              </header>

              <section className="invoice-detail-card">
                <div className="invoice-detail-card-heading">
                  <div>
                    <h2>Statement overview</h2>
                    <p>Reporting period and publication information.</p>
                  </div>
                </div>

                <div className="invoice-detail-grid">
                  <div>
                    <span>Statement ID</span>
                    <strong>{statement.id}</strong>
                  </div>

                  <div>
                    <span>Reporting period</span>
                    <strong>{statement.period}</strong>
                  </div>

                  <div>
                    <span>Closed trips</span>
                    <strong>{statement.tripCount}</strong>
                  </div>

                  <div>
                    <span>Published on</span>
                    <strong>{statement.publishedDate}</strong>
                  </div>

                  <div>
                    <span>Statement status</span>
                    <strong>{statement.status}</strong>
                  </div>
                </div>
              </section>

              <section className="invoice-detail-card">
                <div className="invoice-detail-card-heading">
                  <div>
                    <h2>Financial breakdown</h2>
                    <p>
                      Trip value and revenue shares for this billing cycle.
                    </p>
                  </div>
                </div>

                <div className="invoice-financial-grid">
                  <div className="invoice-financial-item">
                    <span>Total trip amount</span>
                    <strong>
                      {formatCurrency(statement.totalTripAmount)}
                    </strong>
                  </div>

                  <div className="invoice-financial-item">
                    <span>Company share</span>
                    <strong>
                      {formatCurrency(statement.companyShare)}
                    </strong>
                  </div>

                  <div className="invoice-financial-item">
                    <span>Driver share</span>
                    <strong>
                      {formatCurrency(statement.driverShare)}
                    </strong>
                  </div>

                  <div className="invoice-financial-item">
                    <span>Reported expenses</span>
                    <strong>
                      {formatCurrency(statement.totalExpenses)}
                    </strong>
                  </div>
                </div>

                {statement.items && statement.items.length > 0 && (
                  <div style={{ marginTop: "28px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
                      Itemized Closed Trips ({statement.items.length})
                    </h3>
                    <div className="invoices-table-wrapper" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                      <table className="invoices-table">
                        <thead>
                          <tr>
                            <th>TRIP / ORDER</th>
                            <th>ROUTE</th>
                            <th>DRIVER</th>
                            <th>COMPLETED ON</th>
                            <th style={{ textAlign: "right" }}>TRIP AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statement.items.map((item) => (
                            <tr key={item.id || item.trip_id}>
                              <td>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <strong style={{ color: "var(--text-primary)", fontSize: "12px" }}>
                                    {item.tripId}
                                  </strong>
                                  <small style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                                    {item.orderId}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span>{item.pickup}</span>
                                  {item.pickup_map_url && (
                                    <a
                                      href={item.pickup_map_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="View pickup location"
                                      style={{ color: "var(--hired-blue)", fontSize: "10px" }}
                                    >
                                      ↗
                                    </a>
                                  )}
                                  <span style={{ color: "var(--text-muted)" }}>→</span>
                                  <span>{item.delivery}</span>
                                  {item.delivery_map_url && (
                                    <a
                                      href={item.delivery_map_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="View delivery location"
                                      style={{ color: "var(--hired-blue)", fontSize: "10px" }}
                                    >
                                      ↗
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td>{item.driver || "Assigned Driver"}</td>
                              <td>
                                {item.closed_at
                                  ? new Date(item.closed_at).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "—"}
                              </td>
                              <td style={{ textAlign: "right", fontWeight: 700 }}>
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <p className="invoice-financial-note">
                  This monthly statement was verified by two authorized administrators prior to publication in accordance with HireD audit standards.
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default InvoiceDetailsPage;