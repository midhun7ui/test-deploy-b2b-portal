import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";
import reportsApi from "../services/reportsApi";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

function ReportDetailsPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    reportsApi
      .getReportDetails(reportId)
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
              "Failed to load analytics report."
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

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page report-details-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content report-details-content">
          <button
            type="button"
            className="report-details-back"
            onClick={() => navigate("/reports")}
          >
            ← Back to Reports
          </button>

          {loading ? (
            <section className="report-details-not-found">
              <h1>Loading report details...</h1>
              <p>Fetching analytics summary from the server.</p>
            </section>
          ) : error || !report ? (
            <section className="report-details-not-found">
              <h1>Report not found</h1>
              <p>
                {error ||
                  "This report may not exist or may no longer be available."}
              </p>
              <button type="button" onClick={() => navigate("/reports")}>
                Return to Reports
              </button>
            </section>
          ) : (
            <>
              <header className="report-details-header">
                <span className="reports-eyebrow">ANALYTICS REPORT</span>
                <h1>{report.period}</h1>
                <p>
                  Reporting period summary for your company's trip activity.
                </p>
              </header>

              <section className="report-details-overview">
                <div>
                  <span>Report ID</span>
                  <strong>{report.id}</strong>
                </div>

                <div>
                  <span>Reporting period</span>
                  <strong>{report.period}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{report.status || "Available"}</strong>
                </div>
              </section>

              <section className="report-details-metrics">
                <article className="report-details-metric">
                  <span>Completed Trips</span>
                  <strong>{report.completedTrips}</strong>
                </article>

                <article className="report-details-metric">
                  <span>Total Trip Value</span>
                  <strong>{formatINR(report.totalTripValue)}</strong>
                </article>

                <article className="report-details-metric">
                  <span>Average Trip Value</span>
                  <strong>{formatINR(report.averageTripValue)}</strong>
                </article>

                <article className="report-details-metric">
                  <span>Completion Rate</span>
                  <strong>{report.completionRate}%</strong>
                </article>
              </section>

              <section className="reports-analytics-card">
                <div className="reports-analytics-card-header">
                  <div>
                    <h2>Performance Summary</h2>
                    <p>Summary of the selected reporting period</p>
                  </div>
                </div>

                <div className="report-details-summary-row">
                  <span>Completed trips</span>
                  <strong>{report.completedTrips}</strong>
                </div>

                <div className="report-details-summary-row">
                  <span>Total trip value</span>
                  <strong>{formatINR(report.totalTripValue)}</strong>
                </div>

                <div className="report-details-summary-row">
                  <span>Average trip value</span>
                  <strong>{formatINR(report.averageTripValue)}</strong>
                </div>

                <div className="report-details-summary-row">
                  <span>Completion rate</span>
                  <strong>{report.completionRate}%</strong>
                </div>
              </section>

              {report.trips && report.trips.length > 0 && (
                <section className="reports-table-card" style={{ marginTop: "24px" }}>
                  <div className="reports-table-heading">
                    <div>
                      <h2>Completed Trips in this Period</h2>
                      <p>Trips closed during {report.period}</p>
                    </div>
                    <span className="reports-count">
                      {report.trips.length} {report.trips.length === 1 ? "trip" : "trips"}
                    </span>
                  </div>

                  <div className="reports-table-wrapper">
                    <table className="reports-table">
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
                        {report.trips.map((trip) => (
                          <tr key={trip.id} className="reports-table-row">
                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <strong style={{ color: "var(--text-primary)", fontSize: "12px" }}>
                                  {trip.tripId}
                                </strong>
                                <small style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                                  {trip.orderId}
                                </small>
                              </div>
                            </td>
                            <td>
                              <span>
                                {trip.pickup} → {trip.delivery}
                              </span>
                            </td>
                            <td>{trip.driver}</td>
                            <td>
                              {trip.closed_at
                                ? new Date(trip.closed_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 700 }}>
                              {formatINR(trip.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <p className="report-details-demo-note" style={{ marginTop: "18px" }}>
                Metrics and performance figures are aggregated from verified, closed trip records for your company.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ReportDetailsPage;
