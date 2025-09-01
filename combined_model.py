import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from pathlib import Path
import sys

# Add the U-2-Net directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'U-2-Net'))
from model.u2net import U2NET
from torchvision import models
import cv2
from tqdm import tqdm

def load_models():
    """Load both U2Net and ResNet models"""
    # Load U2Net
    u2net = U2NET(3, 1)
    u2net.load_state_dict(torch.load("U-2-Net/saved_models/u2net.pth", map_location='cpu'))
    u2net.eval()
    
    # Load ResNet
    resnet = models.resnet18(weights=None)
    num_ftrs = resnet.fc.in_features
    resnet.fc = nn.Linear(num_ftrs, 3)  # 3 classes
    resnet.load_state_dict(torch.load("models/best_model.pth", map_location='cpu'))
    resnet.eval()
    
    return u2net, resnet

def preprocess_image(image_path, target_size=320):
    """Preprocess image for U2Net"""
    image = Image.open(image_path).convert('RGB')
    image = image.resize((target_size, target_size), Image.Resampling.LANCZOS)
    image = np.array(image)
    image = image / 255.0
    image = image.transpose((2, 0, 1))
    image = torch.from_numpy(image).float()
    image = image.unsqueeze(0)
    return image

def postprocess_mask(mask, threshold=0.7):
    """Convert mask to binary using threshold"""
    mask = mask.squeeze().numpy()
    mask = (mask > threshold).astype(np.uint8) * 255
    return mask

def refine_mask(mask):
    """Refine the mask using morphological operations"""
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)  # Remove small noise
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)  # Fill small holes
    return mask

def remove_background(image_path, u2net):
    """Remove background from image using U2Net"""
    # Preprocess image
    image = preprocess_image(image_path)
    
    # Get mask from U2Net
    with torch.no_grad():
        d1 = u2net(image)[0]
    
    # Postprocess mask
    mask = postprocess_mask(d1)
    mask = refine_mask(mask)
    
    # Load original image
    original = cv2.imread(str(image_path))
    original = cv2.cvtColor(original, cv2.COLOR_BGR2RGB)
    original = cv2.resize(original, (320, 320))
    
    # Apply mask
    mask = cv2.resize(mask, (320, 320))
    mask = mask / 255.0
    mask = np.expand_dims(mask, axis=-1)
    
    # Create transparent background
    result = original * mask
    result = result.astype(np.uint8)
    
    return Image.fromarray(result)

def classify_image(image, resnet):
    """Classify the image using ResNet"""
    # Transform image for ResNet
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    image_tensor = transform(image).unsqueeze(0)
    
    # Get prediction
    with torch.no_grad():
        outputs = resnet(image_tensor)
        _, predicted = torch.max(outputs, 1)
    
    class_names = ['_Early_blight', '_healthy', '_Late_blight']
    return class_names[predicted.item()]

def process_folder(folder_path):
    """Process all images in a folder"""
    # Load models
    print("Loading models...")
    u2net, resnet = load_models()
    
    # Create output directory
    output_dir = Path("results")
    output_dir.mkdir(exist_ok=True)
    
    # Process each image
    image_files = list(Path(folder_path).glob("*.jpg")) + list(Path(folder_path).glob("*.png"))
    results = []
    
    print(f"\nProcessing {len(image_files)} images...")
    for image_path in tqdm(image_files):
        try:
            print(f"\nProcessing image: {image_path.name}")
            # Remove background
            print("Removing background...")
            processed_image = remove_background(image_path, u2net)
            
            # Classify image
            print("Classifying image...")
            prediction = classify_image(processed_image, resnet)
            
            # Save processed image
            output_path = output_dir / f"processed_{image_path.name}"
            processed_image.save(output_path)
            print(f"Saved processed image to: {output_path}")
            
            results.append({
                'image': image_path.name,
                'prediction': prediction,
                'processed_path': str(output_path)
            })
            
        except Exception as e:
            print(f"Error processing {image_path.name}:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            import traceback
            print("Full traceback:")
            print(traceback.format_exc())
    
    return results

def main():
    # Process images in check folder
    check_folder = Path("check")
    if not check_folder.exists():
        print("Creating 'check' folder...")
        check_folder.mkdir(exist_ok=True)
        print("Please place your leaf images in the 'check' folder and run this script again.")
        return
    
    results = process_folder(check_folder)
    
    # Print results
    print("\nResults:")
    print("-" * 50)
    for result in results:
        print(f"Image: {result['image']}")
        print(f"Prediction: {result['prediction']}")
        print(f"Processed image saved as: {result['processed_path']}")
        print("-" * 50)

if __name__ == "__main__":
    main() 