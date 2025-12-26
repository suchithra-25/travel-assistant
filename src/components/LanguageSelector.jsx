import React, { useEffect, useState } from "react";

const LanguageSelector = ({ selectedLang, onChange }) => {
    const [languages, setLanguages] = useState({});

    useEffect(() => {
        // Fetch supported languages from backend
        fetch("http://127.0.0.1:5001/languages")
            .then((response) => response.json())
            .then((data) => setLanguages(data))
            .catch((error) => console.error("Error fetching languages:", error));
    }, []);

    return (
        <select value={selectedLang} onChange={(e) => onChange(e.target.value)}>
            {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                    {name}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
