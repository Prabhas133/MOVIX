import { useLocation, useNavigate, useParams } from "react-router-dom";
import movies from "../data/movies";

// Theatre details and demo showtimes
const theatres = [
  {
    id: "cinepolis-pvp",
    name: "Cinépolis: PVP Square Mall",
    location: "Vijayawada",
    subtitle: "Premium Multiplex Cinema",
    showtimes: [
      { time: "07:50 PM", screen: "Renovated" },
      { time: "08:05 PM", screen: "Renovated" },
      { time: "10:25 PM", screen: "Renovated" },
      { time: "11:10 PM", screen: "Renovated" },
    ],
  },
  {
    id: "abr-kanuru",
    name: "ABR Cinemas Neo Screen X",
    location: "Kanuru, Vijayawada",
    subtitle: "Premium Cinema Experience",
    showtimes: [
      { time: "09:45 PM", screen: "Neo Screen X" },
      { time: "11:15 PM", screen: "Dolby 7.1" },
    ],
  },
  {
    id: "cinepolis-powerone",
    name: "Cinépolis: Power One Mall",
    location: "Vijayawada",
    subtitle: "Multiplex Cinema",
    showtimes: [
      { time: "08:05 PM", screen: "Dolby 7.1" },
      { time: "11:30 PM", screen: "Dolby 7.1" },
    ],
  },
  {
    id: "inox-laila",
    name: "INOX: Laila Mall",
    location: "M.G. Road, Vijayawada",
    subtitle: "4K Laser | Dolby Atmos",
    showtimes: [
      { time: "07:35 PM", screen: "4K Laser" },
      { time: "11:00 PM", screen: "Dolby Atmos" },
    ],
  },
];

function MovieDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const movie =
    location.state?.movie ||
    movies.find((item) => String(item.id) === id);

  const handleShowtime = (theatre, show) => {
    navigate("/seats", {
      state: {
        movie,
        time: show.time,
        theatre: theatre.name,
        theatreId: theatre.id,
        screen: show.screen,
      },
    });
  };

  if (!movie) {
    return (
      <section className="container py-5">
        <h2>Movie not found</h2>
        <button
          className="btn movix-btn mt-3"
          onClick={() => navigate("/")}
        >
          Back to Movies
        </button>
      </section>
    );
  }

  return (
    <section className="container py-5 movie-details-page">
      <button
        className="btn btn-outline-light mb-4"
        onClick={() => navigate("/#movies")}
      >
        ← Back to Movies
      </button>

      {/* Movie poster and information */}
      <div className="row g-4 g-lg-5 mb-5 align-items-start movie-overview">
        <div className="col-12 col-sm-5 col-lg-3">
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-details-poster"
          />
        </div>

        <div className="col-12 col-sm-7 col-lg-6 movie-info-column">
          <p className="movix-tagline">MOVIX PRESENTS</p>

          <h1 className="fw-bold mb-3">{movie.title}</h1>

          <p className="text-secondary mb-3">
            {movie.genre}
          </p>

          <p className="movie-description mb-4">
            {movie.description || "Enjoy this movie at Movix."}
          </p>

          <div className="d-flex flex-wrap gap-3 mb-4">
            <strong className="movie-rating">
              ★ {movie.rating}/10
            </strong>

            <span>{movie.language}</span>

            {movie.duration && <span>{movie.duration}</span>}
          </div>

          <h3 className="mb-3">About the Movie</h3>

          <p className="movie-description">
            {movie.description || "Discover the story of this movie."}
          </p>
        </div>
      </div>

      {/* Theatre selection */}
      <div className="theatre-section">
        <p className="movix-tagline">CHOOSE YOUR EXPERIENCE</p>

        <h2 className="fw-bold mb-4">Select a Theatre</h2>

        <div className="row g-4">
          {theatres.map((theatre) => (
            <div className="col-12" key={theatre.id}>
              <div className="theatre-card h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="theatre-icon">🎬</div>

                  <div className="theatre-heading">
                    <h4 className="mb-1">{theatre.name}</h4>

                    <p className="text-secondary mb-1">
                      {theatre.location}
                    </p>

                    <small className="text-secondary">
                      {theatre.subtitle}
                    </small>
                  </div>
                </div>

                <hr />

                <h5 className="mb-3">Available Showtimes</h5>

                <div className="d-flex flex-wrap gap-3">
                  {theatre.showtimes.map((show) => (
                    <button
                      key={`${theatre.id}-${show.time}`}
                      type="button"
                      className="btn showtime-btn"
                      onClick={() => handleShowtime(theatre, show)}
                    >
                      <div className="fw-bold">{show.time}</div>
                      <small className="d-block">{show.screen}</small>
                    </button>
                  ))}
                </div>

                <p className="text-secondary small mt-3 mb-0">
                  Select a showtime to book your seats.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MovieDetails;