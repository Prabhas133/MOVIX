import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    try {
      const users = JSON.parse(
        localStorage.getItem("movix-users") || "[]"
      );

      const user = users.find(
        (item) =>
          item.email?.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      );

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      // Store the current demo session without the password.
      const currentUser = {
        name: user.name,
        email: user.email,
      };

      localStorage.setItem(
        "movix-current-user",
        JSON.stringify(currentUser)
      );

      // Update the navbar immediately in the same tab.
      window.dispatchEvent(new Event("movix-auth-change"));

      // Return to the originally requested page after login.
      const destination = location.state?.from;

      if (destination?.pathname) {
        navigate(
          `${destination.pathname}${destination.search || ""}${destination.hash || ""}`,
          { replace: true }
        );
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      setError("Unable to log in. Please try again.");
    }
  };

  return (
    <section className="auth-page container">
      <div className="auth-card">
        <p className="movix-tagline text-center">WELCOME BACK</p>

        <h2 className="text-center fw-bold mb-2">
          Login to Movix
        </h2>

        <p className="auth-subtitle text-center mb-4">
          Sign in to continue your movie journey.
        </p>

        {location.state?.message && (
          <div className="alert alert-success">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              className="form-control"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn movix-btn w-100">
            Login
          </button>
        </form>

        <p className="text-center mt-4 mb-0 auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
