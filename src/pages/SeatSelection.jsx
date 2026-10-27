import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    movie,
    time,
    theatre,
    theatreId,
    screen,
  } = location.state || {};

  const rows = ["A", "B", "C", "D", "E","F"];
  const seatsPerRow = 8;

  // Seat category and pricing configuration
  const seatCategories = {
    A: { name: "Silver", price: 150, className: "seat-silver" },
    B: { name: "Silver", price: 150, className: "seat-silver" },
    C: { name: "Gold", price: 200, className: "seat-gold" },
    D: { name: "Gold", price: 200, className: "seat-gold" },
    E: { name: "Premium", price: 300, className: "seat-premium" },
    F: { name: "Premium", price: 300, className: "seat-premium" },
  };

  const getSeatCategory = (seat) => seatCategories[seat.charAt(0)];

  // Keep bookings separate for each movie, theatre, screen and showtime
  const storageKey =
    movie && time
      ? `movix-booked-seats-${movie.id}-${theatreId || theatre || "default"}-${screen || "Standard"}-${time}`
      : null;

  const [bookedSeats, setBookedSeats] = useState(() => {
    if (!storageKey) return [];

    try {
      const savedSeats = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      return Array.isArray(savedSeats) ? savedSeats : [];
    } catch {
      return [];
    }
  });

  const [selectedSeats, setSelectedSeats] = useState([]);

  // Calculate total according to each seat's category
  const totalAmount = selectedSeats.reduce((total, seat) => {
    return total + getSeatCategory(seat).price;
  }, 0);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((previousSeats) =>
      previousSeats.includes(seat)
        ? previousSeats.filter((item) => item !== seat)
        : [...previousSeats, seat]
    );
  };

  if (!movie || !time) {
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

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    // Check again for seats already booked
    let latestBookings = [];

    try {
      const saved = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      latestBookings = Array.isArray(saved) ? saved : [];
    } catch {
      latestBookings = [];
    }

    const conflicts = selectedSeats.filter((seat) =>
      latestBookings.includes(seat)
    );

    if (conflicts.length > 0) {
      setBookedSeats(latestBookings);

      setSelectedSeats((previousSeats) =>
        previousSeats.filter(
          (seat) => !latestBookings.includes(seat)
        )
      );

      alert(
        `Already booked: ${conflicts.join(", ")}. Please select other seats.`
      );

      return;
    }

    const selectedSeatDetails = selectedSeats.map((seat) => ({
      seat,
      category: getSeatCategory(seat).name,
      price: getSeatCategory(seat).price,
    }));

  console.log("Continue to Payment clicked");
  console.log("Current URL:", window.location.pathname);
  console.log("Selected seats:", selectedSeats);

    navigate("/payment", {
      state: {
        movie,
        time,
        theatre: theatre || "Movix Cinema",
        theatreId: theatreId || theatre || "default",
        screen: screen || "Standard",
        selectedSeats,
        selectedSeatDetails,
        totalAmount,
      },
    });
  };

  return (
    <section className="container py-5 seat-selection-page">
      <button
        className="btn btn-outline-light mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Movie and theatre details */}
      <div className="text-center mb-5">
        <p className="movix-tagline">MOVIX CINEMAS</p>
        <h1 className="fw-bold">Select Your Seats</h1>

        <h4 className="mt-3">
          {theatre || "Movix Cinema"}
        </h4>

        <p className="text-secondary mb-1">
          Screen: {screen || "Standard"}
        </p>

        <p className="text-secondary">
          {movie.title} · {time}
        </p>
      </div>

      {/* Category legend */}
      <div className="seat-category-legend mx-auto mb-4">
        {[
          { name: "Premium", price: 300, className: "seat-premium" },
          { name: "Gold", price: 200, className: "seat-gold" },
          { name: "Silver", price: 150, className: "seat-silver" },
        ].map((category) => (
          <div className="seat-category-item" key={category.name}>
            <span className={`seat-legend-box ${category.className}`} />
            <span>{category.name}</span>
            <strong>₹{category.price}</strong>
          </div>
        ))}
      </div>

      {/* Cinema screen */}
      <div className="seat-screen mx-auto mb-5">
        SCREEN
      </div>

      {/* Seat layout */}
      <div className="seat-layout mx-auto">
        {rows.map((row) => {
          const category = seatCategories[row];

          return (
            <div
              key={row}
              className="seat-row d-flex justify-content-center align-items-center gap-2 mb-3"
            >
              <span className="seat-row-label">{row}</span>

              {Array.from(
                { length: seatsPerRow },
                (_, index) => `${row}${index + 1}`
              ).map((seat) => {
                const isSelected = selectedSeats.includes(seat);
                const isBooked = bookedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    type="button"
                    disabled={isBooked}
                    className={[
                      "seat",
                      category.className,
                      isBooked ? "seat-booked" : "",
                      isSelected ? "seat-selected" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => toggleSeat(seat)}
                    title={
                      isBooked
                        ? `${seat} is already booked`
                        : `${seat} · ${category.name} · ₹${category.price}`
                    }
                    aria-label={`Seat ${seat}, ${category.name}, ₹${category.price}${
                      isBooked ? ", already booked" : ""
                    }`}
                    aria-pressed={isSelected}
                  >
                    {seat.slice(1)}
                  </button>
                );
              })}

              <span className="seat-category-label">
                {category.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Seat status legend */}
      <div className="seat-status-legend d-flex justify-content-center flex-wrap gap-4 mt-5">
        <span>
          <span className="seat-legend-dot available" />
          Available
        </span>

        <span>
          <span className="seat-legend-dot selected" />
          Selected
        </span>

        <span>
          <span className="seat-legend-dot booked" />
          Booked
        </span>
      </div>

      {/* Booking summary */}
      <div className="booking-summary mt-5 mx-auto">
        <div className="mb-3">
          <p className="movix-tagline mb-2">YOUR BOOKING</p>
          <h4 className="fw-bold">{movie.title}</h4>

          <p className="text-secondary mb-1">
            {theatre || "Movix Cinema"}
          </p>

          <p className="text-secondary mb-0">
            {screen || "Standard"} · {time}
          </p>
        </div>

        <hr />

        <div className="selected-seat-list mb-3">
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seat) => {
              const category = getSeatCategory(seat);

              return (
                <div
                  key={seat}
                  className="d-flex justify-content-between align-items-center gap-3 mb-2"
                >
                  <span>
                    Seat {seat}
                    <small className="d-block text-secondary">
                      {category.name}
                    </small>
                  </span>

                  <strong>₹{category.price}</strong>
                </div>
              );
            })
          ) : (
            <p className="text-secondary mb-0">
              No seats selected yet.
            </p>
          )}
        </div>

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span>Seats selected</span>
          <strong>{selectedSeats.length}</strong>
        </div>

        <div className="d-flex justify-content-between mb-3 gap-3">
          <span>Total amount</span>
          <strong className="movie-rating fs-5">
            ₹{totalAmount}
          </strong>
        </div>

        <button
          className="btn movix-btn w-100"
          disabled={selectedSeats.length === 0}
          onClick={handleContinue}
        >
          Continue to Payment
        </button>
      </div>
    </section>
  );
}

export default SeatSelection;