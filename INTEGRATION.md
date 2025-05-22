# Frontend-Backend Integration Guide

This document explains how to run and connect the frontend application to the backend API.

## Prerequisites

- Node.js (v16+) and npm/yarn for the frontend
- Python 3.10+ and pip for the backend
- Git

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # On Windows
   python -m venv .venv
   .venv\Scripts\activate

   # On macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   # Copy example .env file and modify if needed
   cp .env.example .env
   ```

5. Start the backend server:
   ```bash
   python main.py
   ```

   The API will be available at http://localhost:8000/api/v1

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Create .env file with backend API URL
   echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:5173

## Verifying the Connection

1. Open the frontend application in your browser
2. Navigate to the "API Testing" tab
3. Check the API Status indicator - it should show "Connected" if the backend is running
4. Try submitting sensor data using the form in the API Testing tab

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure the backend CORS settings in backend/.env are properly configured:

```
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### API Connection Failures

- Verify both servers are running
- Check the API URL in frontend/.env
- Ensure network ports are not blocked by a firewall

### Data Not Loading

- Open browser DevTools and check the Network tab for API request failures
- Check browser console for JavaScript errors
- Verify the backend API endpoints match what the frontend is expecting 