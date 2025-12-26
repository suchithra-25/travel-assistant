import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Translate from "./components/Translate";
import AudioTranslation from "./components/AudioTranslation";
import ObjectDetection from "./components/ObjectDetection";
import PlaceInfo from "./components/PlaceInfo";
import Dashboard from "./components/Dashboard";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Protected routes */}
        <Route
          path="/translate"
          element={isAuthenticated ? <Translate /> : <Navigate to="/login" />}
        />
        <Route
          path="/audio-translation"
          element={isAuthenticated ? <AudioTranslation /> : <Navigate to="/login" />}
        />
        <Route
          path="/object-detection"
          element={isAuthenticated ? <ObjectDetection /> : <Navigate to="/login" />}
        />
        <Route
          path="/place-info"
          element={isAuthenticated ? <PlaceInfo /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;





