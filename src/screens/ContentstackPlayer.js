import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";
import { PlayerSkeletonLoader } from "../components/SkeletonLoader";
import { contentstackAPI, transformEntries } from "../services/contentstackAPI";
import { userAPI } from "../services/apiService";
import {
  FiFilm,
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiChevronRight as FiChevronBreadcrumb,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

function ContentstackPlayer() {
  const [loading, setloading] = useState(true);
  const { contentType, entryId } = useParams();
  const navigate = useNavigate();
  const [currentEntry, setCurrentEntry] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [contentTypeTitle, setContentTypeTitle] = useState("");
  const [homeEntryDetails, setHomeEntryDetails] = useState(null); // Store home entry with anime details
  const [currentPage, setCurrentPage] = useState(1);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending
  const episodesPerPage = 50; // Show 50 episodes per page

  useEffect(() => {
    console.log("🔍 ContentstackPlayer mounted");
    console.log("📍 contentType:", contentType);
    console.log("📍 entryId:", entryId);

    window.scrollTo(0, 0);

    // Check if user is authenticated
    if (!userAPI.isAuthenticated()) {
      console.log("❌ User not authenticated, redirecting to login");
      Swal.fire("Oops", "Login before playing video", "error").then(() => {
        window.location.href = "/login";
      });
      return;
    }

    console.log("✅ User authenticated, fetching data...");

    const fetchContentstackData = async () => {
      try {
        setloading(true);
        console.log("📡 Fetching content type and entries...");

        // Calculate skip based on current page
        const skip = (currentPage - 1) * episodesPerPage;

        // Fetch content type details, paginated entries, and home entry
        const [contentTypeResult, entriesResult, homeEntryResult] =
          await Promise.all([
            contentstackAPI.getContentType(contentType),
            contentstackAPI.getEntriesByContentType(contentType, {
              skip: skip,
              limit: episodesPerPage,
              sortOrder: sortOrder,
            }),
            contentstackAPI.getEntryByField("home", "title_ct", contentType),
          ]);

        console.log("📦 Content Type Result:", contentTypeResult);
        console.log("📦 Entries Result:", entriesResult);
        console.log("🏠 Home Entry Result:", homeEntryResult);
        console.log(
          `📄 Fetched ${
            entriesResult.data?.length || 0
          } entries (skip: ${skip}, limit: ${episodesPerPage})`
        );

        // Set content type title
        if (contentTypeResult.success && contentTypeResult.data) {
          setContentTypeTitle(contentTypeResult.data.title || contentType);
          console.log(
            "✅ Content type title set:",
            contentTypeResult.data.title
          );
        }

        // Set home entry details (anime metadata from home content type)
        if (homeEntryResult.success && homeEntryResult.data) {
          setHomeEntryDetails(homeEntryResult.data);
          console.log("🏠 Home entry details loaded:", homeEntryResult.data);
        } else {
          console.warn("⚠️ No home entry found for content type:", contentType);
        }

        // Set paginated entries
        if (entriesResult.success && entriesResult.data) {
          const transformed = transformEntries(entriesResult.data, contentType);
          setAllEntries(transformed);

          // Set total count from response
          const total = entriesResult.count || transformed.length;
          setTotalEntries(total);

          console.log(
            `📚 Transformed ${transformed.length} entries (Total: ${total})`
          );

          if (transformed.length === 0) {
            console.error("❌ No entries found for:", contentType);
            Swal.fire(
              "Error",
              "No episodes available for this series",
              "error"
            );
            setloading(false);
            return;
          }

          // If entryId is not provided, automatically play the first entry
          if (!entryId) {
            const firstEntry = transformed[0];
            console.log("🎬 Auto-loading first entry:", firstEntry.title);
            console.log("🎬 First entry ID:", firstEntry.id);
            console.log(
              "🚀 Navigating to:",
              `/contentstack/${contentType}/${firstEntry.id}`
            );
            setloading(false);
            // Update URL to include the first entry's ID
            navigate(`/contentstack/${contentType}/${firstEntry.id}`, {
              replace: true,
            });
            console.log("✅ Navigation called");
            return; // This will trigger the useEffect again with the entryId
          }

          // Find and set current entry
          const current = transformed.find((entry) => entry.id === entryId);
          if (current) {
            setCurrentEntry(current);
            console.log("✅ Loaded entry:", current.title);
            console.log("🎬 Video Link:", current.video_link);
            console.log("📺 Full Entry:", current);
          } else {
            console.error("❌ Entry not found:", entryId);
            // Fallback to first entry if specified entry not found
            const firstEntry = transformed[0];
            console.log("⚠️ Entry not found, redirecting to first entry");
            setloading(false);
            navigate(`/contentstack/${contentType}/${firstEntry.id}`, {
              replace: true,
            });
            return;
          }
        } else {
          console.error("❌ Failed to fetch entries:", entriesResult.error);
          Swal.fire("Error", "Failed to load entries", "error");
        }
      } catch (error) {
        console.error("❌ Error fetching Contentstack data:", error);
        Swal.fire("Error", "Failed to load video details", "error");
      } finally {
        setloading(false);
      }
    };

    fetchContentstackData();
  }, [contentType, entryId, navigate, currentPage, episodesPerPage, sortOrder]);

  if (loading) {
    return <PlayerSkeletonLoader />;
  }

  if (!currentEntry) {
    return (
      <div className="player-wrapper">
        <div className="no-results">
          <FiFilm className="no-results-icon-large" />
          <h3>Entry Not Found</h3>
          <p>The requested entry could not be loaded.</p>
          <Link to="/home" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Pagination logic based on total entries
  const totalPages = Math.ceil(totalEntries / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = Math.min(startIndex + episodesPerPage, totalEntries);
  const currentEpisodes = allEntries; // Already paginated from API

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="player-wrapper">
      {/* Breadcrumb Header */}
      <div className="player-breadcrumb">
        <Link to="/home" className="breadcrumb-item">
          <FiHome className="breadcrumb-icon" />
          Home
        </Link>
        <FiChevronBreadcrumb className="breadcrumb-separator" />
        <span className="breadcrumb-item current">
          {contentTypeTitle || contentType}
        </span>
      </div>

      <div className="player-container-with-sidebar">
        {/* Video Player Section */}
        <div className="video-section">
          {/* Video Player */}
          <div className="video-player-modern">
            {currentEntry.video_link ? (
              <ReactPlayer
                controls
                url={currentEntry.video_link}
                width="100%"
                height="100%"
                playing={true}
                volume={0.8}
                muted={false}
                config={{
                  youtube: {
                    playerVars: {
                      showinfo: 1,
                      autoplay: 1,
                      rel: 0,
                      modestbranding: 1,
                    },
                  },
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      autoPlay: true,
                      preload: "auto",
                    },
                  },
                }}
              />
            ) : (
              <div className="no-video-available">
                <FiPlay className="no-video-icon" />
                <h3>Video Not Available</h3>
                <p>This entry doesn't have a video link configured.</p>
              </div>
            )}
          </div>

          {/* Video Info Section */}
          <div className="anime-info-section">
            <div className="anime-info-header">
              <div className="anime-info-left">
                {/* Poster Image */}
                {homeEntryDetails?.poster_url?.url && (
                  <div className="anime-poster">
                    <img
                      src={homeEntryDetails.poster_url.url}
                      alt={homeEntryDetails.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="anime-info-content">
                <h1 className="anime-title">
                  {homeEntryDetails?.title ||
                    contentTypeTitle ||
                    currentEntry.title}
                </h1>

                {homeEntryDetails?.original_title && (
                  <div className="anime-subtitle">
                    {homeEntryDetails.original_title}
                  </div>
                )}

                {/* Only show badges if data exists */}
                <div className="anime-badges">
                  {homeEntryDetails?.rating && (
                    <span className="badge pg">{homeEntryDetails.rating}</span>
                  )}
                  {homeEntryDetails?.total_episode && (
                    <span className="badge cc">
                      CC {homeEntryDetails.total_episode}
                    </span>
                  )}
                  {homeEntryDetails?.type && (
                    <span className="badge type">{homeEntryDetails.type}</span>
                  )}
                </div>

                {homeEntryDetails?.description && (
                  <p className="anime-description">
                    {homeEntryDetails.description}
                  </p>
                )}

                <div className="anime-stats">
                  <div className="meta-section">
                    <h4 className="meta-title">Details</h4>
                    <div className="meta-grid">
                      {homeEntryDetails?.country && (
                        <div className="meta-item">
                          <span className="meta-label">Country</span>
                          <span className="meta-value">
                            {homeEntryDetails.country}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.status && (
                        <div className="meta-item">
                          <span className="meta-label">Status</span>
                          <span className="meta-value">
                            {homeEntryDetails.status}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.premiered && (
                        <div className="meta-item">
                          <span className="meta-label">Premiered</span>
                          <span className="meta-value">
                            {homeEntryDetails.premiered}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.studios && (
                        <div className="meta-item">
                          <span className="meta-label">Studios</span>
                          <span className="meta-value">
                            {homeEntryDetails.studios}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.date_aired && (
                        <div className="meta-item">
                          <span className="meta-label">Date Aired</span>
                          <span className="meta-value">
                            {homeEntryDetails.date_aired}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.producers && (
                        <div className="meta-item">
                          <span className="meta-label">Producers</span>
                          <span className="meta-value">
                            {homeEntryDetails.producers}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.broadcast && (
                        <div className="meta-item">
                          <span className="meta-label">Broadcast</span>
                          <span className="meta-value">
                            {homeEntryDetails.broadcast}
                          </span>
                        </div>
                      )}
                      {homeEntryDetails?.duration && (
                        <div className="meta-item">
                          <span className="meta-label">Duration</span>
                          <span className="meta-value">
                            {homeEntryDetails.duration}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {homeEntryDetails?.genres && (
                    <div className="meta-section genres">
                      <h4 className="meta-title">Genres</h4>
                      <div className="genre-tags">
                        {homeEntryDetails.genres
                          .split(",")
                          .map((genre, index) => (
                            <span key={index} className="genre-tag">
                              {genre.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {homeEntryDetails?.rating_score && (
                <div className="anime-info-right">
                  <div className="rating-box">
                    <div className="rating-label">
                      How'd you rate this anime?
                    </div>
                    <div className="rating-score">
                      {homeEntryDetails.rating_score}
                    </div>
                    {homeEntryDetails?.rating_users && (
                      <div className="rating-users">
                        by {homeEntryDetails.rating_users} reviews
                      </div>
                    )}
                    {homeEntryDetails?.rating_stars && (
                      <div className="rating-stars">
                        {homeEntryDetails.rating_stars}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Episodes Sidebar */}
        {allEntries.length > 0 && (
          <div className="episodes-sidebar">
            <div className="episodes-sidebar-header">
              <div className="sidebar-title-row">
                <div className="title-with-sort">
                  <h3 className="sidebar-title">Episodes</h3>
                  <div className="sort-icons">
                    <button
                      className={`sort-icon-btn ${
                        sortOrder === "asc" ? "active" : ""
                      }`}
                      onClick={() => setSortOrder("asc")}
                      title="Sort Ascending"
                    >
                      <FiArrowUp />
                    </button>
                    <button
                      className={`sort-icon-btn ${
                        sortOrder === "desc" ? "active" : ""
                      }`}
                      onClick={() => setSortOrder("desc")}
                      title="Sort Descending"
                    >
                      <FiArrowDown />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="episode-range-selector"
                onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              >
                {String(startIndex + 1).padStart(3, "0")}-
                {String(Math.min(endIndex, allEntries.length)).padStart(3, "0")}
                <FiChevronRight
                  className={`dropdown-arrow ${
                    showRangeDropdown ? "open" : ""
                  }`}
                />
              </div>
            </div>

            {/* Range Dropdown */}
            {showRangeDropdown && totalPages > 1 && (
              <div className="range-dropdown">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const rangeStart = (page - 1) * episodesPerPage + 1;
                    const rangeEnd = Math.min(
                      page * episodesPerPage,
                      allEntries.length
                    );
                    return (
                      <div
                        key={page}
                        className={`range-option ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => {
                          handlePageChange(page);
                          setShowRangeDropdown(false);
                        }}
                      >
                        {String(rangeStart).padStart(3, "0")}-
                        {String(rangeEnd).padStart(3, "0")}
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Episode Grid */}
            <div className="episodes-grid-numbers">
              {currentEpisodes.map((entry, index) => {
                const episodeNum =
                  sortOrder === "asc"
                    ? startIndex + index + 1
                    : totalEntries - (startIndex + index);
                const isCurrentEntry = entry.id === currentEntry.id;

                return (
                  <Link
                    key={entry.id}
                    to={`/contentstack/${contentType}/${entry.id}`}
                    className={`episode-number-box ${
                      isCurrentEntry ? "active" : ""
                    }`}
                    title={entry.title}
                  >
                    {episodeNum}
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="episodes-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft />
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentstackPlayer;
