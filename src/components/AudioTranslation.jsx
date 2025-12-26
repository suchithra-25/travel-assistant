import React, { useState } from "react";
import LanguageSelector from "./LanguageSelector";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AudioTranslation = () => {
  const [sourceLang, setSourceLang] = useState("en"); // Default source language
  const [targetLang, setTargetLang] = useState("hi"); // Default target language
  const [recognizedText, setRecognizedText] = useState(""); // Recognized speech
  const [translatedText, setTranslatedText] = useState(""); // Translation result
  const [isListening, setIsListening] = useState(false); // Voice recognition state
  const navigate = useNavigate();
  
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = sourceLang;

  // Start voice recognition
  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  // Stop voice recognition
  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  // Handle recognized speech
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setRecognizedText(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    alert("Error recognizing speech. Please try again.");
  };

  // Translate text using backend
  /*
  const translateText = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/audio-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: recognizedText,
          source_language: sourceLang,
          target_language: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch translation.");
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
      handleAudioPlayback(data.translated_text, targetLang);
    } catch (error) {
      console.error("Translation error:", error);
      alert("Error translating text. Please try again.");
    }
  };
  */
  const translateText = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5001/audio-translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: recognizedText,
                source_language: sourceLang,
                target_language: targetLang,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch translation.");
        }

        const data = await response.json();
        console.log("Translated Text:", data.translated_text); // Debugging line
        setTranslatedText(data.translated_text);
        handleAudioPlayback(data.translated_text, targetLang);
    } catch (error) {
        console.error("Translation error:", error);
        alert("Error translating text. Please try again.");
    }
};

  // Play translated text as audio
  /*
  const handleAudioPlayback = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };
  */
  const handleAudioPlayback = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.includes('-') ? lang : `${lang}-IN`; // Fallback to regional language variant
    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        alert("Error playing audio. Please check the language settings.");
    };
    window.speechSynthesis.speak(utterance);
};
  

  return (
    <div className="audio-translation-container" style={{ textAlign: "center" }}>
      <h2>Audio Translator</h2>
      <textarea
        placeholder="Recognized speech will appear here"
        value={recognizedText}
        readOnly
        style={{ width: "80%", height: "100px", marginBottom: "20px" }}
      ></textarea>
      <div>
      <div className="dropdown-container">
        <LanguageSelector
          selectedLang={sourceLang}
          onChange={setSourceLang}
        />
        <LanguageSelector
          selectedLang={targetLang}
          onChange={setTargetLang}
        />
      </div>
      </div>
      <button
        onClick={startListening}
        disabled={isListening}
        style={{
          margin: "10px",
          padding: "10px",
          backgroundColor: isListening ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: isListening ? "not-allowed" : "pointer",
        }}
      >
        Start Listening
      </button>
      <button
        onClick={stopListening}
        disabled={!isListening}
        style={{
          margin: "10px",
          padding: "10px",
          backgroundColor: !isListening ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: !isListening ? "not-allowed" : "pointer",
        }}
      >
        Stop Listening
      </button>
      <button
        onClick={translateText}
        disabled={!recognizedText}
        style={{
          margin: "10px",
          padding: "10px",
          backgroundColor: !recognizedText ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: !recognizedText ? "not-allowed" : "pointer",
        }}
      >
        Translate
      </button>
      <textarea
        placeholder="Translated text will appear here"
        value={translatedText}
        readOnly
        style={{
          width: "80%",
          height: "100px",
          marginTop: "20px",
        }}
      ></textarea>
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
  );
};

export default AudioTranslation;






