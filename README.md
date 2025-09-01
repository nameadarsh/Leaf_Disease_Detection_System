# Potato Leaf Disease Classifier

This is a combined model that uses U2Net for background removal and ResNet for disease classification of potato leaves.

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Place your potato leaf images in the `check` folder (supports JPG and PNG formats)

3. Run the model:
   ```
   python combined_model.py
   ```

## How it works

1. The model first removes the background from each image using U2Net
2. Then it classifies the leaf condition using ResNet
3. Processed images (with backgrounds removed) are saved in the `results` folder
4. Classification results are displayed in the terminal

## Classification Results

The model can classify potato leaves into three categories:
- _healthy: Healthy potato leaves
- _Early_blight: Leaves with early blight disease
- _Late_blight: Leaves with late blight disease

## Folder Structure

- `check/`: Place your leaf images here
- `results/`: Processed images are saved here
- `models/`: Contains the trained ResNet model
- `U-2-Net/`: Contains the U2Net model for background removal
- `combined_model.py`: The main script that combines both models 