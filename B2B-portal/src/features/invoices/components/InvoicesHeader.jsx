function InvoicesHeader() {
  return (
    <section className="invoices-header">
      <div className="invoices-breadcrumb">
        <span>Dashboard</span>
        <span aria-hidden="true">/</span>
        <strong>Invoices &amp; Statements</strong>
      </div>

      <span className="invoices-eyebrow">FINANCE</span>

      <h1>Invoices &amp; Statements</h1>

      <p>
        Review your published monthly statements, trip totals, and
        financial breakdowns.
      </p>
    </section>
  );
}

export default InvoicesHeader;