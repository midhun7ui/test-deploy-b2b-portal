import { useNavigate } from "react-router-dom";

function InvoicesTable({ invoices = [], loading = false }) {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  return (
    <section className="invoices-table-section">
      <div className="invoices-table-heading">
        <div>
          <h2>Published Statements</h2>
          <p>Monthly statements available to your company.</p>
        </div>

        <span className="invoices-result-count">
          {invoices.length}{" "}
          {invoices.length === 1 ? "statement" : "statements"}
        </span>
      </div>

      <div className="invoices-table-wrapper">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>STATEMENT ID</th>
              <th>REPORTING PERIOD</th>
              <th>CLOSED TRIPS</th>
              <th>TRIP AMOUNT</th>
              <th>COMPANY SHARE</th>
              <th>DRIVER SHARE</th>
              <th>PUBLISHED ON</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="invoices-empty">
                  <strong>Loading statements...</strong>
                  <span>Fetching published statements from the server.</span>
                </td>
              </tr>
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <button
                      type="button"
                      className="invoice-link"
                      onClick={() =>
                        navigate(`/invoices/${invoice.id}`)
                      }
                    >
                      {invoice.id}
                    </button>
                  </td>

                  <td>{invoice.period}</td>

                  <td>{invoice.tripCount}</td>

                  <td>{formatCurrency(invoice.totalTripAmount)}</td>

                  <td>{formatCurrency(invoice.companyShare)}</td>

                  <td>{formatCurrency(invoice.driverShare)}</td>

                  <td>{invoice.publishedDate}</td>

                  <td>
                    <span className="invoice-status invoice-status-published">
                      {invoice.status}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        className="invoice-view-button"
                        onClick={() =>
                          navigate(`/invoices/${invoice.id}`)
                        }
                      >
                        View details
                      </button>
                      {(invoice.pdf_url || invoice.pdfUrl) && (
                        <a
                          href={invoice.pdf_url || invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download S3 PDF"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#1E3A8A",
                            backgroundColor: "rgba(30, 58, 138, 0.08)",
                            borderRadius: "4px",
                            textDecoration: "none",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          PDF ↗
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="invoices-empty">
                  <strong>No statements found</strong>
                  <span>
                    Try another reporting year or search term.
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

export default InvoicesTable;