import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlay,
  FiInfo,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const AnimeCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (!isAnimating && items.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (!isAnimating && items.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleDotClick = (index) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="anime-carousel">
      <div className="carousel-background">
        <img
          src={currentItem.backdrop || currentItem.thumbnail}
          alt={currentItem.title}
          className="carousel-bg-image"
        />
        <div className="carousel-gradient-overlay"></div>
      </div>

      <div className="carousel-content">
        <div className="carousel-info">
          <h1 className="carousel-title">{currentItem.title}</h1>

          <div className="carousel-meta">
            <span className="carousel-rating">
              <FiStar className="star-icon" />
              {currentItem.rating}
            </span>
            <span className="carousel-year">{currentItem.year}</span>
            <span className="carousel-episodes">
              {currentItem.episodes} Episodes
            </span>
            <span className="carousel-status">{currentItem.status}</span>
          </div>

          {currentItem.genre && (
            <div className="carousel-genres">
              {currentItem.genre.map((genre, idx) => (
                <span key={idx} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className="carousel-description">{currentItem.description}</p>

          <div className="carousel-buttons">
            <Link
              to={`/api/newvideo/${currentItem.id}`}
              className="carousel-btn primary"
            >
              <FiPlay className="btn-icon" />
              <span>Watch Now</span>
            </Link>
            <button className="carousel-btn secondary">
              <FiInfo className="btn-icon" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button className="carousel-nav prev" onClick={handlePrev}>
        <FiChevronLeft />
      </button>
      <button className="carousel-nav next" onClick={handleNext}>
        <FiChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeCarousel;
