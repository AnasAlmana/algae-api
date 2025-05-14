import time
import requests
import json
import pandas as pd
from datetime import datetime
import os


# API endpoint
API_URL = "http://localhost:8000/api/v1/predict"
HEALTH_URL = "http://localhost:8000/api/v1/health"
LATEST_URL = "http://localhost:8000/api/v1/latest-prediction"

# CSV data file path
CSV_FILE = "normal_rows_test_data.csv"

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
    # Replace NaN values with None
    for key, value in row_dict.items():
        if pd.isna(value):
            row_dict[key] = None
    return row_dict

def main():
    """Main function to run the simulation"""
    print("Starting sensor simulation from CSV file...")
    print(f"Sending data to {API_URL} every 30 seconds")
    print("-" * 50)
    
    # Check API health first
    if not check_api_health():
        print("ERROR: API is not running or health check failed.")
        print("Please make sure the backend server is running.")
        return
    
    # Verify latest-prediction endpoint
    print("Checking latest-prediction endpoint...")
    has_latest_endpoint = verify_latest_data()
    if not has_latest_endpoint:
        print("WARNING: latest-prediction endpoint not available or no data yet.")
        print("The frontend may not be able to get the latest data.")
    else:
        print("Latest-prediction endpoint verified!")
    
    # Load test data from CSV
    try:
        test_data = load_csv_data()
    except Exception as e:
        print(f"Failed to load CSV file: {str(e)}")
        return
    
    # Track current row index
    row_index = 0
    total_rows = len(test_data)
    
    # Run the simulation, cycling through the rows
    while True:
        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"\n[{timestamp}] Sending row {row_index + 1} of {total_rows}")
        
        # Get the current row as a dictionary
        sensor_data = row_to_dict(test_data.iloc[row_index])
        
        # Print a sample of the data
        print("Sample data:")
        for key in ['temperature_C', 'pH', 'dissolved_oxygen_mg_per_L']:
            if key in sensor_data:
                print(f"  {key}: {sensor_data[key]}")
        
        # Send to API
        print("\nSending to API...")
        success = send_to_api(sensor_data)
        
        if success:
            print("\nData sent successfully!")
        else:
            print("\nFailed to send data.")
        
        # Move to the next row, cycling back to start if needed
        row_index = (row_index + 1) % total_rows
        
        print("-" * 50)
        
        # Wait for 30 seconds
        time.sleep(30)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
        print("Exiting gracefully...")
    except Exception as e:
        print(f"Error: {str(e)}")
        print("Simulation terminated due to an error.") 