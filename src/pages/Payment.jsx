import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        movie,
        time,
        selectedSeats = [],
        selectedSeatDetails = [],
        totalAmount,
        theatre,
        theatreId,
        screen,
    } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [showToast, setShowToast] = useState(false);

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponMessage, setCouponMessage] = useState("");
    const [couponError, setCouponError] = useState("");

    // Seat categories and prices
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

    const calculatedTotal = seatDetails.reduce(
        (total, item) => total + Number(item.price || 0),
        0
    );

    const originalAmount =
        totalAmount !== undefined &&
            totalAmount !== null &&
            Number.isFinite(Number(totalAmount))
            ? Number(totalAmount)
            : calculatedTotal;

    // Calculate discount from the applied coupon object
    const discountAmount = appliedCoupon?.discount || 0;

    const payableAmount = Math.max(
        0,
        originalAmount - discountAmount
    );

    useEffect(() => {
        if (!showToast) return;

        const timer = setTimeout(() => {
            setShowToast(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [showToast]);

    // Apply coupon
    const handleApplyCoupon = () => {
        setCouponError("");
        setCouponMessage("");

        if (originalAmount <= 300) {
            setAppliedCoupon(null);
            setCouponError("Coupons are applicable only for bookings above ₹300.");
            return;
        }

        const code = couponCode.trim().toUpperCase();

        if (code === "MOVIX10") {
            setAppliedCoupon({
                code: "MOVIX10",
                discount: Math.round(originalAmount * 0.1),
            });
            setCouponMessage("10% discount applied successfully!");
        } else if (code === "MOVIX50") {
            setAppliedCoupon({
                code: "MOVIX50",
                discount: Math.min(50, originalAmount),
            });
            setCouponMessage("₹50 discount applied successfully!");
        } else {
            setAppliedCoupon(null);
            setCouponError("Invalid coupon code.");
        }
    };


    if (!movie || !time || !selectedSeats.length) {
        return (
            <div className="container py-5">
                <h2>Booking details not found</h2>
                <p className="text-secondary">
                    Please select a movie, theatre, and showtime first.
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


    // Confirm demo booking
    const handleSubmit = (event) => {
        event.preventDefault();

        if (showToast) return;

        const storageKey =
            `movix-booked-seats-${movie.id}-${theatreId || theatre || "default"}-${screen || "Standard"}-${time}`;

        let existingBookedSeats = [];

        try {
            const savedSeats = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            existingBookedSeats = Array.isArray(savedSeats)
                ? savedSeats
                : [];
        } catch {
            existingBookedSeats = [];
        }

        // Recheck seat availability
        const conflictingSeats = selectedSeats.filter((seat) =>
            existingBookedSeats.includes(seat)
        );

        if (conflictingSeats.length > 0) {
            alert(
                `Sorry! These seats are already booked: ${conflictingSeats.join(
                    ", "
                )}. Please choose different seats.`
            );

            navigate("/seats", {
                state: {
                    movie,
                    time,
                    theatre,
                    theatreId,
                    screen,
                },
            });

            return;
        }

        try {
            let bookingHistory = [];

            try {
                const savedHistory = JSON.parse(
                    localStorage.getItem("movix-bookings") || "[]"
                );

                bookingHistory = Array.isArray(savedHistory)
                    ? savedHistory
                    : [];
            } catch {
                bookingHistory = [];
            }

            const now = new Date();

            const today = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, "0"),
                String(now.getDate()).padStart(2, "0"),
            ].join("-");

            const bookingId = `MOVIX-${Date.now()}`;

            const booking = {
                bookingId,
                date: today,
                movieId: movie.id,
                movieTitle: movie.title,
                poster: movie.poster,
                language: movie.language,

                theatre: theatre || "Movix Cinema",
                theatreId: theatreId || theatre || "default",
                screen: screen || "Standard",
                time,

                selectedSeats: [...selectedSeats],

                selectedSeatDetails: seatDetails.map((item) => ({
                    seat: item.seat,
                    category: item.category,
                    price: Number(item.price),
                })),

                // Original price, discount, and final price
                originalAmount,
                discountAmount,
                couponCode: appliedCoupon?.code || null,
                totalAmount: payableAmount,

                customerName: customerName.trim(),
                email: email.trim(),
                paymentMethod,
            };

            // Save booking history
            localStorage.setItem(
                "movix-bookings",
                JSON.stringify([...bookingHistory, booking])
            );

            // Mark selected seats as booked
            const updatedBookedSeats = [
                ...new Set([...existingBookedSeats, ...selectedSeats]),
            ];

            localStorage.setItem(
                storageKey,
                JSON.stringify(updatedBookedSeats)
            );

            setShowToast(true);

            // Go to confirmation
            setTimeout(() => {
                navigate("/confirmation", {
                    state: {
                        movie,
                        time,
                        theatre: booking.theatre,
                        theatreId: booking.theatreId,
                        screen: booking.screen,

                        selectedSeats: booking.selectedSeats,
                        selectedSeatDetails: booking.selectedSeatDetails,

                        totalAmount: booking.totalAmount,
                        originalAmount: booking.originalAmount,
                        discountAmount: booking.discountAmount,
                        couponCode: booking.couponCode,

                        customerName: booking.customerName,
                        email: booking.email,
                        paymentMethod: booking.paymentMethod,

                        bookingId: booking.bookingId,
                        date: booking.date,
                    },
                });
            }, 2000);
        } catch {
            alert(
                "Unable to save your demo booking. Please check your browser storage and try again."
            );
        }
    };

    return (
        <section className="container py-5">
            {/* Booking success notification */}
            {showToast && (
                <div
                    className="movix-toast"
                    role="status"
                    aria-live="polite"
                >
                    <div className="movix-toast-icon">✓</div>

                    <div className="movix-toast-content">
                        <strong>Booking Successful!</strong>
                        <p className="mb-0">
                            Your movie tickets have been booked.
                        </p>
                    </div>
                </div>
            )}

            <button
                className="btn btn-outline-light mb-4"
                onClick={() => navigate(-1)}
                disabled={showToast}
            >
                ← Back to Seats
            </button>

            <div className="row g-4">
                {/* Payment form */}
                <div className="col-lg-7">
                    <p className="movix-tagline">ALMOST THERE</p>

                    <h1 className="fw-bold mb-4">
                        Complete Your Booking
                    </h1>

                    <form
                        className="payment-card"
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-3">
                            <label
                                className="form-label"
                                htmlFor="customerName"
                            >
                                Full Name
                            </label>

                            <input
                                id="customerName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your name"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                autoComplete="name"
                                required
                                disabled={showToast}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="form-label"
                                htmlFor="customerEmail"
                            >
                                Email Address
                            </label>

                            <input
                                id="customerEmail"
                                type="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                disabled={showToast}
                            />
                        </div>

                        <h5 className="mb-3">
                            Choose Payment Method
                        </h5>

                        {[
                            "UPI",
                            "Credit / Debit Card",
                            "Net Banking",
                        ].map((method) => (
                            <label
                                key={method}
                                className={`payment-option ${paymentMethod === method
                                    ? "payment-option-active"
                                    : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    disabled={showToast}
                                />

                                <span>{method}</span>
                            </label>
                        ))}

                        <button
                            type="submit"
                            className="btn movix-btn w-100 mt-4"
                            disabled={showToast}
                        >
                            {showToast
                                ? "Booking Successful!"
                                : `Confirm Demo Booking · ₹${payableAmount}`}
                        </button>

                        <p className="text-secondary small mt-3 mb-0">
                            Demo only. No actual payment will be collected.
                        </p>
                    </form>
                </div>

                {/* Booking summary */}
                <div className="col-lg-5">
                    <div className="payment-card">
                        <h4 className="mb-4">Booking Summary</h4>

                        <div className="d-flex gap-3 mb-4">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="payment-poster"
                            />

                            <div>
                                <h5>{movie.title}</h5>

                                <p className="text-secondary mb-1">
                                    {movie.language}
                                </p>

                                <p className="text-secondary mb-1">{time}</p>

                                <p className="text-secondary mb-1">
                                    {theatre || "Movix Cinema"}
                                </p>

                                <p className="text-secondary mb-0">
                                    Screen: {screen || "Standard"}
                                </p>
                            </div>
                        </div>

                        <hr />

                        <h6 className="mb-3">Selected Seats</h6>

                        {seatDetails.map((item) => (
                            <div
                                key={item.seat}
                                className="d-flex justify-content-between align-items-center gap-3 mb-3"
                            >
                                <div>
                                    <strong>{item.seat}</strong>
                                    <small className="d-block text-secondary">
                                        {item.category}
                                    </small>
                                </div>

                                <strong>₹{item.price}</strong>
                            </div>
                        ))}

                        <hr />

                        {/* Coupon section */}

                        <div className="coupon-section">
                            <h5 className="mb-3">
                                <i className="bi bi-ticket-perforated me-2"></i>
                                Apply Coupon
                            </h5>

                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(e.target.value.toUpperCase());
                                        setAppliedCoupon(null);
                                        setCouponMessage("");
                                        setCouponError("");
                                    }}
                                    placeholder="Enter coupon code"
                                    aria-label="Coupon code"
                                />

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleApplyCoupon}
                                >
                                    Apply
                                </button>
                            </div>

                            {originalAmount <= 300 ? (
                                <div className="alert alert-warning py-2 mb-2 small">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Coupons are available only for bookings above ₹300.
                                    Add more tickets to unlock coupon offers!
                                </div>
                            ) : (
                                <div className="alert alert-success py-2 mb-2 small">
                                    <strong>MOVIX10</strong> – Get 10% off
                                    <br />
                                    <strong>MOVIX50</strong> – Get ₹50 off
                                </div>
                            )}

                            {couponMessage && (
                                <div className="alert alert-success py-2 mb-2">
                                    {couponMessage}
                                </div>
                            )}

                            {couponError && (
                                <div className="alert alert-danger py-2 mb-0">
                                    {couponError}
                                </div>
                            )}
                        </div>
                        <hr />

                        <div className="d-flex justify-content-between mb-2">
                            <span>Ticket total</span>
                            <span>₹{originalAmount}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span>Discount</span>
                            <strong className="text-success">
                                −₹{discountAmount}
                            </strong>
                        </div>

                        {appliedCoupon && (
                            <div className="d-flex justify-content-between mb-3">
                                <span>Coupon applied</span>
                                <strong>{appliedCoupon.code}</strong>
                            </div>
                        )}

                        <hr />

                        <div className="d-flex justify-content-between gap-3">
                            <strong>Amount to Pay</strong>

                            <strong className="movie-rating fs-5">
                                ₹{payableAmount}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Payment;
