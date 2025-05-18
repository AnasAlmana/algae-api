import time
import requests
import json
import pandas as pd
from datetime import datetime
import os
import argparse

# API endpoints
API_URL = "http://localhost:8000/api/v1/predict"
HEALTH_URL = "http://localhost:8000/api/v1/health"
LATEST_URL = "http://localhost:8000/api/v1/latest-prediction"

# CSV data file path
CSV_FILE = "Algae_Anomaly_Test_Data.csv"

def check_api_health():
    """Check if the API is up and running"""
    try:
        response = requests.get(HEALTH_URL)
        return response.status_code == 200
    except Exception:
        return False

def verify_latest_data():
    """Verify if the latest-prediction endpoint is returning data"""
    try:
        response = requests.get(LATEST_URL)
        return response.status_code == 200
    except Exception:
        return False

def send_to_api(sensor_data):
    """Send sensor data to the API"""
    try:
        headers = {"Content-Type": "application/json"}
        response = requests.post(API_URL, json=sensor_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"API Response: Status 200 OK")
            print(f"Anomaly detected: {result.get('row_anomaly', False)}")
            print(f"Anomaly score: {result.get('row_score', 0)}")
            
            if result.get('sensor_faults'):
                print(f"Sensor faults: {', '.join(result.get('sensor_faults', []))}")
            
            return True
        else:
            print(f"API Error: Status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"Error sending data to API: {str(e)}")
        return False

def load_csv_data():
    """Load test data from CSV file"""
    if not os.path.exists(CSV_FILE):
        raise FileNotFoundError(f"CSV file not found: {CSV_FILE}")
    
    print(f"Loading test data from {CSV_FILE}...")
    df = pd.read_csv(CSV_FILE)
    print(f"Loaded {len(df)} rows of test data")
    return df

def row_to_dict(row):
    """Convert DataFrame row to dictionary, handling NaN values"""
    row_dict = row.to_dict()
    for key, value in row_dict.items():
        if pd.isna(value):
            row_dict[key] = None
    return row_dict

def main(selected_row=None):
    """Main function to run the simulation"""
    print("Starting sensor simulation from CSV file...")
    print(f"Sending data to {API_URL}")
    print("-" * 50)
    
    if not check_api_health():
        print("ERROR: API is not running or health check failed.")
        return
    
    if verify_latest_data():
        print("Latest-prediction endpoint verified!")
    else:
        print("WARNING: latest-prediction endpoint not available or empty.")
    
    try:
        test_data = load_csv_data()
    except Exception as e:
        print(f"Failed to load CSV file: {str(e)}")
        return

    total_rows = len(test_data)

    if selected_row is not None:
        if selected_row < 0 or selected_row >= total_rows:
            print(f"Invalid row index: {selected_row}. Must be between 0 and {total_rows - 1}.")
            return
        row_indices = [selected_row]
    else:
        row_indices = list(range(total_rows))

    for row_index in row_indices:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"\n[{timestamp}] Sending row {row_index + 1} of {total_rows}")
        
        sensor_data = row_to_dict(test_data.iloc[row_index])
        
        print("Sample data:")
        for key in ['temperature_C', 'pH', 'dissolved_oxygen_mg_per_L']:
            if key in sensor_data:
                print(f"  {key}: {sensor_data[key]}")
        
        print("\nSending to API...")
        success = send_to_api(sensor_data)
        
        if success:
            print("Data sent successfully!")
        else:
            print("Failed to send data.")
        
        if selected_row is not None:
            break  # only send one row if specified

        print("-" * 50)
        time.sleep(5)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Send sensor data from CSV to anomaly detection API")
    parser.add_argument('--row', type=int, help="Row index to send (0-based)")
    args = parser.parse_args()

    try:
        main(selected_row=args.row)
    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
    except Exception as e:
        print(f"Error: {str(e)}")
