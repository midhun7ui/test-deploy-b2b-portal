import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../authApi";
import { setCurrentUser } from "../authState";

function LoginForm({ onForgotPassword }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const data = await login({ email, password });

      // Only partner accounts are allowed on this portal
      if (!data.user || data.user.role !== "partner") {
        setError("This portal is for business partners only.");
        // Clear the tokens that were just stored
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return;
      }

      setCurrentUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      if (error.status === 401) {
        setError("Invalid email or password.");
      } else if (error.status === 403) {
        setError("Your account has been blocked. Contact your administrator.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="form-field">
        <label htmlFor="email">
          Corporate email address
        </label>

        <div className="input-wrapper">
          <span className="material-symbols-outlined input-icon">
            mail
          </span>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="name@company.com"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="form-field">
        <div className="form-field-header">
          <label htmlFor="password">
            Password
          </label>
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => onForgotPassword?.(email)}
          >
            Forgot password?
          </button>
        </div>

        <div className="input-wrapper">
          <span className="material-symbols-outlined input-icon">
            key
          </span>

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined">
              {showPassword
                ? "visibility_off"
                : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="login-error" role="alert">
          <span className="material-symbols-outlined">
            error
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="login-button"
        disabled={isSubmitting}
      >
        <span>
          {isSubmitting ? "Signing in..." : "Sign in to portal"}
        </span>

        {!isSubmitting && (
          <span className="material-symbols-outlined">
            arrow_forward
          </span>
        )}

        {isSubmitting && (
          <span className="login-spinner" />
        )}
      </button>
    </form>
  );
}

export default LoginForm;