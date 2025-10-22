import React from "react";

// Skeleton Loader for Home Page - Anime Cards Grid
export const HomeSkeletonLoader = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section Skeleton */}
      <div className="home-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="skeleton-hero-title"></div>
          <div className="skeleton-hero-subtitle"></div>
        </div>
      </div>

      {/* Search & Filter Skeleton */}
      <div className="search-filter-section">
        <div className="search-filter-container">
          <div className="skeleton-search"></div>
          <div className="skeleton-filter"></div>
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="home-content">
        <div className="content-header">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-results-count"></div>
        </div>

        <div className="anime-grid">
          {[...Array(12)].map((_, index) => (
            <div className="skeleton-anime-card" key={index}>
              <div className="skeleton-card-image"></div>
              <div className="skeleton-card-content">
                <div className="skeleton-card-title"></div>
                <div className="skeleton-card-series"></div>
                <div className="skeleton-card-meta">
                  <div className="skeleton-meta-item"></div>
                  <div className="skeleton-meta-item"></div>
                </div>
                <div className="skeleton-card-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for Player Page
export const PlayerSkeletonLoader = () => {
  return (
    <div className="player-wrapper">
      <div className="player-container">
        <div className="video-section">
          {/* Video Player Skeleton */}
          <div className="skeleton-video-player"></div>

          {/* Video Info Skeleton */}
          <div className="video-info-section">
            <div className="video-header">
              <div className="skeleton-video-badge"></div>
              <div className="skeleton-video-title"></div>
              <div className="skeleton-video-series"></div>
            </div>

            <div className="video-meta-grid">
              {[...Array(4)].map((_, index) => (
                <div className="skeleton-meta-card" key={index}>
                  <div className="skeleton-meta-icon"></div>
                  <div className="skeleton-meta-content">
                    <div className="skeleton-meta-label"></div>
                    <div className="skeleton-meta-value"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="skeleton-details-section">
              <div className="skeleton-details-title"></div>
              <div className="skeleton-details-text"></div>
              <div className="skeleton-details-text short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple skeleton loader for other pages
export const SimpleSkeletonLoader = () => {
  return (
    <div className="simple-skeleton-wrapper">
      <div className="simple-skeleton-container">
        {[...Array(6)].map((_, index) => (
          <div className="simple-skeleton-item" key={index}>
            <div className="simple-skeleton-image"></div>
            <div className="simple-skeleton-text"></div>
            <div className="simple-skeleton-text short"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSkeletonLoader;
