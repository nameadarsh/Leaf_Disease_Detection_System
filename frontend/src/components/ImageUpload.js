import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { FaUpload, FaCamera, FaSearch } from "react-icons/fa";

const ImageUpload = () => {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      // Create a canvas to capture the image
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setResult(null);

        // Stop the camera stream
        stream.getTracks().forEach((track) => track.stop());
      }, "image/jpeg");
    } catch (err) {
      setError("Failed to access camera: " + err.message);
    }
  };

  // Handle image upload and analysis
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("Please select or capture an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Send to backend for analysis
        const response = await axios.post("/predict", {
          image: base64data,
          lang: language
        });

        // Dispatch event for ResultCard component
        const resultEvent = new CustomEvent("resultUpdate", {
          detail: response.data
        });
        window.dispatchEvent(resultEvent);
        
        setResult(response.data);
        setLoading(false);
      };
    } catch (err) {
      setError("Error analyzing image: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in upload-card">
      <LanguageToggle />
      <h1 className="app-title">{t("title")}</h1>

      <div className="upload-buttons">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-btn">
          <FaUpload className="btn-icon" />
          <span>{t("uploadButton")}</span>
        </label>

        <button onClick={handleCameraCapture} className="capture-btn">
          <FaCamera className="btn-icon" />
          <span>{t("captureButton")}</span>
        </button>
      </div>

      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="Preview" className="image-preview" />
          <button onClick={handleAnalyze} disabled={loading} className="analyze-btn">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <FaSearch className="btn-icon" />
                <span>{t("analyzeButton")}</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUpload;