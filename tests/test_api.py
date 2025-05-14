import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test that the health endpoint returns a 200 status code."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_prediction_endpoint():
    """Test the prediction endpoint with a normal sample."""
    normal_sample = {
        'algae_type': 'Chlorella',
        'temperature_C': 28.0,
        'humidity_%': 65.0,
        'pH': 7.2,
        'light_intensity_umol_m2_s': 1200.0,
        'light_intensity_lux': 18000.0,
        'water_level_cm': 48.0,
        'dissolved_oxygen_mg_per_L': 8.0,
        'conductivity_uS_cm': 600.0,
        'turbidity_NTU': 2.5,
        'chlorophyll_a_ug_per_L': 38.0,
        'CO2_flow_rate_mL_per_min': 95.0,
        'aeration_rate_L_per_min': 2.1,
        'optical_density_680nm': 0.9,
        'photosynthetic_efficiency_pct': 28.0,
        'biomass_concentration_g_per_L': 4.0,
        'nitrate_mg_per_L': 4.5,
        'phosphate_mg_per_L': 0.9,
        'ammonium_mg_per_L': 1.0
    }
    
    response = client.post("/api/v1/predict", json=normal_sample)
    assert response.status_code == 200
    
    data = response.json()
    assert "sensor_faults" in data
    assert "row_anomaly" in data
    assert "row_score" in data
    assert "row_top_features" in data
    
    # The response should have the expected data types
    assert isinstance(data["sensor_faults"], list)
    assert isinstance(data["row_anomaly"], bool)
    assert isinstance(data["row_score"], float)
    assert isinstance(data["row_top_features"], dict) 