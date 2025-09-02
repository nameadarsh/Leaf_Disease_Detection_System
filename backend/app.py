import os
import json
import base64
import io
import requests
from dotenv import load_dotenv
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_wrapper import ModelWrapper

# Load environment variables from the backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app)

# Initialize model
model = None

# Load language files
def load_languages():
    languages = {}
    lang_dir = os.path.join(os.path.dirname(__file__), "languages")
    
    for lang_file in os.listdir(lang_dir):
        if lang_file.endswith(".json"):
            lang_code = lang_file.split(".")[0]
            with open(os.path.join(lang_dir, lang_file), "r", encoding="utf-8") as f:
                languages[lang_code] = json.load(f)
    
    return languages

# Load languages
languages = load_languages()

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def predict():
    global model
    
    # Initialize model if not already done
    if model is None:
        try:
            model = ModelWrapper()
        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            print(f"Failed to load model: {str(e)}")
            print(error_traceback)
            return jsonify({"error": f"Failed to load model: {str(e)}"}), 500
    
    # Get request data
    data = request.json
    if not data or "image" not in data or "lang" not in data:
        return jsonify({"error": "Missing image data or language preference"}), 400
    
    # Get language preference (default to English if not found)
    lang = data.get("lang", "en")
    if lang not in languages:
        lang = "en"
    
    try:
        # Decode base64 image
        image_data = data["image"]
        if image_data.startswith("data:image"):
            # Remove data URL prefix if present
            image_data = image_data.split(",")[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Process image and get prediction
        prediction, processed_img = model.process_and_predict(image)
        
        # Convert processed image back to base64 for response
        buffered = io.BytesIO()
        processed_img.save(buffered, format="PNG")
        processed_img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Get disease information in the requested language
        disease_info = languages[lang]["diseases"].get(prediction, languages[lang]["diseases"]["healthy"])
        
        return jsonify({
            "prediction": prediction,
            "disease_name": disease_info["name"],
            "precautions": disease_info["precautions"],
            "processed_image": f"data:image/png;base64,{processed_img_b64}",
            "is_healthy": prediction == "healthy"
        })
        
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Error processing image: {str(e)}")
        print(error_traceback)
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

@app.route("/chat", methods=["POST"])
def chat():
    """Chat endpoint that handles user queries about plant care and diseases.
    
    This endpoint accepts POST requests with JSON data containing:
    - message: The user's query text
    - crop_type: (Optional) The type of crop the user is asking about
    - language: (Optional) The language code for the response
    
    It uses either OpenAI API or provides direct responses based on the API key format.
    """
    data = request.json
    if not data or "message" not in data:
        return jsonify({"error": "Missing message"}), 400
    
    # Get API key from environment variables
    api_key = os.getenv("CHATBOT_API_KEY")
    if not api_key:
        print("Warning: CHATBOT_API_KEY not found in environment variables")
        return jsonify({"error": "API key not configured on the server. Please check your .env file."}), 500
    
    print(f"Using API key: {api_key[:10]}...")  # Log first 10 characters for debugging
    
    # Get language preference and crop type if available
    lang = data.get("language", data.get("lang", "en"))  # Support both 'language' and 'lang' parameters
    crop_type = data.get("crop_type", "")
    user_message = data["message"]
    
    try:
        # Determine which API to use based on the API key format
        is_groq_api = api_key.startswith("gsk_") or api_key.startswith("gsk-")
        is_openai_api = api_key.startswith("sk-")
        
        # Create a comprehensive system message with context about the crop and language
        system_message = f"""You are a friendly and knowledgeable plant health assistant. Your role is to answer questions about plants, their diseases, growth, and care. Use simple, clear language that anyone can understand, and always provide practical, easy-to-follow advice. If you don't know something, suggest general plant care tips instead of guessing.

        You are an expert agricultural assistant specializing in plant diseases, crop management, and sustainable farming practices. You are part of a leaf disease detection system that helps farmers identify and manage plant health issues.

        Your expertise includes:
        - Detailed understanding of plant diseases, pests, and their management
        - Optimal growing conditions for various crops
        - Sustainable and organic farming techniques
        - Seasonal care requirements for plants
        - Diagnosis of plant health issues from symptoms
        - Preventive measures for common plant diseases
        - Treatment options for various plant diseases
        - Soil health and nutrition management
        - Water management and irrigation practices
        
        Guidelines for your responses:
        1. Use friendly, conversational tone that's easy to understand
        2. Provide practical, actionable advice that anyone can implement immediately
        3. Break down complex information into simple, digestible steps
        4. Use bullet points, numbered lists, and clear formatting for better readability
        5. Prioritize sustainable and environmentally friendly solutions when possible
        6. Be specific and detailed in your recommendations
        7. Consider the context of the query and tailor your response accordingly
        8. When discussing treatments, mention both organic and conventional options
        9. Include preventive measures alongside treatment recommendations
        10. Always consider the local growing conditions and climate
        11. Provide step-by-step instructions when appropriate
        12. Mention safety precautions for any chemical treatments
        13. Suggest monitoring and follow-up actions
        14. Use emojis and friendly language to make responses more engaging
        
        Remember: You are helping people who may have limited technical knowledge, so explain things clearly and avoid overly technical jargon unless necessary. Make your responses helpful, encouraging, and easy to follow."""
        
        if crop_type:
            system_message += f"\n\nIMPORTANT CONTEXT: The user is currently working with {crop_type} plants. Focus your expertise on this specific crop and its common issues, optimal growing conditions, and best practices for cultivation. Tailor all advice specifically to {crop_type} plants."
        
        # Add conversation context if available
        conversation_history = data.get("conversation_history", [])
        if conversation_history:
            system_message += f"\n\nCONVERSATION CONTEXT: The user has been discussing: {', '.join(conversation_history[-3:])}. Build upon this previous conversation context."
        
        if is_groq_api:
            # Groq API
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # Prepare the payload for the Groq API
            payload = {
                "model": "llama-3.1-8b-instant",  # Updated model name
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            }
            
            # Make the API request to Groq API
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload
            )
            
            # Check if the request was successful
            response.raise_for_status()
            
            # Extract the assistant's response
            result = response.json()
            assistant_response = result["choices"][0]["message"]["content"]
        else:
            # OpenAI API
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # Prepare the payload for the OpenAI API
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            }
            
            # Make the API request to OpenAI API
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            )
            
            # Check if the request was successful
            response.raise_for_status()
            
            # Extract the assistant's response
            result = response.json()
            assistant_response = result["choices"][0]["message"]["content"]
        
        return jsonify({"response": assistant_response})
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to get response from chatbot API: {str(e)}"}), 500
    except Exception as e:
        import traceback
        print(f"Chatbot error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Error processing chat request: {str(e)}"}), 500

@app.route("/languages", methods=["GET"])
def get_languages():
    # Return available UI translations (not the full language files)
    ui_translations = {}
    for lang_code, lang_data in languages.items():
        if "ui" in lang_data:
            ui_translations[lang_code] = lang_data["ui"]
    
    return jsonify(ui_translations)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
