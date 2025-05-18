from fastapi import APIRouter, HTTPException, Query
from app.ml.models import predict_system_status
from app.schemas.system_status import SystemStatusInput, SystemStatusResponse
from typing import Optional

router = APIRouter()

# Store the latest input and prediction data
latest_input_data = None
latest_prediction_result = None
current_anomaly_threshold = 0.08  # Set default threshold to 0.09

@router.post("/predict", response_model=SystemStatusResponse)
async def predict(
    input_data: SystemStatusInput,
    anomaly_threshold: Optional[float] = Query(None, description="Custom threshold for anomaly detection")
):
    global latest_input_data, latest_prediction_result, current_anomaly_threshold
    
    try:
        # Update current threshold if provided
        if anomaly_threshold is not None:
            current_anomaly_threshold = anomaly_threshold
            
        results = predict_system_status(
            input_data.dict(),
            anomaly_threshold=current_anomaly_threshold
        )
        
        response = SystemStatusResponse(
            sensor_faults=results["sensor_faults"],
            sensor_explanations=results["sensor_explanations"],
            row_anomaly=bool(results["row_anomaly"]),
            row_score=results["row_score"],
            row_top_features=results["row_top_features"]
        )
        
        # Store the latest data
        latest_input_data = input_data
        latest_prediction_result = response
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "healthy"}


@router.get("/latest-prediction")
async def get_latest_prediction():
    """Get the latest input data and prediction result received by the API"""
    if latest_input_data is None or latest_prediction_result is None:
        raise HTTPException(status_code=404, detail="No prediction data available yet")
    
    return {
        "input_data": latest_input_data,
        "prediction_result": latest_prediction_result,
        "current_anomaly_threshold": current_anomaly_threshold
    }

@router.get("/threshold")
async def get_threshold():
    """Get the current anomaly detection threshold"""
    return {"threshold": current_anomaly_threshold}

@router.post("/threshold")
async def set_threshold(threshold: float = Query(..., description="New threshold value for anomaly detection")):
    """Set a new anomaly detection threshold"""
    global current_anomaly_threshold
    current_anomaly_threshold = threshold
    return {"threshold": current_anomaly_threshold} 