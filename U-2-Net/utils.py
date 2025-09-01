import os
import numpy as np
import torch
from PIL import Image
from pathlib import Path
import time

def normPRED(d):
    ma = torch.max(d)
    mi = torch.min(d)
    dn = (d - mi) / (ma - mi)
    return dn

def save_output(image_path, predict_tensor, output_root):
    # Move tensor to CPU, detach from graph, convert to NumPy
    predict_np = predict_tensor.cpu().detach().numpy()

    # Remove batch and channel dimensions if necessary
    predict_np = np.squeeze(predict_np)

    # Debug the shape
    print(f"Saving image with shape: {predict_np.shape}")

    # Scale prediction to [0,255]
    predict_np = (predict_np * 255).astype(np.uint8)

    # Ensure the array is 2D (grayscale image)
    im = Image.fromarray(predict_np)

    # Ensure output directory exists
    d_dir = Path(output_root).resolve()
    d_dir.mkdir(parents=True, exist_ok=True)

    # Create a unique filename to avoid conflicts
    base_name = os.path.basename(image_path)
    name, ext = os.path.splitext(base_name)
    unique_name = f"{name}_{int(time.time())}{ext}"
    save_path = d_dir / unique_name

    print(f"Saving to {save_path}")
    im.save(str(save_path))
