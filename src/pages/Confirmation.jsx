import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    movie,
    time,
    selectedSeats = [],
    selectedSeatDetails = [],
    totalAmount,
    originalAmount,
    discountAmount,
    couponCode,
    customerName,
    email,
    paymentMethod,
    theatre,
    screen,
    bookingId: savedBookingId,
    date,
  } = location.state || {};

  if (!movie || selectedSeats.length === 0) {
    return (
      <div className="container py-5">
        <h2>Booking details not found</h2>
        <p className="text-secondary">
          Please complete your booking first.
        </p>
        <button
          className="btn movix-btn mt-3"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const seatDetails =
    selectedSeatDetails.length > 0
      ? selectedSeatDetails
      : selectedSeats.map((seat) => {
          const row = seat.charAt(0);

          const category =
            row === "A"
              ? { name: "Premium", price: 300 }
              : ["B", "C"].includes(row)
              ? { name: "Gold", price: 200 }
              : { name: "Silver", price: 150 };

          return {
            seat,
            category: category.name,
            price: category.price,
          };
        });

  const bookingId =
    savedBookingId ||
    `MOVIX-${movie.id}-${selectedSeats.join("-")}`;

  // Data encoded inside the QR code.
  const ticketData = JSON.stringify({
    bookingId,
    movie: movie.title,
    theatre: theatre || "Movix Cinema",
    screen: screen || "Standard",
    date: date || "",
    showtime: time,
    seats: selectedSeats,
    customerName: customerName || "",
    totalAmount: Number(totalAmount || 0),
  });

  return (
    <section className="container py-5">
      <div className="confirmation-card mx-auto">
        <div className="confirmation-icon">✓</div>

        <p className="movix-tagline text-center mt-3">
          YOUR MOVIX EXPERIENCE
        </p>

        <h1 className="text-center fw-bold">
          Booking Confirmed!
        </h1>

        <p className="text-secondary text-center mb-4">
          Your demo ticket is ready, {customerName}.
        </p>

        <div className="confirmation-movie d-flex gap-3 mb-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="payment-poster"
          />

          <div>
            <h4>{movie.title}</h4>
            <p className="text-secondary mb-1">
              {movie.language}
            </p>
            <p className="text-secondary mb-1">{time}</p>
            <p className="text-secondary mb-0">
              {selectedSeats.length} ticket(s)
            </p>
          </div>
        </div>

        <hr />

        <div className="confirmation-detail">
          <span>Theatre</span>
          <strong>{theatre || "Movix Cinema"}</strong>
        </div>

        <div className="confirmation-detail">
          <span>Screen</span>
          <strong>{screen || "Standard"}</strong>
        </div>

        {date && (
          <div className="confirmation-detail">
            <span>Booking Date</span>
            <strong>{date}</strong>
          </div>
        )}

        <div className="confirmation-detail">
          <span>Booking Reference</span>
          <strong>{bookingId}</strong>
        </div>

        <div className="confirmation-detail">
          <span>Customer</span>
          <strong>{customerName}</strong>
        </div>

        <div className="confirmation-detail">
          <span>Email</span>
          <strong>{email}</strong>
        </div>

        <hr />

        <h5 className="mb-3">Seat Details</h5>

        {seatDetails.map((item) => (
          <div
            className="confirmation-detail"
            key={item.seat}
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

        <div className="confirmation-detail">
          <span>Payment Method</span>
          <strong>{paymentMethod}</strong>
        </div>

        {originalAmount != null && (
          <div className="confirmation-detail">
            <span>Original Amount</span>
            <strong>₹{originalAmount}</strong>
          </div>
        )}

        {Number(discountAmount) > 0 && (
          <>
            <div className="confirmation-detail">
              <span>Coupon Discount</span>
              <strong className="text-success">
                −₹{discountAmount}
              </strong>
            </div>

            {couponCode && (
              <div className="confirmation-detail">
                <span>Coupon Used</span>
                <strong>{couponCode}</strong>
              </div>
            )}
          </>
        )}

        <div className="confirmation-detail total-row">
          <span>Total Amount</span>
          <strong>₹{totalAmount}</strong>
        </div>

        {/* QR-code digital ticket */}
        <div className="movix-qr-ticket text-center mt-4 p-4">
          <h5 className="fw-bold mb-2">
            <i className="bi bi-qr-code me-2"></i>
            Your Digital Ticket
          </h5>

          <p className="text-secondary small mb-3">
            Scan the QR code to view your booking details.
          </p>

          <div className="movix-qr-code d-inline-block bg-white p-3 rounded-3">
            <QRCodeSVG
              value={ticketData}
              size={190}
              level="M"
              includeMargin
            />
          </div>

          <p className="small mt-3 mb-1">
            Booking ID: <strong>{bookingId}</strong>
          </p>

          <p className="text-secondary small mb-0">
            Keep this ticket for your reference.
          </p>
        </div>

        <p className="text-secondary small mt-4">
          This is a demo booking confirmation. No payment was
          processed and no real cinema seats have been reserved.
          The QR code contains booking information but does not
          independently verify a ticket.
        </p>

        <button
          className="btn movix-btn w-100 mt-3"
          onClick={() => navigate("/")}
        >
          Explore More Movies
        </button>

        <button
          className="btn btn-outline-light w-100 mt-3"
          onClick={() => window.print()}
        >
          Print Ticket
        </button>
      </div>
    </section>
  );
}

export default Confirmation;