import React, { useEffect, useRef } from "react";
import { init } from "ityped";
function Landing() {
  const textRef = useRef();
  useEffect(() => {
    init(textRef.current, {
      showCursor: true,
      backDelay: 1500,
      backSpeed: 60,
      strings: [
        "Welcome to PixelStream",
        "Your Video Experience",
        "Get Started",
      ],
    });
  }, []);

  // setTimeout(()=>{
  //   window.location.href='/home'
  // },5000);
  return (
    <div
      className="landing-wrapper"
      onClick={() => (window.location.href = "/home")}
    >
      <div className="landing-overlay"></div>
      <div className="landing-content">
        <div className="landing-hero">
          <div className="hero-badge">
            <span className="badge-icon">▶</span>
          </div>
          <h1 className="landing-title">
            <span className="gradient-text">PixelStream</span>
          </h1>
          <h3 className="landing-subtitle">
            <span ref={textRef}></span>
          </h3>
          <p className="landing-description">
            Experience seamless video streaming like never before
          </p>
          <div className="landing-cta">
            <button className="cta-button">
              <span>Enter Experience</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
}

export default Landing;
