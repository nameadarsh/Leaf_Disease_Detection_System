# Model Files Setup Instructions

To make the application self-contained, you need to copy the following files from the "ready model" directory to your leaf_app_v4 backend directory:

## 1. Copy U-2-Net folder

```powershell
# Create the U-2-Net directory structure in backend
New-Item -Path "backend/U-2-Net/model" -ItemType Directory -Force
New-Item -Path "backend/U-2-Net/saved_models" -ItemType Directory -Force

# Copy U-2-Net model files
Copy-Item -Path "../../../ready model/U-2-Net/model/__init__.py" -Destination "backend/U-2-Net/model/" -Force
Copy-Item -Path "../../../ready model/U-2-Net/model/u2net.py" -Destination "backend/U-2-Net/model/" -Force
Copy-Item -Path "../../../ready model/U-2-Net/model/u2net_refactor.py" -Destination "backend/U-2-Net/model/" -Force
Copy-Item -Path "../../../ready model/U-2-Net/saved_models/u2net.pth" -Destination "backend/U-2-Net/saved_models/" -Force
```

## 2. Copy models folder

```powershell
# Create the models directory
New-Item -Path "backend/models" -ItemType Directory -Force

# Copy ResNet model file
Copy-Item -Path "../../../ready model/models/best_model.pth" -Destination "backend/models/" -Force
```

## 3. Verify File Structure

After copying, your backend directory should have this structure:

```
backend/
├── app.py
├── model_wrapper.py
├── combined_model.py
├── requirements.txt
├── languages/
│   ├── en.json
│   └── hi.json
├── U-2-Net/
│   ├── model/
│   │   ├── __init__.py
│   │   ├── u2net.py
│   │   └── u2net_refactor.py
│   └── saved_models/
│       └── u2net.pth
└── models/
    └── best_model.pth
```

This setup ensures that the application can run independently without requiring access to the parent directory.
