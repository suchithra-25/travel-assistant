import React, { useState } from "react";
import axios from "axios";
import LanguageSelector from "./LanguageSelector"; // Import the LanguageSelector component
import { useNavigate } from "react-router-dom";

function PlaceInfo() {
  const [query, setQuery] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en"); // Default language set to English
  const [translatedText, setTranslatedText] = useState("");
  const navigate = useNavigate();

  // Fetch place details
  const fetchPlaceDetails = async () => {
    if (!query.trim()) {
      setError("Please enter a place name.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5001/get-place-details", {
        params: { query },
      });
      setPlaceDetails(response.data);
      setTranslatedText(""); // Clear translated text when fetching new data
      setError(null);
    } catch (err) {
      setPlaceDetails(null);
      setError(err.response?.data?.error || "Failed to fetch place details.");
    }
  };

  // Translate the place description
  const translateDescription = async () => {
    if (!placeDetails?.description) {
      setTranslatedText("No description to translate.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: placeDetails.description,
          targetLang: selectedLang,
        }),
      });

      const data = await response.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        setTranslatedText("Error: Unable to translate.");
      }
    } catch (err) {
      setTranslatedText("Error: Translation failed.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "500px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          Fetch Place Information
        </h1>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter a place name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "10px",
              width: "calc(100% - 110px)",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={fetchPlaceDetails}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <LanguageSelector selectedLang={selectedLang} onChange={setSelectedLang} />
          <button
            onClick={translateDescription}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Translate
          </button>
        </div>

        {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

        {placeDetails && (
          <div
            style={{
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f8f8f8",
            }}
          >
            <h2 style={{ color: "#333" }}>{placeDetails.title}</h2>
            {placeDetails.image && (
              <img
                src={placeDetails.image}
                alt={placeDetails.title}
                style={{ maxWidth: "100%", marginBottom: "10px", borderRadius: "5px" }}
              />
            )}
            <p style={{ color: "#555" }}>
              <strong>Description:</strong> {translatedText || placeDetails.description}
            </p>
          </div>
        )}
        <button
            onClick={() => navigate("/dashboard")} // Redirect to dashboard
            className="translate-button"
            style={{
              marginTop: "20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Dashboard
          </button>
      </div>
    </div>
  );
}

export default PlaceInfo;








