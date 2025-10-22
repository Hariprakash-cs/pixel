// Content Type Posters
// Map content type UIDs to poster images

export const contentTypePosters = {
  // One Piece
  one_piece:
    "https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00NDFjLWE1OTAtNDU3NjgxODMxY2UyXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg",

  // Naruto
  naruto:
    "https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",

  // Attack on Titan
  attack_on_titan:
    "https://m.media-amazon.com/images/M/MV5BNDFjYTIxMjEtNTMyZS00NDU5LTg0NmQtNDFkYjI0ZDNlZTRlXkEyXkFqcGdeQXVyNTMxMjgxMzA@._V1_.jpg",

  // My Hero Academia
  my_hero_academia:
    "https://m.media-amazon.com/images/M/MV5BOGZmYjlkYTktNjUwYy00M2QyLWE2YjYtYjExYjQ2YjQzYjQzXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",

  // Demon Slayer
  demon_slayer:
    "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg",

  // Jujutsu Kaisen
  jujutsu_kaisen:
    "https://m.media-amazon.com/images/M/MV5BNGY0YmYyM2EtYjYxYy00OWY2LTg2ZmMtYjFjZTYyM2QzYjQzXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",

  // Dragon Ball
  dragon_ball:
    "https://m.media-amazon.com/images/M/MV5BMGMyOThiMGUtYmFmZi00YWM0LWJiM2QtZGMwM2Q2ODE4MzhhXkEyXkFqcGdeQXVyMjc2Nzg5OTQ@._V1_.jpg",

  // Bleach
  bleach:
    "https://m.media-amazon.com/images/M/MV5BZjE0YjVjODQtZGY2NS00MDcyLThhMDAtZGQwMTZiOWNmNjRiXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",

  // Death Note
  death_note:
    "https://m.media-amazon.com/images/M/MV5BNjRiNmNjMmMtN2U2Yi00ODgxLTk3OTMtMmI1MTI1NjYyZTEzXkEyXkFqcGdeQXVyNDAzNDk0MTQ@._V1_.jpg",

  // Fullmetal Alchemist
  fullmetal_alchemist:
    "https://m.media-amazon.com/images/M/MV5BNDk2NjYyMDIzMF5BMl5BanBnXkFtZTgwNDc1MTg2NTE@._V1_.jpg",

  // Tokyo Ghoul
  tokyo_ghoul:
    "https://m.media-amazon.com/images/M/MV5BYmJmNTc5ZDgtNjg3ZS00NmI4LTg0ZDUtZDI5ZGU0MGI4ZjE2XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",

  // Sword Art Online
  sword_art_online:
    "https://m.media-amazon.com/images/M/MV5BYjY4MDU2YjMtNzY1MC00ODg1LWIwMzYtMWE5YTA3YTI4ZjMxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",

  // Hunter x Hunter
  hunter_x_hunter:
    "https://m.media-amazon.com/images/M/MV5BZjNmZDhkN2QtNDYyZC00YzJmLTg0ODUtN2FjNjhhMzE3ZmUxXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_.jpg",

  // Chainsaw Man
  chainsaw_man:
    "https://m.media-amazon.com/images/M/MV5BYzJjNjlmZTUtYWE5MS00NGY3LTkzYmEtODJmMzU4MjgwNjU2XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",

  // Spy x Family
  spy_x_family:
    "https://m.media-amazon.com/images/M/MV5BYzFjZDk5YjMtOWQ2Zi00YzBkLWI2NWEtOWY1MWQ4MzdjOWJkXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",

  // Default/Fallback poster
  default: "https://via.placeholder.com/300x450/1a1a1a/e9373a?text=Anime",
};

/**
 * Get poster URL for a content type
 * @param {string} contentTypeUid - Content type UID
 * @returns {string} Poster URL
 */
export const getContentTypePoster = (contentTypeUid) => {
  if (!contentTypeUid) return contentTypePosters.default;

  // Convert to lowercase and replace spaces with underscores
  const normalizedUid = contentTypeUid.toLowerCase().replace(/\s+/g, "_");

  return contentTypePosters[normalizedUid] || contentTypePosters.default;
};

/**
 * Get poster with fallback
 * @param {string} contentTypeUid - Content type UID
 * @param {string} customPoster - Custom poster URL (optional)
 * @returns {string} Poster URL
 */
export const getPosterWithFallback = (contentTypeUid, customPoster = null) => {
  if (customPoster) return customPoster;
  return getContentTypePoster(contentTypeUid);
};

/**
 * Check if poster exists for content type
 * @param {string} contentTypeUid - Content type UID
 * @returns {boolean}
 */
export const hasPoster = (contentTypeUid) => {
  if (!contentTypeUid) return false;
  const normalizedUid = contentTypeUid.toLowerCase().replace(/\s+/g, "_");
  return normalizedUid in contentTypePosters && normalizedUid !== "default";
};

/**
 * Add or update poster for content type
 * @param {string} contentTypeUid - Content type UID
 * @param {string} posterUrl - Poster URL
 */
export const setContentTypePoster = (contentTypeUid, posterUrl) => {
  if (!contentTypeUid || !posterUrl) return;
  const normalizedUid = contentTypeUid.toLowerCase().replace(/\s+/g, "_");
  contentTypePosters[normalizedUid] = posterUrl;
};

export default contentTypePosters;
