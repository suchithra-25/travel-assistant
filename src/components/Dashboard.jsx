import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          width: "300px",
        }}
      >
        <h1 style={{ color: "#0000FF", marginBottom: "20px" }}>
          Welcome to Travel Assistor
        </h1>
        <button
          style={buttonStyle}
          onClick={() => navigate("/translate")}
        >
          Text Translation
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/audio-translation")}
        >
          Audio Translation
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/object-detection")}
        >
          Object Detection
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/place-info")}
        >
          Fetch Place Information
        </button>

        
      </div>

      
    </div>
  );
};

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#007BFF",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Dashboard;

