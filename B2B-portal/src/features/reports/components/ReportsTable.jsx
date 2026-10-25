
import { useNavigate } from "react-router-dom";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

function ReportsTable({ reports = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <section className="reports-table-card">
      <div className="reports-table-heading">
        <div>
          <h2>Performance Reports</h2>
          <p>Monthly operational performance for your company.</p>
        </div>

        <span className="reports-count">
          {reports.length} {reports.length === 1 ? "report" : "reports"}
        </span>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>REPORT ID</th>
              <th>REPORTING PERIOD</th>
              <th>COMPLETED TRIPS</th>
              <th>TOTAL TRIP VALUE</th>
              <th>AVERAGE TRIP VALUE</th>
              <th>COMPLETION RATE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="reports-empty-state">
                    <strong>Loading performance reports...</strong>
                    <p>Fetching analytics records from the server.</p>
                  </div>
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="reports-table-row">
                  <td>
                    <button 
                      type="button"
                      className="reports-id reports-id-link"
                      onClick={() => navigate(`/reports/${report.id}`)}
                      aria-label={`View analytics report ${report.id}`}
                    >
                      {report.id}
                    </button>    
                  </td>

                  <td>{report.period}</td>

                  <td>{report.completedTrips}</td>

                  <td>{formatINR(report.totalTripValue)}</td>

                  <td>{formatINR(report.averageTripValue)}</td>

                  <td>
                    <span className="reports-completion">
                      {report.completionRate}%
                    </span>
                  </td>

                  <td>
                    <span className="reports-status">
                      {report.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="reports-view-button"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <div className="reports-empty-state">
                    <strong>No reports found</strong>
                    <p>Try changing your search or year filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReportsTable;
