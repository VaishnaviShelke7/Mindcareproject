import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

// ✅ Import multiple images
import bg1 from "../assets/images/1.avif";
import bg2 from "../assets/images/2.jpg";
import bg3 from "../assets/images/3.jpg";
import bg4 from "../assets/images/4.jpg";
import bg5 from "../assets/images/5.jpg";
import bg6 from "../assets/images/6.webp";

// ✅ Array of images
const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];

// ✅ Randomly select one
const dashboardBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Relax", desc: "Calm your mind with guided exercises", icon: "🧘", path: "/relax", active: true },
    { title: "Journal", desc: "Write your thoughts freely and safely", icon: "📓", path: "/journal", active: true },
    { title: "Mood Tracker", desc: "Track your emotions over time", icon: "📊", path: "/moodtracker", active: true },
    { title: "AI Companion", desc: "Talk with your AI friend", icon: "🤖", path: "/ai", active: true },
{ title: "Community Chat", desc: "Chat with others", icon: "💬", path: "/chat", active: true },
{ title: "Calm Games", desc: "Play relaxing games", icon: "🎮", path: "/games", active: true },
  ];

  return (
    <>
      <Navbar />

      <div
        className="dashboard dashboard-gradient"
        style={{ backgroundImage: `url(${dashboardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="dashboard-content">
          <button className="back-home-btn" onClick={() => navigate("/")}>
            ⬅ Back to Home
          </button>

          <h1 className="dashboard-title">
            Welcome to MindCare <span>🌿</span>
          </h1>
          <p className="dashboard-subtitle">
            You showed up today. That matters.
          </p>

          <div className="dashboard-grid">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`dashboard-card ${!card.active ? "disabled" : ""}`}
                onClick={() => card.active && navigate(card.path)}
              >
                <h3>
                  {card.icon} {card.title}
                </h3>
                <p>{card.desc}</p>
                {!card.active && <span className="coming-soon">Coming Soon</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
