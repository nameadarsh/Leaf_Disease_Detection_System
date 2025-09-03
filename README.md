# Leaf Disease Detection Web Application

A full-stack web application for detecting diseases in plant leaves using image processing and machine learning.

## Features

- Image upload and camera capture functionality
- Server-side model inference for plant leaf disease detection
- Frontend display of predictions and precautions
- Bilingual support (English and Hindi)
- AI chatbot integration with context-aware conversations
- Crop-specific advice and recommendations
- Conversation history for better context understanding

## Project Structure

```
leaf_app_v4/
├── backend/
│   ├── app.py                # Flask application
│   ├── model_wrapper.py      # Model integration
│   ├── combined_model.py     # Combined model implementation
│   ├── requirements.txt      # Python dependencies
│   ├── U-2-Net/              # U2NET model directory
│   │   └── saved_models/
│   │       └── u2net.pth     # U2NET model weights
│   ├── models/
│   │   └── best_model.pth    # ResNet model weights
│   └── languages/            # Language files
│       ├── en.json           # English translations
│       └── hi.json           # Hindi translations
├── frontend/
│   ├── public/               # Static files
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── assets/           # Images and other assets
│   │   ├── App.js            # Main React component
│   │   └── index.js          # React entry point
└── README.md                 # This file
```

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.7+** with pip installed
- **Node.js 14+** and npm installed
- **API Key** for chatbot functionality (Groq or OpenAI)

### 📋 Step-by-Step Setup Instructions

#### **Step 1: Verify Prerequisites**
```bash
# Check Python version
python --version

# Check Node.js version
node --version
npm --version
```

#### **Step 2: Backend Setup**

1. **Open Terminal/Command Prompt** and navigate to the backend directory:
   ```bash
   cd "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\backend"
   ```

2. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify API Key Configuration:**
   - The `.env` file should be in the backend folder
   - Supported API providers:
     - **Groq API**: Keys starting with `gsk_` or `gsk-` ✅ (Current key)
     - **OpenAI API**: Keys starting with `sk-`

4. **Start the Backend Server:**
   ```bash
   python app.py
   ```
   
   **Expected Output:**
   ```
   * Running on http://127.0.0.1:5000
   * Debugger is active!
   ```

5. **Test Backend (Optional):**
   Open a **new terminal** and run:
   ```bash
   cd "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\backend"
   python test_chatbot.py
   ```

#### **Step 3: Frontend Setup**

1. **Open a NEW Terminal/Command Prompt** and navigate to the frontend directory:
   ```bash
   cd "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\frontend"
   ```

2. **Install Node.js Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Frontend Server:**
   ```bash
   npm start
   ```
   
   **Expected Output:**
   ```
   Compiled successfully!
   Local:            http://localhost:3000
   On Your Network:  http://192.168.x.x:3000
   ```

#### **Step 4: Access the Application**

1. **Open your web browser**
2. **Navigate to:** `http://localhost:3000`
3. **You should see:** The Leaf Health Scanner interface

### 🔧 Troubleshooting

#### **Backend Issues:**
- **Port 5000 in use:** Kill existing processes or change port
- **API Key error:** Verify `.env` file contains correct API key
- **Dependencies missing:** Run `pip install -r requirements.txt`

#### **Frontend Issues:**
- **Port 3000 in use:** The app will automatically use port 3001
- **Dependencies missing:** Run `npm install`
- **Build errors:** Clear cache with `npm start -- --reset-cache`

#### **Both Servers Must Be Running:**
- **Backend:** `http://localhost:5000` (Flask API)
- **Frontend:** `http://localhost:3000` (React App)

### 🎯 Application Features

- **Image Upload & Camera Capture:** Upload or take photos of plant leaves
- **AI Disease Detection:** Automatic analysis using machine learning models
- **Smart Chatbot:** Context-aware agricultural assistant with your API key
- **Bilingual Support:** English and Hindi language options
- **Responsive Design:** Works on desktop, tablet, and mobile devices

## 🎮 How to Run the Complete Application

### **Method 1: Manual Start (Recommended for Development)**

1. **Start Backend Server:**
   ```bash
   # Terminal 1 - Backend
   cd "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\backend"
   python app.py
   ```

2. **Start Frontend Server:**
   ```bash
   # Terminal 2 - Frontend (Open NEW terminal)
   cd "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\frontend"
   npm start
   ```

3. **Access Application:**
   - Open browser: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### **Method 2: Quick Start Scripts (Windows)**

Create these batch files for easy startup:

**start_backend.bat:**
```batch
@echo off
cd /d "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\backend"
python app.py
pause
```

**start_frontend.bat:**
```batch
@echo off
cd /d "C:\Users\abjpr\Desktop\Leaf disease detection system\leaf_disease_lite\leaf_app_v4\frontend"
npm start
pause
```

## 📱 How to Use the Application

### **Step 1: Access the Interface**
1. Open your browser and go to `http://localhost:3000`
2. You'll see the "LEAF HEALTH SCANNER" interface

### **Step 2: Select Crop Type**
1. Choose your crop from the dropdown (Potato, Tomato, Corn, Rice, Wheat)
2. This helps the AI provide crop-specific advice

### **Step 3: Upload or Capture Image**
1. **Upload:** Click "UPLOAD" and select an image file
2. **Camera:** Click "Start Camera" to take a photo
3. **Drag & Drop:** Drag an image file directly onto the upload area

### **Step 4: Analyze the Image**
1. Click "SCAN LEAF" to process the image
2. Wait for the AI analysis to complete
3. View the results showing:
   - Disease detection results
   - Original and processed images
   - Recommended precautions

### **Step 5: Use the AI Chatbot**
1. The chatbot appears when no image is being analyzed
2. Ask questions about:
   - Plant care and maintenance
   - Disease identification and treatment
   - Growing tips and best practices
   - Soil health and nutrition
3. The chatbot provides context-aware responses based on:
   - Your selected crop type
   - Previous conversation history
   - Specific agricultural expertise

### **Step 6: Language Options**
- Use the language toggle (EN/हिं) to switch between English and Hindi
- All interface elements and chatbot responses will change language

## Chatbot Features

The AI chatbot provides comprehensive agricultural assistance with the following features:

### Context-Aware Responses
- **Crop-Specific Advice**: Tailored recommendations based on your selected crop type
- **Conversation History**: Maintains context from previous messages for better continuity
- **Agricultural Expertise**: Specialized knowledge in plant diseases, pest management, and farming practices

### Supported Topics
- Plant care and maintenance
- Disease identification and treatment
- Pest management strategies
- Soil health and nutrition
- Water management and irrigation
- Seasonal care requirements
- Organic and sustainable farming practices

### API Integration
- Supports multiple AI providers (Groq, OpenAI)
- Automatic API key detection and configuration
- Error handling and fallback responses

## ⚠️ Important Notes

### **System Requirements:**
- **Python 3.7+** with pip package manager
- **Node.js 14+** with npm package manager
- **4GB+ RAM** recommended for smooth operation
- **Stable internet connection** for chatbot API calls

### **API Key Information:**
- Your current API key is configured for **Groq API**
- The key is stored in `backend/.env` file
- **Never share your API key** publicly
- If you need to change the API key, edit the `.env` file

### **Development vs Production:**
- This application is designed for **local development and testing**
- For production deployment, use proper WSGI servers (Gunicorn, uWSGI)
- The model uses U-2-Net for background removal and ResNet for disease classification
- The chatbot provides real-time AI-powered agricultural assistance

### **File Structure Requirements:**
- **Do not move or rename** the model files in `backend/models/` and `backend/U-2-Net/`
- The application depends on this specific file structure
- All necessary model files are included in the package

### **Performance Tips:**
- **First startup** may take longer due to model loading
- **Image processing** time depends on image size and complexity
- **Chatbot responses** depend on API response time (usually 1-3 seconds)
- **Close unused browser tabs** to free up memory for better performance

## Deployment Notes

### Self-Contained Package

This application is designed to be completely self-contained. All necessary model files are included in the `backend` directory:

- `combined_model.py` - Contains the model integration code
- `U-2-Net` folder - Contains the U2NET model and its dependencies
- `models` folder - Contains the ResNet model weights

### File Structure Requirements

To ensure the application works correctly, maintain this file structure:

```
leaf_app_v4/
├── backend/
│   ├── combined_model.py
│   ├── model_wrapper.py
│   ├── app.py
│   ├── U-2-Net/
│   │   └── saved_models/
│   │       └── u2net.pth
│   └── models/
│       └── best_model.pth
└── frontend/
    └── ...
```

Do not move or rename these files as the application depends on this specific structure.
