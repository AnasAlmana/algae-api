# Algae Monitoring System

A full-stack application for monitoring and detecting anomalies in algae cultivation systems. The system consists of a FastAPI backend for anomaly detection and a React frontend for visualization.

## Prerequisites

- Docker and Docker Compose
- Git

## Download the models
Download the models from below URL and place it inside `backend/models`
```
https://drive.google.com/drive/folders/1KtZXuuzmEranx2OsKipNIPDKKde-yzvB?usp=sharing
```
## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/AnasAlmana/algae-api.git
cd algae-api
```

2. Set up environment variables:
```bash
# For backend
cd backend
cp .env.example .env
cd ..
```

3. Start the application:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000/api/v1
- API Documentation: http://localhost:8000/api/v1/docs

## Project Structure

```
algae-api/
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── models/       # ML models
│   └── data/         # Data files
├── frontend/         # React frontend
│   ├── src/         # Source code
│   └── public/      # Static files
└── docker-compose.yml
```

## Features

- Real-time anomaly detection for algae cultivation systems
- Sensor fault detection
- System-wide anomaly detection
- Interactive dashboard
- API documentation with Swagger UI

## Development

### Backend

The backend is built with:
- FastAPI
- Python 3.8+
- Machine learning models for anomaly detection

### Frontend

The frontend is built with:
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI

## API Endpoints

- `GET /api/v1/health` - Health check
- `POST /api/v1/predict` - Predict anomalies
- `GET /api/v1/latest-prediction` - Get latest prediction
- `GET /api/v1/threshold` - Get current threshold
- `POST /api/v1/threshold` - Set new threshold

## Testing:
Run simulate_sensors.py to sends data to the dashboard
```
python simulat_sensors.py
```

