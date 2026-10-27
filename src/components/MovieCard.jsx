
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div className="movie-card h-100">
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="p-3">
          <h5 className="movie-title">{movie.title}</h5>
          <p className="movie-genre">{movie.genre}</p>

          <button
            className="btn movix-btn w-100"
            onClick={() =>
              navigate(`/movie/${movie.id}`, {
                state: { movie },
              })
            }
          >
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
