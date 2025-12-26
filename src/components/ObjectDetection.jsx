import React, { useState } from "react";
import axios from "axios";
import LanguageSelector from "./LanguageSelector"; // Import the LanguageSelector component
import { useNavigate } from "react-router-dom";

const ObjectDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [selectedLang, setSelectedLang] = useState("en"); // Default language set to English
  const [translatedObjects, setTranslatedObjects] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setDetectedObjects([]);
    setError("");
    setTranslatedObjects([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/detect-objects",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDetectedObjects(response.data.objects);
      setTranslatedObjects([]); // Clear translated objects on new upload
    } catch (err) {
      setError("Error detecting objects. Please try again.");
    }
  };

  const translateObjects = async () => {
    if (!detectedObjects.length) {
      setError("No objects detected to translate.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5001/translate", {
        objects: detectedObjects.map((obj) => obj.class),
        targetLang: selectedLang,
      });

      if (response.data.translatedObjects) {
        setTranslatedObjects(response.data.translatedObjects);
        setError("");
      } else {
        setError("Error: Unable to translate objects.");
      }
    } catch (err) {
      setError("Error: Translation failed.");
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
          Object Detection
        </h1>

        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {previewImage && (
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                padding: "5px",
              }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          style={{
            display: "block",
            margin: "0 auto",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Detect Objects
        </button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <LanguageSelector selectedLang={selectedLang} onChange={setSelectedLang} />
          <button
            onClick={translateObjects}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Translate Objects
          </button>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {detectedObjects.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f8f8f8",
            }}
          >
            <h3 style={{ color: "#333", textAlign: "center" }}>
              Detected Objects
            </h3>
            <ul style={{ listStyle: "none", padding: "0" }}>
              {detectedObjects.map((obj, index) => (
                <li
                  key={index}
                  style={{
                    padding: "5px",
                    borderBottom: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {translatedObjects[index] || obj.class} - Confidence:{" "}
                  <strong>{(obj.confidence * 100).toFixed(2)}%</strong>
                </li>
              ))}
            </ul>
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
};

export default ObjectDetection;










