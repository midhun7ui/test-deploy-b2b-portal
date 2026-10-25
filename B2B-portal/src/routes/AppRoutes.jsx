import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import OrdersPage from "../features/orders/pages/OrdersPage";
import CreateOrderPage from "../features/orders/pages/CreateOrderPage";
import OrderDetailsPage from "../features/orders/pages/OrderDetailsPage";
import TripsPage from "../features/trips/pages/TripsPage";
import TripDetailsPage from "../features/trips/pages/TripDetailsPage";
import TripReportsPage from "../features/trip-reports/pages/TripReportsPage";
import TripReportDetailsPage from "../features/trip-reports/pages/TripReportDetailsPage";
import InvoicesPage from "../features/invoices/pages/InvoicesPage";
import InvoiceDetailsPage from "../features/invoices/pages/InvoiceDetailsPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import ReportDetailsPage from "../features/reports/pages/ReportDetailsPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import CompanyProfilePage from "../features/company/pages/CompanyProfilePage";
import SupportPage from "../features/support/pages/SupportPage";
import SupportTicketDetailsPage from "../features/support/pages/SupportTicketDetailsPage";
import SettingsPage from "../features/settings/pages/SettingsPage";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={<OrdersPage />}
        />
        <Route 
          path="/orders/create" 
          element={<CreateOrderPage/>}
        />
        <Route
          path="/orders/:orderId"
          element={<OrderDetailsPage/>}
        />
        <Route 
          path="/trips" 
          element={<TripsPage />} 
        />
        <Route
          path="/trips/:tripId"
          element={<TripDetailsPage/>}
        />
        <Route
          path="/trip-reports"
          element={<TripReportsPage />}
        />
        <Route
          path="/trip-reports/:reportId"
          element={<TripReportDetailsPage />}
        />
        <Route
          path="/invoices"
          element={<InvoicesPage />}
        />
        <Route
          path="/invoices/:invoiceId"
          element={<InvoiceDetailsPage />}
        />
        <Route 
          path="/reports" 
          element={<ReportsPage />} 
        />
        <Route 
          path="/reports/:reportId" 
          element={<ReportDetailsPage />} 
        />
        <Route 
          path="/notifications" 
          element={<NotificationsPage />} 
        />
        <Route 
          path="/company" 
          element={<CompanyProfilePage />} 
        />
        <Route 
          path="/support" 
          element={<SupportPage />} 
        />
        <Route 
          path="/support/:ticketId" 
          element={<SupportTicketDetailsPage />} 
        />
        <Route 
          path="/settings" 
          element={<SettingsPage />} 
        />






      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;