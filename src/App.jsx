
import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import heroImage from "./assets/M.png";
// import BackButton from "./components/BackButton";

function AppContent() {
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("movix-current-user") || "null"
      );
    } catch {
      return null;
    }
  });

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sync login status
  useEffect(() => {
    const syncUser = () => {
      try {
        setCurrentUser(
          JSON.parse(
            localStorage.getItem("movix-current-user") || "null"
          )
        );
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("movix-auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("movix-auth-change", syncUser);
    };
  }, []);

  // Close menus when the route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowProfile(false);
  }, [location.pathname]);

  // Handle Movies and About section navigation
  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) {
      return;
    }

    const sectionId = location.hash.slice(1);

    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  // Scroll to the top when navigating to a different page.
  // Hash links are handled by the effect above.
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.hash]);

  const goHome = () => {
    closeMobileMenu();

    if (location.pathname === "/" && !location.hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("movix-current-user");
    setCurrentUser(null);
    setShowProfile(false);
    setShowMobileMenu(false);
    window.dispatchEvent(new Event("movix-auth-change"));
  };

  function closeMobileMenu() {
    setShowMobileMenu(false);
  }

  return (
    <div className="movix-app">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark movix-navbar">
        <div className="container">
          {/* Logo */}
          <Link
            className="navbar-brand movix-logo"
            to="/"
            onClick={goHome}
          >
            MOV<span>IX</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() =>
              setShowMobileMenu((previous) => !previous)
            }
            aria-controls="movixNav"
            aria-expanded={showMobileMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation */}
          <div
            className={`navbar-collapse mobile-nav ${showMobileMenu ? "mobile-nav-open" : ""
              }`}
            id="movixNav"
          >
            <div className="navbar-nav mx-auto gap-lg-4">
              <Link
                className="nav-link"
                to="/"
                onClick={goHome}
              >
                Home
              </Link>

              <Link
                className="nav-link"
                to="/#movies"
                onClick={closeMobileMenu}
              >
                Movies
              </Link>

              <Link
                className="nav-link"
                to="/#about"
                onClick={closeMobileMenu}
              >
                About
              </Link>

              <Link
                className="nav-link"
                to="/my-bookings"
                onClick={closeMobileMenu}
              >
                My Bookings
              </Link>
            </div>

            {/* Profile / Login */}
            <div className="navbar-actions ms-auto">
              {currentUser ? (
                <div className="profile-wrapper">
                  <button
                    type="button"
                    className="btn profile-btn"
                    onClick={() =>
                      setShowProfile((previous) => !previous)
                    }
                    aria-expanded={showProfile}
                  >
                    <span className="profile-avatar">
                      {currentUser.name?.charAt(0).toUpperCase() || "U"}
                    </span>

                    Profile

                    <span className="profile-arrow">
                      {showProfile ? "▲" : "▼"}
                    </span>
                  </button>

                  {showProfile && (
                    <div className="profile-dropdown">
                      <h6>{currentUser.name || "Movix User"}</h6>
                      <p>{currentUser.email}</p>

                      <hr />

                      <Link
                        to="/my-bookings"
                        className="profile-menu-link"
                        onClick={() => {
                          setShowProfile(false);
                          closeMobileMenu();
                        }}
                      >
                        My Bookings
                      </Link>

                      <button
                        type="button"
                        className="btn logout-btn w-100 mt-2"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn movix-login-btn"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="btn movix-signup-btn"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Page Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Hero */}
              <section className="movix-hero">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-7">
                      <p className="movix-tagline">
                        YOUR CINEMA EXPERIENCE STARTS HERE
                      </p>

                      <h1 className="display-3 fw-bold">
                        Movies that move <span>you.</span>
                      </h1>

                      <p className="hero-description">
                        Discover your next favorite movie and book
                        your perfect seat with Movix.
                      </p>

                      <Link
                        to="/#movies"
                        className="btn movix-btn btn-lg mt-3"
                        onClick={closeMobileMenu}
                      >
                        Explore Movies →
                      </Link>
                    </div>

                    <div className="col-lg-5 movix-hero-image">
                      <img
                        src={heroImage}
                        alt="Cinematic movie experience"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <Home />
            </>
          }
        />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/seats"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer / About */}
      <footer className="movix-footer" id="about">
        <div className="container">
          <div className="row gy-4 align-items-start">
            <div className="col-12 col-md-4">
              <Link
                className="movix-logo"
                to="/"
                onClick={goHome}
              >
                MOV<span>IX</span>
              </Link>

              <p className="movix-footer-description mt-3">
                Your ultimate movie destination. Discover movies,
                choose your perfect seats, and enjoy a seamless
                cinema booking experience with Movix.
              </p>
            </div>

            <div className="col-6 col-md-4">
              <h5 className="movix-footer-heading">About Movix</h5>
              <p className="movix-footer-text">
                We make movie discovery and ticket booking simple.
                Explore movies, compare showtimes, select seats,
                and keep your digital tickets in one place.
              </p>
            </div>

            <div className="col-6 col-md-4">
              <h5 className="movix-footer-heading">Quick Links</h5>

              <div className="movix-footer-links">
                <Link to="/" onClick={goHome}>
                  Home
                </Link>

                <Link
                  to="/#movies"
                  onClick={closeMobileMenu}
                >
                  Movies
                </Link>

                <Link
                  to="/#about"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={closeMobileMenu}
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </div>



          <div className="movix-footer-bottom">
            <p>© 2026 Movix. All rights reserved.</p>
            {/* Social Media Links */}
            <div className="movix-social-links">
              <a
                href="https://www.linkedin.com/in/prabhasdhanikonda/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>

              <a
                href="https://github.com/Prabhas133"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
            </div>
            <p>
              Made with <span>❤️</span> for movie lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
