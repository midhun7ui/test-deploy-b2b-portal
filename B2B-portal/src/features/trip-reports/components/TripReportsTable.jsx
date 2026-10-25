import { useNavigate } from "react-router-dom";

function TripReportsTable({ reports = [], loading = false }) {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  return (
    <section className="trip-reports-table-section">
      <div className="trip-reports-table-heading">
        <div>
          <h2>All Trip Reports</h2>
          <p>Review completed trips, delivery details, and reported expenses.</p>
        </div>

        <span className="trip-reports-result-count">
          {reports.length} {reports.length === 1 ? "report" : "reports"}
        </span>
      </div>

      <div className="trip-reports-table-wrapper">
        <table className="trip-reports-table">
          <thead>
            <tr>
              <th>REPORT ID</th>
              <th>TRIP / ORDER</th>
              <th>ROUTE</th>
              <th>DRIVER</th>
              <th>COMPLETED ON</th>
              <th>TRIP AMOUNT</th>
              <th>EXPENSES</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="trip-reports-empty">
                  <strong>Loading trip reports...</strong>
                  <span>Please wait while reports are fetched from the server.</span>
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report) => {
                const isAvailable = report.status === "Available";

                return (
                  <tr key={report.id}>
                    <td>
                      {isAvailable ? (
                        <button
                          type="button"
                          className="trip-report-link"
                          onClick={() =>
                            navigate(`/trip-reports/${report.id}`)
                          }
                        >
                          {report.id}
                        </button>
                      ) : (
                        <span className="trip-report-pending-reference">
                          Not generated
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="trip-report-reference">
                        <span>{report.tripId}</span>
                        <small>{report.orderId}</small>
                      </div>
                    </td>

                    <td>
                      <div className="trip-report-route">
                        <span>{report.pickup}</span>
                        <span
                          className="trip-report-route-arrow"
                          aria-hidden="true"
                        >
                          →
                        </span>
                        <span>{report.delivery}</span>
                      </div>
                    </td>

                    <td>{report.driver}</td>
                    <td>{report.completionDate}</td>
                    <td>{formatCurrency(report.amount)}</td>
                    <td>{formatCurrency(report.expenses)}</td>

                    <td>
                      <span
                        className={`trip-report-status ${
                          isAvailable
                            ? "trip-report-status-available"
                            : "trip-report-status-pending"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td>
                      {isAvailable ? (
                        <button
                          type="button"
                          className="trip-report-view-button"
                          onClick={() =>
                            navigate(`/trip-reports/${report.id}`)
                          }
                        >
                          View details
                        </button>
                      ) : (
                        <span className="trip-report-pending-reference">
                          Not generated
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="trip-reports-empty">
                  <strong>No reports found</strong>
                  <span>
                    Try changing your search or status filter.
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TripReportsTable;