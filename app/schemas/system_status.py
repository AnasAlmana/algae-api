from typing import Dict, List, Optional, Union, Any
from pydantic import BaseModel, Field, validator


class SystemStatusInput(BaseModel):
    algae_type: str = Field(..., description="Type of algae being monitored")
    temperature_C: float = Field(..., description="Temperature in Celsius")
    humidity_pct: Optional[float] = Field(None, alias="humidity_%", description="Humidity percentage")
    pH: float = Field(..., description="pH level of water")
    light_intensity_umol_m2_s: float = Field(..., description="Light intensity in μmol/m²/s")
    light_intensity_lux: float = Field(..., description="Light intensity in lux")
    water_level_cm: float = Field(..., description="Water level in cm")
    dissolved_oxygen_mg_per_L: float = Field(..., description="Dissolved oxygen in mg/L")
    conductivity_uS_cm: float = Field(..., description="Conductivity in μS/cm")
    turbidity_NTU: float = Field(..., description="Turbidity in NTU")
    chlorophyll_a_ug_per_L: float = Field(..., description="Chlorophyll a in μg/L")
    CO2_flow_rate_mL_per_min: float = Field(..., description="CO2 flow rate in mL/min")
    aeration_rate_L_per_min: float = Field(..., description="Aeration rate in L/min")
    optical_density_680nm: float = Field(..., description="Optical density at 680nm")
    photosynthetic_efficiency_pct: float = Field(..., description="Photosynthetic efficiency percentage")
    biomass_concentration_g_per_L: float = Field(..., description="Biomass concentration in g/L")
    nitrate_mg_per_L: float = Field(..., description="Nitrate level in mg/L")
    phosphate_mg_per_L: float = Field(..., description="Phosphate level in mg/L")
    ammonium_mg_per_L: float = Field(..., description="Ammonium level in mg/L")

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
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
            }
        }

    def dict(self, *args, **kwargs):
        # Make sure we handle the humidity field correctly
        result = super().dict(*args, **kwargs)
        if "humidity_pct" in result and result["humidity_pct"] is not None:
            result["humidity_%"] = result.pop("humidity_pct")
        return result


class SystemStatusResponse(BaseModel):
    sensor_faults: List[str] = Field(..., description="List of faulty sensors detected")
    sensor_explanations: Dict[str, Dict[str, float]] = Field(..., description="Explanations for each sensor fault")
    row_anomaly: bool = Field(..., description="Whether row-level anomaly was detected")
    row_score: float = Field(..., description="Anomaly score for the row")
    row_top_features: Dict[str, float] = Field(..., description="Top features contributing to row anomaly") 