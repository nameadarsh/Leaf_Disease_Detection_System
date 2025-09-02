import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedCrop, setSelectedCrop] = useState('potato');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);

  const translations = {
    en: {
      title: 'LEAF HEALTH SCANNER',
      subtitle: 'AI-Powered Plant Disease Detection',
      selectCrop: 'SELECT CROP',
      captureLeafImage: 'CAPTURE LEAF IMAGE',
      takePhoto: 'TAKE PHOTO',
      upload: 'UPLOAD',
      scanLeaf: 'SCAN LEAF',
      dragDrop: 'Drag & drop an image here or click to browse',
      processing: 'Processing image...',
      healthy: 'Healthy',
      diseased: 'Diseased',
      confidence: 'Confidence',
      originalImage: 'Original Image',
      processedImage: 'Processed Image',
      preventiveGuidelines: 'Preventive Guidelines',
      askQuestion: 'Ask a question about plant care...',
      send: 'Send',
      clearImage: 'Clear Image',
      startCamera: 'Start Camera',
      stopCamera: 'Stop Camera',
      crops: {
        potato: 'Potato',
        tomato: 'Tomato',
        corn: 'Corn',
        rice: 'Rice',
        wheat: 'Wheat'
      }
    },
    hi: {
      title: 'पत्ती स्वास्थ्य स्कैनर',
      subtitle: 'AI-संचालित पौधे रोग पहचान',
      selectCrop: 'फसल चुनें',
      captureLeafImage: 'पत्ती की तस्वीर लें',
      takePhoto: 'फोटो लें',
      upload: 'अपलोड करें',
      scanLeaf: 'पत्ती स्कैन करें',
      dragDrop: 'यहाँ एक छवि खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
      processing: 'छवि प्रसंस्करण...',
      healthy: 'स्वस्थ',
      diseased: 'रोगग्रस्त',
      confidence: 'विश्वास',
      originalImage: 'मूल छवि',
      processedImage: 'प्रसंस्कृत छवि',
      preventiveGuidelines: 'निवारक दिशानिर्देश',
      askQuestion: 'पौधे की देखभाल के बारे में प्रश्न पूछें...',
      send: 'भेजें',
      clearImage: 'छवि साफ़ करें',
      startCamera: 'कैमरा शुरू करें',
      stopCamera: 'कैमरा बंद करें',
      crops: {
        potato: 'आलू',
        tomato: 'टमाटर',
        corn: 'मक्का',
        rice: 'चावल',
        wheat: 'गेहूं'
      }
    }
  };

  const t = translations[language];

  const handleImageUpload = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please select a valid image file.');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        handleImageUpload(file);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert the image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Send the base64 image to the backend
          const response = await axios.post('http://127.0.0.1:5000/predict', {
            image: reader.result,
            lang: language
          });

          setResult(response.data);
        } catch (err) {
          console.error('Error analyzing image:', err);
          setError('Failed to analyze image. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      console.error('Error reading image:', err);
      setError('Failed to process image. Please try again.');
      setLoading(false);
    }
  };

  // No longer need API key state as it's handled by the backend


  // Function to format bot responses for better readability
  const formatBotResponse = (text) => {
    if (!text) return text;
    
    // Convert markdown-like formatting to HTML-like formatting
    let formatted = text
      // Convert **bold** to <strong>bold</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to <em>italic</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert numbered lists
      .replace(/^(\d+\.\s.*)$/gm, '<li>$1</li>')
      // Convert bullet points
      .replace(/^[-•]\s(.*)$/gm, '<li>$1</li>')
      // Convert line breaks to proper spacing
      .replace(/\n\n/g, '\n\n')
      // Convert single line breaks to <br>
      .replace(/\n/g, '<br>');
    
    return formatted;
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    try {
      // Create conversation history for context (last 5 messages)
      const conversationHistory = chatMessages
        .slice(-5)
        .map(msg => msg.content)
        .filter(content => content.length > 0);

      // Send request with conversation context
      const requestData = {
        message: chatInput,
        crop_type: selectedCrop,
        language: language,
        conversation_history: conversationHistory
      };

      const response = await axios.post('http://127.0.0.1:5000/chat', requestData);

      const botMessage = { 
        type: 'bot', 
        content: response.data.response,
        formattedContent: formatBotResponse(response.data.response)
      };
      setChatMessages(prev => [...prev, botMessage]);
      
      // Auto-scroll to the bottom of chat messages
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Error sending chat message:', err);
      const errorMessage = { type: 'bot', content: 'Sorry, I could not process your message. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
      setChatInput('');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="App">
      {/* Language Toggle */}
      <div className="language-toggle">
        <div className="switch-container">
          <span className={`switch-label ${language === 'en' ? 'active' : ''}`}>EN</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={language === 'hi'}
              onChange={toggleLanguage}
            />
            <span className="slider round"></span>
          </label>
          <span className={`switch-label ${language === 'hi' ? 'active' : ''}`}>हिं</span>
        </div>
      </div>

      {/* Header */}
      <div className="app-header">
        <h1 className="app-title">{t.title}</h1>
        <p className="app-subtitle">{t.subtitle}</p>
      </div>

      <div className="container">
        {/* Main Analysis Card */}
        <div className="card">
          <h2 className="card-title">{t.captureLeafImage}</h2>
          
          {/* Crop Selection */}
          <div className="crop-selection">
            <label className="crop-label">{t.selectCrop}</label>
            <select 
              className="crop-select" 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {Object.entries(t.crops).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          {/* Camera Section */}
          {showCamera && (
            <div className="camera-section">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="camera-video"
                style={{ width: '100%', maxHeight: '300px', borderRadius: '10px' }}
              />
              <div className="camera-controls" style={{ marginTop: '15px', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={capturePhoto}>
                  📸 {t.takePhoto}
                </button>
                <button className="btn btn-secondary" onClick={stopCamera}>
                  ❌ {t.stopCamera}
                </button>
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          {!showCamera && (
            <div className="image-upload-section">
              <div 
                className="upload-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">📁</div>
                <div className="upload-text">{t.dragDrop}</div>
                <div className="flex gap-10" style={{ justifyContent: 'center', marginTop: '15px' }}>
                  <button className="btn btn-primary">
                    📁 {t.upload}
                  </button>
                  <button className="btn btn-secondary" onClick={startCamera}>
                    📷 {t.startCamera}
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview" style={{ position: 'relative' }}>
              <img src={imagePreview} alt="Preview" className="preview-image" />
              <button className="clear-btn" onClick={clearImage} title={t.clearImage}>
                ✕
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Scan Button */}
          <button 
            className="btn btn-primary btn-large" 
            onClick={analyzeImage}
            disabled={!selectedImage || loading}
          >
            {loading ? (
              <div className="loading-text">
                <div className="loading-spinner"></div>
                {t.processing}
              </div>
            ) : (
              `🔍 ${t.scanLeaf}`
            )}
          </button>
        </div>

        {/* Chatbot Section - Always Visible */}
        <div className="card">
          <div className="chatbot-container">
            <h3 className="card-title">🤖 AI Assistant</h3>
            
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="chat-welcome-message">
                  <div className="welcome-icon">👋</div>
                  <div className="welcome-text">
                    <h4>Welcome to Plant Care Assistant!</h4>
                    <p>Ask me anything about plant care, diseases, or growing tips for your {selectedCrop || 'plants'}.</p>
                    <div className="suggested-questions">
                      <button onClick={() => {
                        setChatInput(`How do I care for ${selectedCrop || 'plants'}?`);
                        setTimeout(sendChatMessage, 100);
                      }}>How do I care for {selectedCrop || 'plants'}?</button>
                      <button onClick={() => {
                        setChatInput(`What diseases affect ${selectedCrop || 'plants'}?`);
                        setTimeout(sendChatMessage, 100);
                      }}>What diseases affect {selectedCrop || 'plants'}?</button>
                      <button onClick={() => {
                        setChatInput(`How to grow ${selectedCrop || 'plants'} from seeds?`);
                        setTimeout(sendChatMessage, 100);
                      }}>How to grow {selectedCrop || 'plants'} from seeds?</button>
                      <button onClick={() => {
                        setChatInput(`What are the best soil conditions for ${selectedCrop || 'plants'}?`);
                        setTimeout(sendChatMessage, 100);
                      }}>Best soil conditions for {selectedCrop || 'plants'}</button>
                      <button onClick={() => {
                        setChatInput(`How often should I water ${selectedCrop || 'plants'}?`);
                        setTimeout(sendChatMessage, 100);
                      }}>Watering schedule for {selectedCrop || 'plants'}</button>
                      <button onClick={() => {
                        setChatInput(`What fertilizers work best for ${selectedCrop || 'plants'}?`);
                        setTimeout(sendChatMessage, 100);
                      }}>Fertilizer recommendations for {selectedCrop || 'plants'}</button>
                    </div>
                  </div>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`chat-message ${message.type}`}>
                    <div className={`message-avatar ${message.type}`}>
                      {message.type === 'user' ? '👤' : '🤖'}
                    </div>
                    <div 
                      className="message-content"
                      dangerouslySetInnerHTML={{
                        __html: message.formattedContent || message.content
                      }}
                    />
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="chat-message bot">
                  <div className="message-avatar bot">🤖</div>
                  <div className="message-content">
                    <div className="loading-spinner"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder={t.askQuestion}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              />
              <button 
                className="chat-send-btn" 
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                title="Send message"
              >
                📤
              </button>
              <button 
                className="chat-clear-btn" 
                onClick={() => setChatMessages([])} 
                title="Clear chat"
                disabled={chatMessages.length === 0 || chatLoading}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Results Section - Appears Below Chatbot */}
        {result && (
          <div className="card">
            <div className="result-card">
              <div className="result-header">
                <div className={`result-icon ${result.is_healthy ? 'healthy' : 'diseased'}`}>
                  {result.is_healthy ? '✅' : '⚠️'}
                </div>
                <div className={`result-title ${result.is_healthy ? 'healthy' : 'diseased'}`}>
                  {result.disease_name}
                </div>
              </div>

              {/* Result Images */}
              {result.processed_image && (
                <div className="result-images">
                  {imagePreview && (
                    <div className="result-image-container">
                      <div className="result-image-label">{t.originalImage}</div>
                      <img 
                        src={imagePreview} 
                        alt="Original" 
                        className="result-image" 
                      />
                    </div>
                  )}
                  <div className="result-image-container">
                    <div className="result-image-label">{t.processedImage}</div>
                    <img 
                      src={result.processed_image} 
                      alt="Processed" 
                      className="result-image" 
                    />
                  </div>
                </div>
              )}

              {/* Precautions */}
              {result.precautions && (
                <div className="precautions">
                  <h3 className="precautions-title">
                    💡 {t.preventiveGuidelines}
                  </h3>
                  <ul className="precautions-list">
                    {Array.isArray(result.precautions) 
                      ? result.precautions.map((precaution, index) => (
                          <li key={index}>{precaution}</li>
                        ))
                      : <li>{result.precautions}</li>
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;