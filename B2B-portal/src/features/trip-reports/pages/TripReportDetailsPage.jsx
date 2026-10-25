import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";
import tripReportsApi from "../services/tripReportsApi";

function TripReportDetailsPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    tripReportsApi
      .getTripReportDetails(reportId)
      .then((data) => {
        if (isMounted) {
          setReport(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err?.response?.data?.detail ||
              err?.message ||
              "Failed to load trip report."
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
  }, [reportId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  const isAvailable = report?.status === "Available";

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page trip-report-details-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content trip-report-details-content">
          <button
            type="button"
            className="trip-report-back-button"
            onClick={() => navigate("/trip-reports")}
          >
            ← Back to Trip Reports
          </button>

          {loading ? (
            <section className="trip-report-details-empty">
              <h1>Loading report details...</h1>
              <p>Fetching trip report data from the server.</p>
            </section>
          ) : error || !report ? (
            <section className="trip-report-details-empty">
              <h1>Report not found</h1>
              <p>{error || "This trip report could not be located."}</p>
              <button
                type="button"
                className="trip-report-view-button"
                style={{ marginTop: "16px" }}
                onClick={() => navigate("/trip-reports")}
              >
                Return to reports list
              </button>
            </section>
          ) : (
            <>
              <header className="trip-report-details-header">
                <div>
                  <div className="trip-report-details-breadcrumb">
                    <span>Operations</span>
                    <span>/</span>
                    <span>Trip Reports</span>
                    <span>/</span>
                    <strong>{report.id}</strong>
                  </div>

                  <span className="trip-reports-eyebrow">
                    TRIP DOCUMENTATION
                  </span>

                  <h1>{report.id}</h1>

                  <p>
                    Completion details, route information, and expenses for
                    trip {report.tripId}.
                  </p>
                </div>

                <span
                  className={`trip-report-status ${
                    isAvailable
                      ? "trip-report-status-available"
                      : "trip-report-status-pending"
                  }`}
                >
                  {report.status}
                </span>
              </header>

              {!isAvailable ? (
                <div className="trip-report-pending-notice">
                  This trip is awaiting closure. Its final report will
                  become fully available once the trip has been closed by operations.
                </div>
              ) : (
                <>
                  <section className="trip-report-detail-card">
                    <div className="trip-report-detail-card-heading">
                      <div>
                        <h2>Trip overview</h2>
                        <p>Identifiers and delivery information.</p>
                      </div>
                    </div>

                    <div className="trip-report-detail-grid">
                      <div>
                        <span>Report ID</span>
                        <strong>{report.id}</strong>
                      </div>

                      <div>
                        <span>Trip ID</span>
                        <strong>{report.tripId}</strong>
                      </div>

                      <div>
                        <span>Order ID</span>
                        <strong>{report.orderId}</strong>
                      </div>

                      <div>
                        <span>Driver</span>
                        <strong>
                          {report.driver}
                          {report.driver_phone && (
                            <small style={{ display: "block", color: "var(--text-secondary)", fontWeight: 400 }}>
                              {report.driver_phone}
                            </small>
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Pickup location</span>
                        <strong>{report.pickup}</strong>
                        {report.pickup_map_url && (
                          <a
                            href={report.pickup_map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "11px",
                              color: "var(--hired-blue)",
                              textDecoration: "underline",
                              marginTop: "4px",
                            }}
                          >
                            View on Google Maps ↗
                          </a>
                        )}
                      </div>

                      <div>
                        <span>Delivery location</span>
                        <strong>{report.delivery}</strong>
                        {report.delivery_map_url && (
                          <a
                            href={report.delivery_map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "11px",
                              color: "var(--hired-blue)",
                              textDecoration: "underline",
                              marginTop: "4px",
                            }}
                          >
                            View on Google Maps ↗
                          </a>
                        )}
                      </div>

                      <div>
                        <span>Completion date</span>
                        <strong>{report.completionDate}</strong>
                      </div>

                      <div>
                        <span>Report status</span>
                        <strong>{report.status}</strong>
                      </div>
                    </div>
                  </section>

                  <section className="trip-report-detail-card">
                    <div className="trip-report-detail-card-heading">
                      <div>
                        <h2>Trip financial summary</h2>
                        <p>
                          Expenses recorded for this trip against trip earnings.
                        </p>
                      </div>
                    </div>

                    <div className="trip-report-financial-grid">
                      <div className="trip-report-financial-item">
                        <span>Trip amount</span>
                        <strong>{formatCurrency(report.amount)}</strong>
                      </div>

                      <div className="trip-report-financial-item">
                        <span>Reported expenses</span>
                        <strong>{formatCurrency(report.expenses)}</strong>
                      </div>
                    </div>

                    {report.expenses_items && report.expenses_items.length > 0 && (
                      <div style={{ marginTop: "24px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
                          Itemized Expenses ({report.expenses_items.length})
                        </h3>
                        <div className="trip-reports-table-wrapper" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                          <table className="trip-reports-table">
                            <thead>
                              <tr>
                                <th>CATEGORY</th>
                                <th>DESCRIPTION</th>
                                <th>RECEIPT</th>
                                <th style={{ textAlign: "right" }}>AMOUNT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.expenses_items.map((exp) => (
                                <tr key={exp.id || exp.numeric_id}>
                                  <td>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                      {exp.category}
                                    </span>
                                  </td>
                                  <td>{exp.description || "—"}</td>
                                  <td>
                                    {exp.receipt_url ? (
                                      <a
                                        href={exp.receipt_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "var(--hired-blue)", textDecoration: "underline" }}
                                      >
                                        View Receipt ↗
                                      </a>
                                    ) : (
                                      <span style={{ color: "var(--text-muted)" }}>None</span>
                                    )}
                                  </td>
                                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                                    {formatCurrency(exp.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <p className="trip-report-financial-note">
                      Financial figures are verified against live accounting records and submitted driver expense slips.
                    </p>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default TripReportDetailsPage;