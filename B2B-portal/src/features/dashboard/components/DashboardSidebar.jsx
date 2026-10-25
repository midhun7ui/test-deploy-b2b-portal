import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../../auth/authState";

function DashboardSidebar() {
  const user = getCurrentUser();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-brand">
        <img src="/logo.svg" alt="HireD" />

        <span>B2B Portal</span>
      </div>

      <nav className="dashboard-navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="dashboard-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />
            </svg>
          </span>

          <span>Dashboard</span>
        </NavLink>

        <div className="dashboard-nav-section">
          <p>OPERATIONS</p>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 4h12a1 1 0 0 1 1 1v14H5V5a1 1 0 0 1 1-1Z" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </span>

            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/trips"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3 6h11v11H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
              </svg>
            </span>

            <span>Trips</span>
          </NavLink>

          <NavLink
            to="/trip-reports"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M14 3v5h5M9 13h6M9 17h6" />
              </svg>
            </span>

            <span>Trip Reports</span>
          </NavLink>
        </div>

        <div className="dashboard-nav-section">
          <p>FINANCE</p>

          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
                <path d="M9 8h6M9 12h6M9 16h4" />
              </svg>
            </span>

            <span>Invoices & Statements</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
            </span>

            <span>Reports & Analytics</span>
          </NavLink>
        </div>

        <div className="dashboard-nav-section">
          <p>ACCOUNT</p>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
                <path d="M10 21h4" />
              </svg>
            </span>

            <span>Notifications</span>
          </NavLink>

          <NavLink
            to="/company"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 21V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16" />
                <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2" />
              </svg>
            </span>

            <span>Company Profile</span>
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="dashboard-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 1.1c0 1.6-2.5 1.7-2.5 3.2M12 16.5h.01" />
              </svg>
            </span>

            <span>Support</span>
          </NavLink>
        </div>
      </nav>

      <div className="dashboard-sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="dashboard-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
              <path d="m19 13 .1-1-.1-1 2-1.5-2-3-2.3.8a7.5 7.5 0 0 0-1.7-1L14.7 4h-5l-.3 2.3a7.5 7.5 0 0 0-1.7 1L5.4 6.5l-2 3L5.3 11a7.5 7.5 0 0 0-.1 1c0 .3 0 .7.1 1l-1.9 1.5 2 3 2.3-.8a7.5 7.5 0 0 0 1.7 1l.3 2.3h5l.3-2.3a7.5 7.5 0 0 0 1.7-1l2.3.8 2-3z" />
            </svg>
          </span>

          <span>Settings</span>
        </NavLink>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div className="dashboard-user-info">
            <strong>{user?.username || "Partner"}</strong>
            <span>{user?.email || "B2B Partner"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;