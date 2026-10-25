import { useCallback, useEffect, useState } from "react";

import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import InvoicesHeader from "../components/InvoicesHeader";
import InvoiceStats from "../components/InvoiceStats";
import InvoicesFilters from "../components/InvoicesFilters";
import InvoicesTable from "../components/InvoicesTable";
import PartnerOrderInvoiceModal from "../components/PartnerOrderInvoiceModal";
import invoicesApi from "../services/invoicesApi";

const DEFAULT_STATS = [
  {
    label: "Published Statements",
    value: "0",
    description: "Available to view",
    type: "published",
  },
  {
    label: "Total Trips",
    value: "0",
    description: "Trips across listed periods",
    type: "trips",
  },
  {
    label: "Total Trip Amount",
    value: "₹0",
    description: "Across listed periods",
    type: "amount",
  },
  {
    label: "Company Share",
    value: "₹0",
    description: "Across listed periods",
    type: "share",
  },
];

function InvoicesPage() {
  // Navigation tab: "orders" (Rule 46 GST Invoices) vs "statements" (Monthly Statements)
  const [activeTab, setActiveTab] = useState("orders");

  // Monthly Statements State
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("All");
  const [statements, setStatements] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order Invoices State
  const [orderInvoices, setOrderInvoices] = useState([]);
  const [uninvoicedOrders, setUninvoicedOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total_count: 0,
    uninvoiced_count: 0,
    total_taxable: 0,
    total_tax: 0,
    total_billed: 0,
  });
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [orderLoading, setOrderLoading] = useState(true);
  const [generatingOrderId, setGeneratingOrderId] = useState(null);
  const [selectedOrderInvoice, setSelectedOrderInvoice] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const formatINR = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt ?? 0);

  // Fetch Statements
  const fetchStatements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoicesApi.listStatements({
        year,
        search,
      });
      setStatements(data?.statements || []);
      if (data?.stats && Array.isArray(data.stats) && data.stats.length > 0) {
        setStats(data.stats);
      }
      if (data?.years && Array.isArray(data.years) && data.years.length > 0) {
        setYears(data.years);
      } else if (data?.statements && data.statements.length > 0) {
        const extracted = [
          ...new Set(
            data.statements.map((s) => s.periodKey?.slice(0, 4) || String(s.year))
          ),
        ].sort((a, b) => b.localeCompare(a));
        setYears(extracted);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load published statements."
      );
    } finally {
      setLoading(false);
    }
  }, [year, search]);

  // Fetch Order Invoices
  const fetchOrderInvoices = useCallback(async () => {
    setOrderLoading(true);
    try {
      const data = await invoicesApi.listOrderInvoices({
        search: orderSearch,
        status: orderStatusFilter !== "All" ? orderStatusFilter : undefined,
      });
      setOrderInvoices(data?.invoices || []);
      setUninvoicedOrders(data?.uninvoiced_orders || []);
      if (data?.stats) {
        setOrderStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load order invoices:", err);
    } finally {
      setOrderLoading(false);
    }
  }, [orderSearch, orderStatusFilter]);

  useEffect(() => {
    fetchStatements();
  }, [fetchStatements]);

  useEffect(() => {
    fetchOrderInvoices();
  }, [fetchOrderInvoices]);

  const handleResetStatements = () => {
    setSearch("");
    setYear("All");
  };

  // Generate on-demand invoice for uninvoiced order
  const handleGenerateInvoice = async (orderId) => {
    setGeneratingOrderId(orderId);
    try {
      const res = await invoicesApi.generateOrderInvoice(orderId);
      setToastMessage({
        type: "success",
        text: `Tax Invoice ${res.invoice_number} generated successfully for Order ORD-${String(orderId).padStart(4, "0")}!`,
      });
      await fetchOrderInvoices();
    } catch (err) {
      setToastMessage({
        type: "error",
        text: err?.response?.data?.detail || "Could not generate invoice for order.",
      });
    } finally {
      setGeneratingOrderId(null);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleOpenInvoiceModal = (inv) => {
    setSelectedOrderInvoice(inv);
    setIsOrderModalOpen(true);
  };

  const handleDownloadPdf = (inv) => {
    if (inv.pdf_url) {
      window.open(inv.pdf_url, "_blank");
    } else {
      window.open(`/api/v1/partner/order-invoices/${inv.id}/pdf/?download=1`, "_blank");
    }
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page trips-page invoices-dashboard-page">
        <DashboardTopbar />

        <div className="trips-content invoices-content">
          <InvoicesHeader />

          {/* Toast / Notification Banner */}
          {toastMessage && (
            <div
              role="alert"
              style={{
                margin: "0 0 1rem 0",
                padding: "0.875rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor:
                  toastMessage.type === "success"
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(239, 68, 68, 0.12)",
                border: `1px solid ${
                  toastMessage.type === "success"
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
                }`,
                color: toastMessage.type === "success" ? "#047857" : "#b91c1c",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              <span>{toastMessage.text}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1rem",
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                margin: "0 0 1.5rem 0",
                padding: "0.875rem 1.25rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.875rem",
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchStatements}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #f87171",
                  color: "#f87171",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* GST Compliance Header Information Card */}
          <section
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  backgroundColor: "#1e3a8a",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                🏛️
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                  BILLING &amp; GST COMPLIANCE — HireD Freight Logistics
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Supplier GSTIN: <strong style={{ color: "#1e3a8a" }}>32AAACH8821K1ZZ</strong> | SAC: <strong style={{ color: "#047857" }}>996511</strong> (Goods Transport Agency) | State: <strong>32-Kerala</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ padding: "6px 12px", backgroundColor: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "#1e40af", fontWeight: 700, textTransform: "uppercase" }}>Rule 46 CGST</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e3a8a" }}>Tax Invoices Ready</div>
              </div>
              <div style={{ padding: "6px 12px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px solid #bbf7d0", textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "#15803d", fontWeight: 700, textTransform: "uppercase" }}>ITC Admissible</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#166534" }}>18% GST (9% CGST + 9% SGST)</div>
              </div>
            </div>
          </section>

          {/* Primary View Switcher Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "1.5rem",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.6rem 1.25rem",
                borderRadius: "8px 8px 0 0",
                border: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                backgroundColor: activeTab === "orders" ? "#1e3a8a" : "transparent",
                color: activeTab === "orders" ? "#ffffff" : "#64748b",
                transition: "all 0.15s ease",
              }}
            >
              <span>🧾</span>
              Order Tax Invoices ({orderInvoices.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("statements")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.6rem 1.25rem",
                borderRadius: "8px 8px 0 0",
                border: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                backgroundColor: activeTab === "statements" ? "#1e3a8a" : "transparent",
                color: activeTab === "statements" ? "#ffffff" : "#64748b",
                transition: "all 0.15s ease",
              }}
            >
              <span>📊</span>
              Monthly Company Statements ({statements.length})
            </button>
          </div>

          {/* TAB 1: ORDER TAX INVOICES */}
          {activeTab === "orders" && (
            <>
              {/* Order Invoice Metrics */}
              <section className="invoice-stats" style={{ marginBottom: "1.5rem" }}>
                <article className="invoice-stat-card invoice-stat-published">
                  <div className="invoice-stat-top">
                    <span className="invoice-stat-label">Invoiced Orders</span>
                    <span className="invoice-stat-icon" aria-hidden="true">▤</span>
                  </div>
                  <strong className="invoice-stat-value">{orderStats.total_count}</strong>
                  <span className="invoice-stat-description">SAC 996511 (GTA Transport)</span>
                </article>

                <article className="invoice-stat-card invoice-stat-trips">
                  <div className="invoice-stat-top">
                    <span className="invoice-stat-label">Taxable Freight</span>
                    <span className="invoice-stat-icon" aria-hidden="true">₹</span>
                  </div>
                  <strong className="invoice-stat-value">{formatINR(orderStats.total_taxable)}</strong>
                  <span className="invoice-stat-description">Direct commercial freight</span>
                </article>

                <article className="invoice-stat-card invoice-stat-share">
                  <div className="invoice-stat-top">
                    <span className="invoice-stat-label">Total GST Accrued</span>
                    <span className="invoice-stat-icon" aria-hidden="true">◉</span>
                  </div>
                  <strong className="invoice-stat-value">{formatINR(orderStats.total_tax)}</strong>
                  <span className="invoice-stat-description">18% ITC Admissible</span>
                </article>

                <article className="invoice-stat-card invoice-stat-amount">
                  <div className="invoice-stat-top">
                    <span className="invoice-stat-label">Total Billed Value</span>
                    <span className="invoice-stat-icon" aria-hidden="true">₹</span>
                  </div>
                  <strong className="invoice-stat-value">{formatINR(orderStats.total_billed)}</strong>
                  <span className="invoice-stat-description">Freight + GST Total</span>
                </article>
              </section>

              {/* Uninvoiced Orders Banner (if any) */}
              {uninvoicedOrders.length > 0 && (
                <section
                  style={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "10px",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#92400e" }}>
                        ⚡ Uninvoiced Orders Available ({uninvoicedOrders.length})
                      </h3>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#b45309" }}>
                        The following orders have been completed or scheduled but do not yet have an official GST Tax Invoice. You can generate an instant Rule 46 Tax Invoice now.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.75rem" }}>
                    {uninvoicedOrders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #fcd34d",
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>
                            {ord.order_number}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {ord.pickup_location} → {ord.drop_location}
                          </div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e3a8a", marginTop: "2px" }}>
                            Est. Freight: {formatINR(ord.trip_amount)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleGenerateInvoice(ord.id)}
                          disabled={generatingOrderId === ord.id}
                          style={{
                            backgroundColor: "#1e3a8a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.45rem 0.85rem",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: generatingOrderId === ord.id ? "not-allowed" : "pointer",
                            opacity: generatingOrderId === ord.id ? 0.7 : 1,
                          }}
                        >
                          {generatingOrderId === ord.id ? "Generating..." : "Generate Invoice"}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Order Invoices Filters */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                  backgroundColor: "#ffffff",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by invoice #, order #, or route..."
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <label htmlFor="order-status-select" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
                    Status:
                  </label>
                  <select
                    id="order-status-select"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="generated">Generated</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOrderSearch("");
                    setOrderStatusFilter("All");
                  }}
                  style={{
                    padding: "0.5rem 0.85rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#f8fafc",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Order Invoices Table */}
              <section className="invoices-table-section">
                <div className="invoices-table-heading">
                  <div>
                    <h2>Order Tax Invoices (Rule 46 GST)</h2>
                    <p>Official tax invoices with SAC 996511 and full tax breakdown for input credit.</p>
                  </div>

                  <span className="invoices-result-count">
                    {orderInvoices.length}{" "}
                    {orderInvoices.length === 1 ? "invoice" : "invoices"}
                  </span>
                </div>

                <div className="invoices-table-wrapper">
                  <table className="invoices-table">
                    <thead>
                      <tr>
                        <th>INVOICE #</th>
                        <th>ORDER REF</th>
                        <th>ROUTE &amp; CARGO</th>
                        <th>VEHICLE</th>
                        <th>DATE</th>
                        <th>SAC</th>
                        <th>TAXABLE AMT</th>
                        <th>GST (18%)</th>
                        <th>TOTAL INVOICE</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderLoading ? (
                        <tr>
                          <td colSpan={11} className="invoices-empty">
                            <strong>Loading order invoices...</strong>
                            <span>Fetching GST-compliant tax invoices from the server.</span>
                          </td>
                        </tr>
                      ) : orderInvoices.length > 0 ? (
                        orderInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td>
                              <button
                                type="button"
                                className="invoice-link"
                                onClick={() => handleOpenInvoiceModal(inv)}
                                style={{ fontWeight: 700 }}
                              >
                                {inv.invoice_number}
                              </button>
                            </td>

                            <td>
                              <span style={{ fontWeight: 600, color: "#1e3a8a" }}>
                                ORD-{String(inv.order_id).padStart(4, "0")}
                              </span>
                            </td>

                            <td>
                              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                                {inv.pickup_location} → {inv.drop_location}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                {inv.cargo_type || "General Commercial"}
                              </div>
                            </td>

                            <td>{inv.vehicle_number}</td>

                            <td>
                              {new Date(inv.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td>
                              <span
                                style={{
                                  backgroundColor: "#f1f5f9",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              >
                                {inv.sac_code}
                              </span>
                            </td>

                            <td>{formatINR(inv.taxable_amount)}</td>

                            <td>{formatINR(inv.total_tax)}</td>

                            <td>
                              <strong style={{ color: "#1e3a8a" }}>
                                {formatINR(inv.total_amount)}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`invoice-status ${
                                  inv.status === "paid"
                                    ? "invoice-status-paid"
                                    : "invoice-status-published"
                                }`}
                              >
                                {inv.status.toUpperCase()}
                              </span>
                            </td>

                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <button
                                  type="button"
                                  className="invoice-view-button"
                                  onClick={() => handleOpenInvoiceModal(inv)}
                                >
                                  View Invoice
                                </button>
                                <button
                                  type="button"
                                  title="Download S3 PDF"
                                  onClick={() => handleDownloadPdf(inv)}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#1E3A8A",
                                    backgroundColor: "rgba(30, 58, 138, 0.08)",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                >
                                  PDF ↗
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={11} className="invoices-empty">
                            <strong>No order tax invoices found</strong>
                            <span>
                              {orderSearch
                                ? "No invoices matched your search filter."
                                : "Click 'Generate Invoice' on an unbilled order above to create an official tax invoice."}
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: MONTHLY COMPANY STATEMENTS */}
          {activeTab === "statements" && (
            <>
              <InvoiceStats stats={stats} />

              <InvoicesFilters
                search={search}
                onSearchChange={setSearch}
                year={year}
                onYearChange={setYear}
                years={years}
                onReset={handleResetStatements}
              />

              <InvoicesTable invoices={statements} loading={loading} />
            </>
          )}
        </div>
      </main>

      {/* Full Rule 46 GST Tax Invoice Inspector Modal */}
      <PartnerOrderInvoiceModal
        invoice={selectedOrderInvoice}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrderInvoice(null);
        }}
      />
    </div>
  );
}

export default InvoicesPage;