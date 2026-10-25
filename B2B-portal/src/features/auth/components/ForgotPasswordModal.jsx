import { useState, useEffect } from "react";
import { forgotPassword } from "../authApi";

function ForgotPasswordModal({ isOpen, onClose, initialEmail = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setSubmitted(false);
      setError("");
    }
  }, [isOpen, initialEmail]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid corporate email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(cleanEmail);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to process request right now. Please check backend connection and try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card forgot-password-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {!submitted ? (
          <>
            <div className="modal-icon-badge">
              <span className="material-symbols-outlined">lock_reset</span>
            </div>

            <div className="modal-header">
              <h2>Reset your password</h2>
              <p>
                Enter your registered corporate email and we'll send you
                instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-field">
                <label htmlFor="reset-email">Corporate email address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">
                    mail
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    autoFocus
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span className="material-symbols-outlined">error</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="login-button reset-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Sending instructions..." : "Send Reset Link"}</span>
                {!isSubmitting && (
                  <span className="material-symbols-outlined">send</span>
                )}
                {isSubmitting && <span className="login-spinner" />}
              </button>
            </form>

            <div className="modal-help-tip">
              <span className="material-symbols-outlined">info</span>
              <span>
                <strong>Admin Tip:</strong> Company primary administrators can also
                instantly issue temporary access from the B2B portal.
              </span>
            </div>
          </>
        ) : (
          <div className="reset-success-state">
            <div className="modal-icon-badge success-badge">
              <span className="material-symbols-outlined">mark_email_read</span>
            </div>

            <div className="modal-header">
              <h2>Check your inbox</h2>
              <p>
                If an account exists for <strong>{email}</strong>, password reset
                instructions have been sent.
              </p>
            </div>

            <div className="reset-instruction-box">
              <div className="instruction-item">
                <span className="instruction-num">1</span>
                <span>Open the recovery email from HireD Security</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-num">2</span>
                <span>Click the secure link valid for 30 minutes</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-num">3</span>
                <span>Set your new corporate password</span>
              </div>
            </div>

            <button
              type="button"
              className="login-button reset-done-btn"
              onClick={onClose}
            >
              <span>Return to Sign In</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
