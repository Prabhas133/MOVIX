
const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi / Adventure",
    rating: 8.7,
    language: "English",
    duration: "2h 49m",
    kidFriendly: false,
    description:
      "A team of explorers travels through space to discover whether mankind has a future among the stars.",
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: 2,
    title: "Inception",
    genre: "Action / Sci-Fi",
    rating: 8.8,
    language: "English",
    duration: "2h 28m",
    kidFriendly: false,
    description:
      "A skilled thief enters people's dreams to steal secrets and faces a mission that challenges reality.",
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action / Crime",
    rating: 9.0,
    language: "English",
    duration: "2h 32m",
    kidFriendly: false,
    description:
      "Batman faces the Joker, a dangerous criminal who brings chaos to Gotham City.",
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: 4,
    title: "Avatar",
    genre: "Sci-Fi / Fantasy",
    rating: 7.9,
    language: "English",
    duration: "2h 42m",
    kidFriendly: false,
    description:
      "A former Marine explores Pandora and becomes involved in the struggle to protect its people.",
    poster:
      "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg"
  },
  {
    id: 5,
    title: "The Avengers",
    genre: "Action / Adventure",
    rating: 8.0,
    language: "English",
    duration: "2h 23m",
    kidFriendly: true,
    description:
      "Earth's mightiest heroes unite to protect the planet from a powerful threat.",
    poster:
      "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg"
  },
  {
    id: 6,
    title: "Joker",
    genre: "Crime / Drama",
    rating: 8.2,
    language: "English",
    duration: "2h 2m",
    kidFriendly: false,
    description:
      "A troubled comedian experiences rejection and takes a dark path in Gotham City.",
    poster:
      "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
  },
  {
    id: 7,
    title: "RRR",
    genre: "Action / Drama",
    rating: 7.8,
    language: "Telugu",
    duration: "3h 7m",
    kidFriendly: false,
    description:
      "Two legendary revolutionaries form a powerful friendship and fight against colonial oppression.",
    poster:
      "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg"
  },
  {
    id: 8,
    title: "Baahubali: The Beginning",
    genre: "Action / Fantasy",
    rating: 8.0,
    language: "Telugu",
    duration: "2h 39m",
    kidFriendly: false,
    description:
      "A young man discovers his extraordinary heritage and becomes part of a royal kingdom's destiny.",
    poster:
      "https://image.tmdb.org/t/p/w500/9BAjt8nSSms62uOVYn1t3C3dVto.jpg"
  },
  {
    id: 9,
    title: "Pushpa: The Rise",
    genre: "Action / Crime",
    rating: 7.6,
    language: "Telugu",
    duration: "2h 59m",
    kidFriendly: false,
    description:
      "A determined labourer rises through the dangerous world of red sandalwood smuggling.",
    poster:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTEBj8p-ynRkaIk4luHnF02ahyCJ6epbBOt_6dTS5fBWs7rqC-E"
  },
  {
    id: 10,
    title: "Ala Vaikunthapurramuloo",
    genre: "Comedy / Drama",
    rating: 7.3,
    language: "Telugu",
    duration: "2h 45m",
    kidFriendly: true,
    description:
      "A man discovers the truth about his birth and finds himself caught up in a family drama.",
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNbcbDm_BFh4LXRPu8WTJjedhXgcDTV34g2f6ZtZDRErslORaHIS4o6qE6JmiWCNIdj4Grbg&s=10"
  },
  {
    id: 11,
    title: "Hi Nanna",
    genre: "Romance / Drama",
    rating: 8.2,
    language: "Telugu",
    duration: "2h 35m",
    kidFriendly: true,
    description:
      "A loving father and his young daughter discover how love and family can change their lives.",
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8FqYrrL5-G2t97Gw6QujGPb_fClQwG_FTjIoN7SZ653LC0vaSyCcq4A7sRy71bQ5ty596&s=10"
  },
  {
    id: 12,
    title: "Dangal",
    genre: "Sports / Drama",
    rating: 8.3,
    language: "Hindi",
    duration: "2h 41m",
    kidFriendly: true,
    description:
      "A former wrestler trains his daughters to become champions in competitive wrestling.",
    poster:
      "https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg"
  },
  {
    id: 13,
    title: "3 Idiots",
    genre: "Comedy / Drama",
    rating: 8.4,
    language: "Hindi",
    duration: "2h 50m",
    kidFriendly: true,
    description:
      "Three engineering students challenge conventional education while discovering friendship and purpose.",
    poster:
      "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg"
  },
  {
    id: 14,
    title: "Zootopia",
    genre: "Animation / Adventure",
    rating: 8.0,
    language: "English",
    duration: "1h 48m",
    kidFriendly: true,
    description:
      "A determined rabbit police officer and a clever fox solve a mystery in a city of animals.",
    poster:
      "https://image.tmdb.org/t/p/w500/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg"
  },
  {
    id: 15,
    title: "Finding Nemo",
    genre: "Animation / Family",
    rating: 8.2,
    language: "English",
    duration: "1h 40m",
    kidFriendly: true,
    description:
      "A clownfish travels across the ocean with a forgetful friend to find his missing son.",
    poster:
      "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg"
  },
  {
    id: 16,
    title: "Toy Story",
    genre: "Animation / Comedy",
    rating: 8.3,
    language: "English",
    duration: "1h 21m",
    kidFriendly: true,
    description:
      "A group of toys comes to life and learns about friendship, loyalty, and teamwork.",
    poster:
      "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg"
  },
  {
    id: 17,
    title: "The Lion King",
    genre: "Animation / Adventure",
    rating: 8.5,
    language: "English",
    duration: "1h 28m",
    kidFriendly: true,
    description:
      "A young lion learns courage and responsibility as he grows into his role as king.",
    poster:
      "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg"
  }
];

export default movies;
