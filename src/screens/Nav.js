import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiPlayerfm } from "react-icons/si";
import { BsPersonCircle } from "react-icons/bs";
import { FiHome, FiUpload, FiShield, FiLogOut } from "react-icons/fi";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const loguser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <nav
      className={`navbar navbar-expand-lg modern-nav ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="container-fluid">
        <a className="navbar-brand modern-brand px-3" href="/home">
          <div className="brand-icon-wrapper">
            <SiPlayerfm className="brand-icon" />
          </div>
          <span className="brand-text">
            Pixel<span className="brand-highlight">Stream</span>
          </span>
        </a>
        <button
          className="navbar-toggler modern-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="fa fa-bars"></i>
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav px-4">
            {loguser ? (
              <>
                <div className="dropdown modern-dropdown">
                  <button
                    className="btn btn-secondary modern-dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <BsPersonCircle className="user-icon" />
                    <span className="user-name">{loguser.name}</span>
                    <span className="dropdown-arrow">▾</span>
                  </button>
                  <ul className="dropdown-menu modern-dropdown-menu">
                    <li>
                      <a
                        className="dropdown-item modern-dropdown-item"
                        href="/home"
                      >
                        <FiHome className="menu-icon" />
                        <span>Home</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item modern-dropdown-item"
                        href="/admin"
                      >
                        <FiShield className="menu-icon" />
                        <span>Admin</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item modern-dropdown-item"
                        href="/videoform"
                      >
                        <FiUpload className="menu-icon" />
                        <span>Upload</span>
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item modern-dropdown-item logout-item"
                        href="#"
                        onClick={logout}
                      >
                        <FiLogOut className="menu-icon" />
                        <span>Logout</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <li className="nav-item modern-nav-item">
                  <a className="nav-link modern-nav-link" href="/register">
                    Register
                  </a>
                </li>
                <li className="nav-item modern-nav-item">
                  <a
                    className="nav-link modern-nav-link nav-login"
                    href="/login"
                  >
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
