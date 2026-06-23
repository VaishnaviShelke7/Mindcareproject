import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left" onClick={() => navigate("/dashboard")}>
        <img src={logo} alt="MindCare Logo" className="navbar-logo" />
        <span>MindCare</span>
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
}

export default Navbar;
