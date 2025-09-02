#!/usr/bin/env python3
"""
Test script for the chatbot functionality
"""
import os
import sys
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

def test_chatbot():
    """Test the chatbot endpoint"""
    
    # Check if API key is loaded
    api_key = os.getenv("CHATBOT_API_KEY")
    if not api_key:
        print("❌ Error: CHATBOT_API_KEY not found in environment variables")
        print("Please make sure your .env file contains: CHATBOT_API_KEY=your_api_key_here")
        return False
    
    print(f"✅ API Key loaded: {api_key[:10]}...")
    
    # Test data
    test_data = {
        "message": "How do I care for tomato plants?",
        "crop_type": "tomato",
        "language": "en",
        "conversation_history": []
    }
    
    try:
        # Make request to the chatbot endpoint
        print("🔄 Testing chatbot endpoint...")
        response = requests.post(
            "http://127.0.0.1:5000/chat",
            json=test_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Chatbot response received successfully!")
            print(f"📝 Response: {result.get('response', 'No response')[:200]}...")
            return True
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the server")
        print("Make sure the Flask server is running on http://127.0.0.1:5000")
        return False
    except requests.exceptions.Timeout:
        print("❌ Error: Request timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get("http://127.0.0.1:5000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health endpoint is working")
            return True
        else:
            print(f"❌ Health endpoint error: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Leaf Disease Detection Chatbot")
    print("=" * 50)
    
    # Test health endpoint first
    if not test_health_endpoint():
        print("\n❌ Server is not running. Please start the Flask server first:")
        print("   cd backend && python app.py")
        sys.exit(1)
    
    print()
    
    # Test chatbot
    if test_chatbot():
        print("\n🎉 All tests passed! The chatbot is working correctly.")
    else:
        print("\n💥 Tests failed. Please check the configuration and try again.")
        sys.exit(1)
