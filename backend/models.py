"""
AgriStoreSmart — Pydantic Models
Request / response schemas for all API endpoints.
Navomesh 2026 Hackathon | Problem 26010
"""

from pydantic import BaseModel, Field
from typing import Optional


# ── Sensor ────────────────────────────────────────────────────────────────

class SensorReadingCreate(BaseModel):
    chamber_id:  int
    temperature: float
    humidity:    float


class SensorReadingResponse(BaseModel):
    id:          int
    chamber_id:  int
    temperature: float
    humidity:    float
    recorded_at: str


# ── Chamber ───────────────────────────────────────────────────────────────

class ChamberCreate(BaseModel):
    name:             str
    location:         str
    crop_stored:      str
    capacity_tonnes:  float


class ChamberResponse(BaseModel):
    id:               int
    name:             str
    location:         str
    crop_stored:      str
    capacity_tonnes:  float
    latest_temp:      Optional[float] = None
    latest_humidity:  Optional[float] = None
    status:           str = "SAFE"   # SAFE | WARNING | CRITICAL
    reading_time:     Optional[str]  = None


# ── Inventory / Batch ─────────────────────────────────────────────────────

class BatchCreate(BaseModel):
    crop_name:   str
    quantity_kg: float = Field(gt=0)
    farmer_name: str
    chamber_id:  int


class BatchResponse(BaseModel):
    id:           int
    crop_name:    str
    quantity_kg:  float
    farmer_name:  str
    chamber_id:   int
    chamber_name: Optional[str] = None
    stored_date:  str
    risk_score:   str
    status:       str
    days_stored:  int = 0
    max_days:     Optional[int] = None


# ── Alert ─────────────────────────────────────────────────────────────────

class AlertResponse(BaseModel):
    id:                 int
    chamber_id:         int
    chamber_name:       Optional[str] = None
    crop_affected:      str
    severity:           str
    message:            str
    recommended_action: str
    resolved:           bool
    created_at:         str


# ── Weather ───────────────────────────────────────────────────────────────

class WeatherResponse(BaseModel):
    city:             str
    temperature:      float
    humidity:         float
    description:      str
    wind_speed:       float
    icon:             str
    feels_like:       float
    heatwave_warning: bool = False


# ── Dispatch ──────────────────────────────────────────────────────────────

class DispatchRecommendation(BaseModel):
    batch_id:              int
    crop_name:             str
    quantity_kg:           float
    farmer_name:           str
    risk_score:            str
    days_stored:           int
    days_remaining:        int
    urgency:               str   # SELL NOW | SELL SOON | CAN WAIT
    urgency_score:         float
    recommended_market:    str
    market_distance_km:    float
    estimated_price_per_kg: float
    estimated_total_value:  float
