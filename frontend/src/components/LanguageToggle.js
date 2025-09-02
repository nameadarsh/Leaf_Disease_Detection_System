import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { FaLanguage } from "react-icons/fa";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button onClick={toggleLanguage} className="language-toggle" title={language === "en" ? "Switch to Hindi" : "Switch to English"}>
      <FaLanguage />
      <span className="language-code">{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggle;