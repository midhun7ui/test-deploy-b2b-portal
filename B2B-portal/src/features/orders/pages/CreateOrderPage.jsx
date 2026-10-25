import DashboardSidebar from "../../dashboard/components/DashboardSidebar";
import DashboardTopbar from "../../dashboard/components/DashboardTopbar";

import CreateOrderForm from "../components/CreateOrderForm";

function CreateOrderPage() {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar />

      <main className="dashboard-page create-order-page">
        <DashboardTopbar />

        <div className="create-order-content">
          <section className="create-order-header">
            <div>
              <div className="create-order-breadcrumb">
                <span>Orders</span>
                <span>/</span>
                <strong>Create Order</strong>
              </div>

              <span className="create-order-eyebrow">
                NEW ORDER
              </span>

              <h1>Create Order</h1>

              <p>
                Submit a new transport order for your business.
              </p>
            </div>
          </section>

          <CreateOrderForm />
        </div>
      </main>
    </div>
  );
}

export default CreateOrderPage;