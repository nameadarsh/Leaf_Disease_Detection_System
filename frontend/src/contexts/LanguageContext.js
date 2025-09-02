import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the language context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  // Toggle between English and Hindi
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === "en" ? "hi" : "en");
  };

  // Fetch translations from the backend
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/languages");
        setTranslations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        setLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  // Get translation for a specific key
  const t = (key) => {
    if (loading || !translations[language] || !translations[language][key]) {
      // Fallback to English or return the key itself if not found
      return translations.en && translations.en[key] ? translations.en[key] : key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
