
import React, { useRef } from "react";
import { Link } from "react-router-dom";

function TrendingMovies({ movies = [] }) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-heading">
          <div>
            <p className="trending-eyebrow">TRENDING NOW</p>
            <h2>Trending Movies</h2>
            <p className="trending-subtitle">
              The movies everyone's talking about.
            </p>
          </div>

          <div className="trending-controls">
            <button
              type="button"
              aria-label="Previous movies"
              onClick={() => scrollCarousel(-1)}
            >
              &#8592;
            </button>

            <button
              type="button"
              aria-label="Next movies"
              onClick={() => scrollCarousel(1)}
            >
              &#8594;
            </button>
          </div>
        </div>

        <div
          className="trending-carousel"
          ref={carouselRef}
          aria-label="Trending movie posters"
        >
          {movies.map((movie, index) => (
            <article
              className="trending-card"
              key={movie.id}
              style={{ "--card-index": index }}
            >
              <Link
                to={`/movie/${movie.id}`}
                className="trending-poster-link"
                aria-label={`View ${movie.title}`}
              >
                <div className="trending-poster">
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                  />

                  <span className="trending-badge">
                    #{index + 1} Trending
                  </span>

                  <div className="trending-overlay">
                    <span className="trending-view-button">
                      View Movie <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>

              <div className="trending-card-info">
                <h3>{movie.title}</h3>
                <div className="trending-meta">
                  <span>★ {movie.rating ?? "N/A"}</span>
                  <span>{movie.language || "Movie"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingMovies;
