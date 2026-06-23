import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Relax from "./pages/Relax";
import Journal from "./pages/Journal";
import MoodTracker from "./pages/MoodTracker";
import AICompanion from "./pages/AICompanion";
import CommunityChat from "./pages/CommunityChat";
import CalmGames from "./pages/CalmGames";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Homepage opens directly */}
          <Route path="/" element={<HomePage />} />

          {/* Direct access pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/relax" element={<Relax />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/moodtracker" element={<MoodTracker />} />
          <Route path="/ai" element={<AICompanion />} />
          <Route path="/chat" element={<CommunityChat />} />
          <Route path="/games" element={<CalmGames />} />

          {/* Static pages */}
          <Route
            path="/about"
            element={<h2 style={{ textAlign: "center", marginTop: "100px" }}>About Us Page (Coming Soon)</h2>}
          />
          <Route
            path="/experience"
            element={<h2 style={{ textAlign: "center", marginTop: "100px" }}>Our Experience / Experts Page (Coming Soon)</h2>}
          />
          <Route
            path="/emergency"
            element={<h2 style={{ textAlign: "center", marginTop: "100px" }}>Emergency Help Page (Coming Soon)</h2>}
          />

          {/* Catch-all redirect to homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
