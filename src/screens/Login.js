import React, { useState } from "react";
import axios from "axios";
import { config } from "./../config";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Loader1 from "../components/Loader1";
import { FiLogIn, FiMail, FiLock, FiInfo } from "react-icons/fi";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(false);

  async function login() {
    const user = {
      email,
      password,
    };
    console.log(user);
    try {
      setloading(true);
      const result = await axios.post(`${config.api}/api/users/login`, user);
      const logdata = result.data;
      setloading(false);
      localStorage.setItem("react_app_token", logdata.token);
      localStorage.setItem("user", JSON.stringify(logdata.temp));
      window.location.href = "/home";
    } catch (error) {
      setloading(false);
      seterror(true);
      console.log(error);
    }
  }

  return (
    <div className="auth-page-wrapper">
      {loading && <Loader1 />}

      <div className="auth-container">
        <div className="auth-background-overlay"></div>
        <div className="auth-content">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-wrapper">
                <FiLogIn className="auth-icon" />
              </div>
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to continue</p>
            </div>

            {error && <Error message="Invalid Credentials" />}

            <div className="auth-form">
              <div className="form-group-modern">
                <div className="input-icon-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    className="form-control-modern"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <div className="input-icon-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    className="form-control-modern"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setpassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <button className="btn-auth-modern" onClick={login}>
                <span>Sign In</span>
                <span className="btn-arrow">→</span>
              </button>

              <div className="demo-credentials">
                <div className="demo-header">
                  <FiInfo className="demo-icon" />
                  <span>Demo Credentials</span>
                </div>
                <div className="demo-list">
                  <div className="demo-item">
                    <span className="demo-label">User:</span>
                    <span className="demo-value">user@gmail.com</span>
                  </div>
                  <div className="demo-item">
                    <span className="demo-label">Admin:</span>
                    <span className="demo-value">admin@gmail.com</span>
                  </div>
                  <div className="demo-item">
                    <span className="demo-label">Password:</span>
                    <span className="demo-value">123</span>
                  </div>
                </div>
              </div>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Don't have an account?{" "}
                  <a href="/register" className="auth-link">
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
