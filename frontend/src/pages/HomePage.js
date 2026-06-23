import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import logo from "../assets/logo.png";
import moodMini from "../assets/images/moods-line.png";
import journalImg from "../assets/images/therapy3.jpg";
import moodImg from "../assets/images/moods.jpg";

// Import multiple images for hero
import bg1 from "../assets/images/1.avif";
import bg2 from "../assets/images/2.jpg";
import bg3 from "../assets/images/3.jpg";
import bg4 from "../assets/images/4.jpg";
import bg5 from "../assets/images/5.jpg";

const heroBackgrounds = [bg1, bg2, bg3, bg4, bg5];

function HomePage() {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);

  // Cycle backgrounds every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      {/* NAVBAR */}
      <header className="homepage-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="MindCare Logo" style={{ height: "35px", width: "35px", objectFit: "contain" }} />
          <span>MindCare</span>
        </div>

        <nav className="nav-links">
          <span onClick={() => document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" })}>Home</span>
          <span onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>About</span>
          <span onClick={() => document.getElementById("experience").scrollIntoView({ behavior: "smooth" })}>Experience</span>
          <span onClick={() => navigate("/journal")}>Journal</span>
          <span onClick={() => navigate("/moodtracker")}>Mood</span>
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="hero-section"
        id="dashboard"
        style={{
          backgroundImage: `url(${heroBackgrounds[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          transition: "background-image 1s ease-in-out",
        }}
      >
        

        <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
          <h1>Your Safe Space for Mental Wellness 🌿</h1>
          <p>Track moods, journal freely, and build emotional balance.</p>

          <div style={{ marginTop: "25px" }}>
            <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="section-content">
          <h2>Why MindCare?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>🧠 Mood Awareness</h3>
              <p>Understand emotional patterns and triggers.</p>
            </div>
            <div className="feature-card">
              <h3>📔 Private Journaling</h3>
              <p>Your thoughts, securely stored and organized.</p>
            </div>
            <div className="feature-card">
              <h3>🧘 Guided Calm</h3>
              <p>Relaxation techniques backed by experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          <div>
            <h3>10k+</h3>
            <p>Active Users</p>
          </div>
          <div>
            <h3>95%</h3>
            <p>User Satisfaction</p>
          </div>
          <div>
            <h3>24/7</h3>
            <p>Mental Wellness Support</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
<section className="experience-section" id="experience">
  <div className="section-content">
    <h2>Our Experience</h2>
    <p>Guided by mental health professionals and real-world practice</p>

    <div className="experience-grid">
      <div className="experience-card">
        <img src={require("../assets/images/therapy1.png")} alt="Therapy Session" />
        <h4>Professional Therapy</h4>
        <p>One-on-one and group counseling sessions</p>
      </div>

      <div className="experience-card">
        <img src={require("../assets/images/therapy2.jpg")} alt="Mindfulness" />
        <h4>Mindfulness Practice</h4>
        <p>Scientifically backed relaxation techniques</p>
      </div>

      <div className="experience-card">
        <img src={require("../assets/images/therapy3.jpg")} alt="Support" />
        <h4>Emotional Support</h4>
        <p>Compassion-driven mental wellness care</p>
      </div>
    </div>
  </div>
</section>


      {/* JOURNAL */}
      <section className="journal-section">
  <div className="glass-center">
    <div className="glass-patch">
      <img src={journalImg} alt="Journal" />

      <h2>Personal Journal</h2>
      <p>
        Write your thoughts, reflect on emotions, and track your mental journey.
      </p>

      <button onClick={() => navigate("/journal")}>
        Open Journal
      </button>
    </div>
  </div>
</section>


      {/* MOOD */}
     <section className="mood-section">
  <div className="glass-center">
    <div className="glass-patch">
      <img src={moodImg} alt="Mood Tracker" />

      <h2>Mood Tracker</h2>
      <p>
        Understand emotional patterns and maintain mental balance.
      </p>

      <button onClick={() => navigate("/mood-tracker")}>
        Open Mood Tracker
      </button>
    </div>
  </div>
</section>


    </div>
  );
}

export default HomePage;
