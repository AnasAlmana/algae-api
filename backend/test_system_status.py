from system_status import predict_system_status
import json
from pprint import pprint

def test_normal_sample():
    # Normal operating conditions sample
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

    print("Testing system status prediction with normal sample data...")
    print("\nInput data:")
    pprint(normal_sample)
    
    # Get predictions
    results = predict_system_status(normal_sample)
    
    print("\nPrediction results:")
    print("-" * 50)
    print(f"Sensor faults detected: {len(results['sensor_faults'])}")
    if results['sensor_faults']:
        print("\nFaulty sensors:")
        for sensor in results['sensor_faults']:
            print(f"- {sensor}")
            print("  Explanations:")
            for feature, importance in results['sensor_explanations'][sensor].items():
                print(f"    {feature}: {importance:.4f}")
    else:
        print("No sensor faults detected")
    
    print(f"\nRow-level anomaly detected: {'Yes' if results['row_anomaly'] else 'No'}")
    print(f"Anomaly score: {results['row_score']:.4f}")
    print("\nTop contributing features to row-level anomaly:")
    for feature, importance in results['row_top_features'].items():
        print(f"- {feature}: {importance:.4f}")

if __name__ == "__main__":
    test_normal_sample() 