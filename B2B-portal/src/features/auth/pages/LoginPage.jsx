import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { isAuthenticated } from "../authState";

function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleOpenForgotPassword(email = "") {
    setResetEmail(email || "");
    setShowForgotPassword(true);
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-visual">
          <img
            src="/login-visual.png"
            alt="HireD business logistics operations"
            className="login-visual-image"
          />

          <div className="visual-business-badge">
            <span className="material-symbols-outlined">
              verified
            </span>

            <span>Business Logistics</span>
          </div>

          <div className="visual-caption">
            <span className="visual-caption-line" />

            <div>
              <span className="visual-caption-title">
                Connected operations
              </span>

              <span className="visual-caption-text">
                Orders · Trips · Statements
              </span>
            </div>
          </div>

          <div className="visual-status">
            <span className="visual-status-dot" />
            <span>Live operations</span>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-content">
            <div className="login-brand">
              <img
                src="/logo.svg"
                alt="HireD"
                className="login-logo"
              />

              <span className="login-badge">
                B2B Partner Portal
              </span>
            </div>

            <div className="login-header">
              <h1>Welcome back</h1>

              <p>
                Sign in to manage your orders, trips and statements.
              </p>
            </div>

            <LoginForm onForgotPassword={handleOpenForgotPassword} />

            <div className="login-support-card">
              <div className="support-card-icon-box">
                <span className="material-symbols-outlined">
                  support_agent
                </span>
              </div>

              <div className="support-card-text">
                <span className="support-card-title">
                  Need help accessing your account?
                </span>
                <p className="support-card-desc">
                  Contact your company administrator or{" "}
                  <button
                    type="button"
                    className="support-forgot-btn"
                    onClick={() => handleOpenForgotPassword()}
                  >
                    reset password
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>

          <footer className="login-footer">
            <div className="footer-left">
              <span className="footer-copy">© HireD</span>
              <span className="footer-divider">·</span>
              <span className="footer-tagline">Logistics Intelligence</span>
            </div>

            <div className="footer-badge">
              <span className="footer-pulse-dot" />
              <span>Business Partner Portal</span>
            </div>
          </footer>
        </div>
      </section>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        initialEmail={resetEmail}
      />
    </main>
  );
}

export default LoginPage;