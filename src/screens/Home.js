import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { HomeSkeletonLoader } from "../components/SkeletonLoader";
import { contentstackAPI, transformEntries } from "../services/contentstackAPI";
import { FiSearch, FiPlay, FiFilm, FiGrid, FiInfo } from "react-icons/fi";

function Home() {
  const [loading, setloading] = useState(true);
  const [homeEntries, setHomeEntries] = useState([]);
  const [searchkey, setsearchkey] = useState("");
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);

  // Handle click outside popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedInfo &&
        !event.target.closest(".info-popover") &&
        !event.target.closest(".info-button")
      ) {
        setSelectedInfo(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedInfo]);

  // Fetch home entries on mount
  useEffect(() => {
    const fetchHomeEntries = async () => {
      try {
        setloading(true);
        console.log("📡 Fetching home entries from Contentstack...");

        const result = await contentstackAPI.getEntriesByContentType("home");

        if (result.success && result.data) {
          const transformed = transformEntries(result.data, "home");
          setHomeEntries(transformed);
          setFilteredEntries(transformed);
          console.log(
            `✅ Loaded ${transformed.length} home entries from Contentstack`
          );
        } else {
          console.error("❌ Failed to fetch home entries:", result.error);
        }
      } catch (error) {
        console.error("❌ Error fetching home entries:", error);
      } finally {
        setloading(false);
      }
    };
    fetchHomeEntries();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setsearchkey(value);

    if (value === "") {
      setFilteredEntries(homeEntries);
    } else {
      const filtered = homeEntries.filter((entry) =>
        entry.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  };

  if (loading) {
    return <HomeSkeletonLoader />;
  }

  return (
    <div className="home-wrapper-modern">
      {/* Header */}
      <div className="contentstack-header">
        <div className="contentstack-hero">
          <FiFilm className="hero-icon-large" />
          <h1 className="contentstack-title">Browse Anime Episodes</h1>
          <p className="contentstack-subtitle">
            Select an episode to start watching
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-wrapper-modern">
          <FiSearch className="search-icon-modern" />
          <input
            type="text"
            className="search-input-modern"
            placeholder="Search anime series..."
            value={searchkey}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Home Entries Grid */}
      <div className="content-types-section">
        <div className="content-types-container">
          <div className="content-types-header">
            <h2 className="section-title">
              <FiGrid className="section-icon" />
              Available Episodes ({filteredEntries.length})
            </h2>
          </div>

          {filteredEntries.length > 0 ? (
            <div className="content-types-grid">
              {filteredEntries.map((entry) => {
                // Use title_ct field to determine which content type to load
                const contentTypeToLoad =
                  entry.title_ct || entry.series_content_type || "one_piece";

                // Extract poster URL from nested structure
                const posterUrl =
                  entry.poster_url?.url ||
                  entry.thumbnail?.url ||
                  entry.poster_image?.url ||
                  entry.thumbnail ||
                  "https://via.placeholder.com/300x450/1a1a1a/e9373a?text=" +
                    encodeURIComponent(entry.title);

                return (
                  <div key={entry.id} className="content-type-card-wrapper">
                    <button
                      className="info-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const card = e.currentTarget.closest(
                          ".content-type-card-wrapper"
                        );
                        const cardRect = card.getBoundingClientRect();
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;

                        // Calculate available space in each direction
                        const spaceLeft = cardRect.left;
                        const spaceRight = viewportWidth - cardRect.right;
                        const spaceTop = cardRect.top;
                        const spaceBottom = viewportHeight - cardRect.bottom;

                        // Determine best position
                        let position;
                        if (spaceRight >= 400) {
                          // Popover width
                          position = "right";
                        } else if (spaceLeft >= 400) {
                          position = "left";
                        } else if (spaceBottom >= 300) {
                          // Approximate height
                          position = "bottom";
                        } else if (spaceTop >= 300) {
                          position = "top";
                        } else {
                          position = "center"; // Fallback for mobile
                        }

                        setSelectedInfo({
                          ...entry,
                          cardElement: card,
                          position: position,
                        });
                      }}
                    >
                      <FiInfo />
                    </button>
                    <Link
                      to={`/contentstack/${contentTypeToLoad}`}
                      className="content-type-card"
                    >
                      <div className="content-type-poster">
                        <img
                          src={posterUrl}
                          alt={entry.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x450/1a1a1a/e9373a?text=" +
                              encodeURIComponent(entry.title);
                          }}
                        />
                        <div className="content-type-overlay">
                          <FiPlay className="play-icon" />
                        </div>
                      </div>
                      <div className="content-type-info">
                        <div className="content-type-meta">
                          <span className="episode-badge">
                            EP {entry.current_episode || "?"}
                          </span>
                          <span className="duration-badge">
                            {entry.duration || "24m"}
                          </span>
                        </div>
                        <h3 className="content-type-title">{entry.title}</h3>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <FiGrid className="no-results-icon-large" />
              <h3>No Episodes Found</h3>
              <p>
                {searchkey
                  ? "Try a different search term"
                  : "Check your Contentstack configuration"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Popover */}
      {selectedInfo?.cardElement &&
        createPortal(
          <div
            className="info-popover"
            data-position={selectedInfo.position || "left"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="info-popover-content">
              <div className="info-popover-header">
                <h2>{selectedInfo.title}</h2>
                <div className="info-popover-metadata">
                  <span className="rating">
                    ★ {selectedInfo.rating || "7.39"}
                  </span>
                  <span className="likes">
                    👍 {selectedInfo.likes || "9.29"}
                  </span>
                </div>
              </div>
              <p className="info-popover-description">
                {selectedInfo.description ||
                  selectedInfo.synopsis ||
                  "No description available."}
              </p>
              <div className="info-popover-footer">
                <div className="info-popover-details">
                  <div className="detail-row">
                    <span>Aired:</span>
                    <span>{selectedInfo.release_date || "Feb 02, 2025"}</span>
                  </div>
                  <div className="detail-row">
                    <span>Status:</span>
                    <span>{selectedInfo.status || "Releasing"}</span>
                  </div>
                  <div className="detail-row">
                    <span>Genres:</span>
                    <span>
                      {selectedInfo.genres?.join(", ") ||
                        "Music, Fantasy, Action, Mahou Shoujo"}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/contentstack/${
                    selectedInfo.title_ct ||
                    selectedInfo.series_content_type ||
                    "one_piece"
                  }`}
                  className="watch-now-button"
                  onClick={() => setSelectedInfo(null)}
                >
                  Watch now
                  <FiPlay className="watch-icon" />
                </Link>
              </div>
            </div>
          </div>,
          selectedInfo.cardElement
        )}
    </div>
  );
}

export default Home;
