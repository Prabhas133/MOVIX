import { useState } from "react";
import movies from "../data/movies";
import MovieCard from "../components/MovieCard";
import TrendingMovies from "../components/TrendingMovies.jsx";

function Home() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [minRating, setMinRating] = useState("0");

    // Get unique genres and languages from the movie data
    const genres = [
        "All",
        ...new Set(movies.map((movie) => movie.genre).filter(Boolean)),
    ];

    const languages = [
        "All",
        ...new Set(movies.map((movie) => movie.language).filter(Boolean)),
    ];

    // Search and filter movies
    const filteredMovies = movies.filter((movie) => {
        const matchesSearch = movie.title
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());

        const matchesGenre =
            selectedGenre === "All" || movie.genre === selectedGenre;

        const matchesLanguage =
            selectedLanguage === "All" ||
            movie.language === selectedLanguage;

        const matchesRating =
            Number(movie.rating) >= Number(minRating);

        return (
            matchesSearch &&
            matchesGenre &&
            matchesLanguage &&
            matchesRating
        );
    });

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedGenre("All");
        setSelectedLanguage("All");
        setMinRating("0");
        setSelectedMovie(null);
    };

    return (
    <>
        {/* Trending Movies Carousel */}
        <TrendingMovies movies={movies} />

        {/* Existing Popular Movies Section */}
        <section className="container py-5" id="movies">
            {/* Heading */}
            <div className="mb-4">
                <p className="movix-tagline mb-2">NOW SHOWING</p>
                <h2 className="fw-bold">Popular Movies</h2>
                <p className="text-secondary mb-0">
                    Discover your next favourite movie.
                </p>
            </div>

            {/* Search and filters */}
            <div className="movix-filter-panel mb-4">
                <div className="row g-3 align-items-end">
                    {/* Search */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="movie-search" className="form-label movix-filter-label">
                            Search movie
                        </label>
                        <input
                            id="movie-search"
                            type="search"
                            className="form-control movix-filter-control"
                            placeholder="Search by movie title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Genre */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label htmlFor="genre-filter" className="form-label movix-filter-label">
                            Genre
                        </label>
                        <select
                            id="genre-filter"
                            className="form-select movix-filter-control"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Language */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label htmlFor="language-filter" className="form-label movix-filter-label">
                            Language
                        </label>
                        <select
                            id="language-filter"
                            className="form-select movix-filter-control"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {languages.map((language) => (
                                <option key={language} value={language}>{language}</option>
                            ))}
                        </select>
                    </div>

                    {/* Rating */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label htmlFor="rating-filter" className="form-label movix-filter-label">
                            Minimum rating
                        </label>
                        <select
                            id="rating-filter"
                            className="form-select movix-filter-control"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                        >
                            <option value="0">Any rating</option>
                            <option value="5">5+ ⭐</option>
                            <option value="6">6+ ⭐</option>
                            <option value="7">7+ ⭐</option>
                            <option value="8">8+ ⭐</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <button
                            type="button"
                            className="btn movix-reset-btn w-100"
                            onClick={resetFilters}
                        >
                            Reset filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-secondary mb-0">
                    Showing <strong>{filteredMovies.length}</strong> of{" "}
                    <strong>{movies.length}</strong> movies
                </p>
            </div>

            {/* Movie cards */}
            <div className="row g-4">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onBook={setSelectedMovie}
                        />
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <h4>No movies found</h4>
                        <p className="text-secondary">
                            Try another title or change your filters.
                        </p>

                        <button
                            type="button"
                            className="btn movix-btn"
                            onClick={resetFilters}
                        >
                            Show all movies
                        </button>
                    </div>
                )}
            </div>

            {/* Selected movie message */}
            {selectedMovie && (
                <div className="alert alert-dark mt-4">
                    You selected <strong>{selectedMovie.title}</strong>.

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-light ms-3"
                        onClick={() => setSelectedMovie(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </section>
    </>
    );
}

export default Home;
