import os
import sys
import torch
import numpy as np
from PIL import Image
import traceback

# Import directly from the local combined_model.py file
from combined_model import load_models, remove_background, classify_image

class ModelWrapper:
    def __init__(self):
        # Load both models using the function from combined_model
        try:
            self.u2net, self.resnet = load_models()
            print("Models loaded successfully!")
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            print(traceback.format_exc())
            raise

    def process_and_predict(self, image):
        """Process image with U2NET and predict disease with ResNet"""      
        try:
            # Process image with U2NET (background removal)
            processed_img = remove_background(image, self.u2net)

            # Get prediction from ResNet model
            prediction = classify_image(processed_img, self.resnet)

            return prediction, processed_img
        except Exception as e:
            print(f"Error in process_and_predict: {str(e)}")
            print(traceback.format_exc())
            raise
