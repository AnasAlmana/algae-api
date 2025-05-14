# Algae Monitoring System API

A FastAPI-based RESTful API for algae cultivation monitoring and anomaly detection.

## Features

- **Sensor Fault Detection**: Identifies faulty sensors in the system
- **Anomaly Detection**: Detects unusual patterns in the monitoring data
- **Explanations**: Provides SHAP-based explanations for detected issues
- **REST API**: Easy integration with monitoring dashboards and systems

## Project Structure

```
.
├── app/                  # Main application package
│   ├── api/              # API endpoints and routes
│   ├── core/             # Core functionality and settings
│   ├── ml/               # Machine learning models and prediction
│   └── schemas/          # Pydantic models/schemas
├── models/               # Serialized ML models
├── tests/                # Test suite
├── main.py               # Application entry point
├── requirements.txt      # Project dependencies
└── README.md             # Project documentation
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/algae-api.git
   cd algae-api
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # Linux/Mac
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy your trained models to the `app/ml/models` directory.

## Usage

### Starting the API Server

```
python main.py
```

The API will be available at http://localhost:8000.

API documentation will be available at:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

### API Endpoints

- `GET /api/v1/health` - Health check endpoint
- `POST /api/v1/predict` - Predict system status from sensor data

### Example Request

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/predict' \
  -H 'Content-Type: application/json' \
  -d '{
    "algae_type": "Chlorella",
    "temperature_C": 28.0,
    "humidity_%": 65.0,
    "pH": 7.2,
    "light_intensity_umol_m2_s": 1200.0,
    "light_intensity_lux": 18000.0,
    "water_level_cm": 48.0,
    "dissolved_oxygen_mg_per_L": 8.0,
    "conductivity_uS_cm": 600.0,
    "turbidity_NTU": 2.5,
    "chlorophyll_a_ug_per_L": 38.0,
    "CO2_flow_rate_mL_per_min": 95.0,
    "aeration_rate_L_per_min": 2.1,
    "optical_density_680nm": 0.9,
    "photosynthetic_efficiency_pct": 28.0,
    "biomass_concentration_g_per_L": 4.0,
    "nitrate_mg_per_L": 4.5,
    "phosphate_mg_per_L": 0.9,
    "ammonium_mg_per_L": 1.0
}'
```

## Testing

Run tests with pytest:

```
pytest
```

## License

[MIT License](LICENSE)