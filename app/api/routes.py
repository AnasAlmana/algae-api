from fastapi import APIRouter, HTTPException
from app.ml.models import predict_system_status
from app.schemas.system_status import SystemStatusInput, SystemStatusResponse

router = APIRouter()


@router.post("/predict", response_model=SystemStatusResponse)
async def predict(input_data: SystemStatusInput):
    try:
        results = predict_system_status(input_data.dict())
        return SystemStatusResponse(
            sensor_faults=results["sensor_faults"],
            sensor_explanations=results["sensor_explanations"],
            row_anomaly=bool(results["row_anomaly"]),
            row_score=results["row_score"],
            row_top_features=results["row_top_features"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "healthy"} 