#!/usr/bin/env python
"""
Script to copy ML models from the original location to the new project structure.
"""

import os
import shutil
import sys
from pathlib import Path

def setup_models():
    # Get the project root directory
    script_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    project_root = script_dir.parent
    
    # Define source and destination directories
    source_dir = project_root / "models"
    dest_dir = project_root / "backend" / "app" / "ml" / "models"
    
    # Create destination directory if it doesn't exist
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        print(f"Created directory: {dest_dir}")
    
    # Check if source directory exists
    if not os.path.exists(source_dir):
        print(f"Error: Source directory '{source_dir}' not found.")
        print("Please make sure the ML models are located in the 'models' directory.")
        return 1
    
    # Copy all model files
    model_files = [
        "sensor_fault_model_v2.pkl",
        "sensor_feature_columns_v2.pkl",
        "sensor_target_columns_v2.pkl",
        "row_anomaly_model.pkl",
        "row_anomaly_scaler.pkl",
        "row_feature_columns.pkl",
        "row_feature_medians.pkl"
    ]
    
    copied_files = 0
    for model_file in model_files:
        source_file = source_dir / model_file
        dest_file = dest_dir / model_file
        
        if os.path.exists(source_file):
            shutil.copy2(source_file, dest_file)
            print(f"Copied: {model_file}")
            copied_files += 1
        else:
            print(f"Warning: Model file '{model_file}' not found in source directory.")
    
    if copied_files == 0:
        print("No model files were copied.")
        return 1
    
    print(f"\nSuccessfully copied {copied_files} model files to {dest_dir}")
    return 0

if __name__ == "__main__":
    sys.exit(setup_models()) 