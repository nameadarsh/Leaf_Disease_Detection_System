import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ResultCard = () => {
  const { t } = useLanguage();
  const [result, setResult] = React.useState(null);

  // Listen for result updates from ImageUpload component
  React.useEffect(() => {
    const handleResultUpdate = (event) => {
      if (event.detail) {
        setResult(event.detail);
      }
    };

    window.addEventListener("resultUpdate", handleResultUpdate);
    return () => window.removeEventListener("resultUpdate", handleResultUpdate);
  }, []);

  if (!result) return null;

  return (
    <div className="card fade-in">
      <h2 className="result-title">{t("resultTitle")}</h2>

      <div className={result.is_healthy ? "result-healthy" : "result-disease"}>
        <h3 className="result-diagnosis">
          {result.is_healthy ? (
            <>
              <FaCheckCircle className="result-icon" />
              {t("healthyResult")}
            </>
          ) : (
            <>
              <FaExclamationTriangle className="result-icon" />
              {t("diseaseDetected")}: {result.disease_name}
            </>
          )}
        </h3>
      </div>

      {result.processed_image && (
        <div className="processed-image-container">
          <img 
            src={result.processed_image} 
            alt="Processed" 
            className="image-preview processed-image" 
          />
        </div>
      )}

      <div className="precautions-container">
        <h4 className="precautions-title">{t("precautionsTitle")}</h4>
        <ul className="precautions-list">
          {result.precautions.map((precaution, index) => (
            <li key={index} className="precaution-item">{precaution}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultCard;