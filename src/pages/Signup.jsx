
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const users = JSON.parse(
        localStorage.getItem("movix-users") || "[]"
      );

      if (
        users.some(
          (user) => user.email.toLowerCase() === email.trim().toLowerCase()
        )
      ) {
        setError("An account with this email already exists.");
        return;
      }

      // Demo only: do not store real passwords in localStorage.
      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      localStorage.setItem(
        "movix-users",
        JSON.stringify([...users, newUser])
      );

      navigate("/login", {
        state: { message: "Account created! Please log in." },
      });
    } catch {
      setError("Unable to create your account. Please try again.");
    }
  };

  return (
    <section className="auth-page container">
      <div className="auth-card">
        <p className="movix-tagline text-center">JOIN MOVIX</p>
        <h2 className="text-center fw-bold mb-2">Create Account</h2>
        <p className="auth-subtitle text-center mb-4">
          Create an account and enjoy your movie experience.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label" htmlFor="signup-name">
              Full Name
            </label>
            <input
              id="signup-name"
              className="form-control"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="signup-email">
              Email Address
            </label>
            <input
              id="signup-email"
              className="form-control"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="form-control"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              className="form-control"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn movix-btn w-100">
            Create Account
          </button>
        </form>

        <p className="text-center mt-4 mb-0 auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Signup;
