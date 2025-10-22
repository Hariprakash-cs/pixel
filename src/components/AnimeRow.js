import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

const AnimeRow = ({ title, items, seeAllLink }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="anime-row">
      <div className="anime-row-header">
        <h2 className="anime-row-title">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="anime-row-see-all">
            See All →
          </Link>
        )}
      </div>

      <div className="anime-row-container">
        {showLeftArrow && (
          <button
            className="anime-row-nav left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="anime-row-scroll"
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <Link
              key={item.id || item._id}
              to={`/api/newvideo/${item.id || item._id}`}
              className="anime-row-item"
            >
              <div className="anime-row-item-image-wrapper">
                <img
                  src={item.thumbnail || item.thumbnail_img}
                  alt={item.title}
                  className="anime-row-item-image"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450?text=No+Image";
                  }}
                />
                <div className="anime-row-item-overlay">
                  <div className="anime-row-item-info">
                    <h3 className="anime-row-item-title">{item.title}</h3>
                    {item.rating && (
                      <div className="anime-row-item-rating">
                        <FiStar className="star-icon" />
                        <span>{item.rating}</span>
                      </div>
                    )}
                    <div className="anime-row-item-meta">
                      {item.year && <span>{item.year}</span>}
                      {item.episodes && <span>{item.episodes} EP</span>}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button
            className="anime-row-nav right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimeRow;
