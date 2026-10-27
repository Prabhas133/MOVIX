import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getTodayDate() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const loadBookings = () => {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("movix-bookings") || "[]"
      );

      const today = getTodayDate();

      setBookings(
        Array.isArray(savedBookings)
          ? savedBookings.filter((booking) => booking.date === today)
          : []
      );
    } catch (error) {
      console.error("Unable to load bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();

    window.addEventListener("focus", loadBookings);
    window.addEventListener("storage", loadBookings);

    return () => {
      window.removeEventListener("focus", loadBookings);
      window.removeEventListener("storage", loadBookings);
    };
  }, []);

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (isCancelling) return;

    setShowCancelModal(false);
    setSelectedBooking(null);
    setCancelError("");
  };

  const confirmCancelBooking = () => {
    if (!selectedBooking || isCancelling) return;

    setIsCancelling(true);
    setCancelError("");

    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("movix-bookings") || "[]"
      );

      if (!Array.isArray(savedBookings)) {
        throw new Error("Invalid booking history.");
      }

      const bookingToCancel = savedBookings.find(
        (item) => item.bookingId === selectedBooking.bookingId
      );

      if (!bookingToCancel) {
        throw new Error("Booking not found. Please refresh and try again.");
      }

      // Build the same storage key used when booking seats.
      const storageKey =
        `movix-booked-seats-${bookingToCancel.movieId}-${bookingToCancel.theatreId || bookingToCancel.theatre || "default"}-${bookingToCancel.screen || "Standard"}-${bookingToCancel.time}`;

      const savedSeats = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      if (!Array.isArray(savedSeats)) {
        throw new Error("Unable to read the booked seats.");
      }

      const seatsToRelease = Array.isArray(
        bookingToCancel.selectedSeats
      )
        ? bookingToCancel.selectedSeats
        : [];

      const remainingSeats = savedSeats.filter(
        (seat) => !seatsToRelease.includes(seat)
      );

      const updatedBookings = savedBookings.filter(
        (item) => item.bookingId !== bookingToCancel.bookingId
      );

      // Save the updated booking history and release seats.
      localStorage.setItem(
        "movix-bookings",
        JSON.stringify(updatedBookings)
      );

      localStorage.setItem(
        storageKey,
        JSON.stringify(remainingSeats)
      );

      setBookings(
        updatedBookings.filter(
          (item) => item.date === getTodayDate()
        )
      );

      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Unable to cancel booking:", error);
      setCancelError(
        error.message || "Unable to cancel booking. Please try again."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <p className="movix-tagline mb-2">YOUR MOVIE PLANS</p>
          <h2 className="fw-bold">Today's Bookings</h2>

          <p className="text-secondary mb-0">
            {bookings.length} booking
            {bookings.length !== 1 ? "s" : ""} for today
          </p>
        </div>

        <button
          className="btn btn-outline-light"
          onClick={loadBookings}
        >
          ↻ Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <h4>No bookings for today</h4>

          <p className="text-secondary">
            Book a movie ticket to see it here.
          </p>

          <Link to="/" className="btn movix-btn mt-3">
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking, index) => (
            <div
              className="col-md-6 col-lg-4"
              key={booking.bookingId || index}
            >
              <div className="movie-card h-100 p-4">
                {booking.poster && (
                  <img
                    src={booking.poster}
                    alt={booking.movieTitle}
                    className="img-fluid rounded mb-3"
                    style={{
                      width: "100%",
                      maxHeight: "280px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <h4>{booking.movieTitle}</h4>

                <p className="text-secondary mb-2">
                  {booking.language || "Movie"}
                </p>

                <hr />

                <p className="mb-2">
                  <strong>Theatre:</strong>{" "}
                  {booking.theatre || "Movix Cinema"}
                </p>

                <p className="mb-2">
                  <strong>Screen:</strong>{" "}
                  {booking.screen || "Standard"}
                </p>

                <p className="mb-2">
                  <strong>Show time:</strong> {booking.time}
                </p>

                <div className="mb-3">
                  <strong>Seats and categories</strong>

                  {Array.isArray(booking.selectedSeatDetails) &&
                  booking.selectedSeatDetails.length > 0 ? (
                    <div className="mt-2">
                      {booking.selectedSeatDetails.map((item) => (
                        <div
                          key={item.seat}
                          className="d-flex justify-content-between gap-2 mb-2"
                        >
                          <span>
                            {item.seat}
                            <small className="d-block text-secondary">
                              {item.category}
                            </small>
                          </span>

                          <strong>₹{item.price}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary mt-2 mb-0">
                      {Array.isArray(booking.selectedSeats)
                        ? booking.selectedSeats.join(", ")
                        : "Not available"}
                    </p>
                  )}
                </div>

                {Number(booking.discountAmount) > 0 && (
                  <>
                    <div className="d-flex justify-content-between gap-2 mb-2">
                      <span>Original amount</span>
                      <span>₹{booking.originalAmount}</span>
                    </div>

                    <div className="d-flex justify-content-between gap-2 mb-3">
                      <span>
                        Coupon
                        {booking.couponCode
                          ? ` (${booking.couponCode})`
                          : " discount"}
                      </span>

                      <strong className="text-success">
                        −₹{booking.discountAmount}
                      </strong>
                    </div>
                  </>
                )}

                <div className="d-flex justify-content-between gap-2 mb-3">
                  <strong>Total amount</strong>
                  <strong className="movie-rating">
                    ₹{booking.totalAmount ?? 0}
                  </strong>
                </div>

                <hr />

                <p className="small mb-2">
                  <strong>Booking ID:</strong>{" "}
                  {booking.bookingId || "Not available"}
                </p>

                {booking.customerName && (
                  <p className="small mb-2">
                    <strong>Name:</strong> {booking.customerName}
                  </p>
                )}

                {booking.email && (
                  <p className="small mb-2">
                    <strong>Email:</strong> {booking.email}
                  </p>
                )}

                {booking.paymentMethod && (
                  <p className="small mb-3">
                    <strong>Payment:</strong> {booking.paymentMethod}
                  </p>
                )}

                <button
                  type="button"
                  className="btn btn-outline-danger w-100 mt-2"
                  onClick={() => openCancelModal(booking)}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom cancellation popup */}
      {showCancelModal && selectedBooking && (
        <div
          className="movix-cancel-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isCancelling
            ) {
              closeCancelModal();
            }
          }}
        >
          <div
            className="movix-cancel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
          >
            <div className="movix-cancel-header">
              <h5 id="cancel-modal-title" className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Cancel Booking?
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                disabled={isCancelling}
                onClick={closeCancelModal}
              />
            </div>

            <div className="movix-cancel-body">
              <p>
                Are you sure you want to cancel this movie booking?
              </p>

              <div className="movix-cancel-details">
                <p>
                  <strong>Movie:</strong>{" "}
                  {selectedBooking.movieTitle}
                </p>

                <p>
                  <strong>Booking ID:</strong>{" "}
                  {selectedBooking.bookingId || "Not available"}
                </p>

                <p>
                  <strong>Theatre:</strong>{" "}
                  {selectedBooking.theatre || "Movix Cinema"}
                </p>

                <p className="mb-0">
                  <strong>Seats:</strong>{" "}
                  {selectedBooking.selectedSeats?.join(", ") ||
                    "Not available"}
                </p>
              </div>

              <p className="small text-warning mt-3 mb-0">
                Cancelling removes this booking and releases its seats.
              </p>

              {cancelError && (
                <div className="alert alert-danger mt-3 mb-0">
                  {cancelError}
                </div>
              )}
            </div>

            <div className="movix-cancel-footer">
              <button
                type="button"
                className="btn btn-outline-light"
                disabled={isCancelling}
                onClick={closeCancelModal}
              >
                Keep Booking
              </button>

              <button
                type="button"
                className="btn btn-danger"
                disabled={isCancelling}
                onClick={confirmCancelBooking}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyBookings;