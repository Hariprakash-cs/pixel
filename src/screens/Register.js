import axios from "axios";
import React, { useState } from "react";
import { config } from "./../config";
import Success from "../components/Success";
import Loader1 from "../components/Loader1";
import Error from "../components/Error";
import { FiUser, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";

function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);

  async function register() {
    if (password == confirmpassword) {
      const user = {
        name,
        email,
        password,
        confirmpassword,
      };
      console.log(user);
      try {
        setloading(true);
        const result = await axios.post(
          `${config.api}/api/users/register`,
          user
        );
        setloading(false);
        setsuccess(true);
        setname("");
        setemail("");
        setpassword("");
        setconfirmpassword("");
        window.location.href = "/login";
        const regdata = result.data;
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(true);
      }
    } else {
      alert("passwords not matched");
    }
  }

  return (
    <div className="auth-page-wrapper">
      {loading && <Loader1 />}
      {error && <Error />}

      <div className="auth-container">
        <div className="auth-background-overlay"></div>
        <div className="auth-content">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon-wrapper">
                <FiUser className="auth-icon" />
              </div>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join PixelStream today</p>
            </div>

            {success && <Success message="Registration Successful" />}

            <div className="auth-form">
              <div className="form-group-modern">
                <div className="input-icon-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    className="form-control-modern"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                  />
                </div>
              </div>

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

              <div className="form-group-modern">
                <div className="input-icon-wrapper">
                  <FiCheckCircle className="input-icon" />
                  <input
                    type="password"
                    className="form-control-modern"
                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChange={(e) => {
                      setconfirmpassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <button className="btn-auth-modern" onClick={register}>
                <span>Create Account</span>
                <span className="btn-arrow">→</span>
              </button>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Already have an account?{" "}
                  <a href="/login" className="auth-link">
                    Sign In
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

export default Register;
