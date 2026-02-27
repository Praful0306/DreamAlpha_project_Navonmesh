"""
AgriStoreSmart — Weather Router
GET /api/weather?city=pune — Realistic mock weather for Indian cities
(No API key needed — mock data with time-based variation)
Navomesh 2026 | Problem 26010
"""

from fastapi import APIRouter
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models import WeatherResponse
from datetime import datetime
import random

router = APIRouter(prefix="/api/weather", tags=["Weather"])

CITIES = {
    "pune":      {"base_temp": 32.0, "humidity": 55, "desc": "Partly Cloudy",    "wind": 12.5, "icon": "02d"},
    "mumbai":    {"base_temp": 34.0, "humidity": 72, "desc": "Humid & Hazy",     "wind": 18.0, "icon": "50d"},
    "nashik":    {"base_temp": 30.0, "humidity": 48, "desc": "Clear Sky",        "wind":  8.0, "icon": "01d"},
    "kolhapur":  {"base_temp": 31.0, "humidity": 60, "desc": "Scattered Clouds", "wind": 10.0, "icon": "03d"},
    "solapur":   {"base_temp": 36.0, "humidity": 35, "desc": "Hot & Dry",        "wind": 15.0, "icon": "01d"},
    "nagpur":    {"base_temp": 38.0, "humidity": 30, "desc": "Sunny & Hot",      "wind": 10.0, "icon": "01d"},
    "aurangabad":{"base_temp": 33.0, "humidity": 45, "desc": "Partly Cloudy",    "wind": 11.0, "icon": "02d"},
}


@router.get("")
async def get_weather(city: str = "pune"):
    """Return current weather for a city (mock data with realistic variation)."""
    data = CITIES.get(city.lower().strip(), CITIES["pune"])

    hour = datetime.now().hour
    night_adj = -4.0 if (hour < 6 or hour > 20) else 0.0

    temp   = round(data["base_temp"] + night_adj + random.uniform(-1.5, 1.5), 1)
    hum    = round(data["humidity"]  + random.uniform(-3, 3), 1)
    feels  = round(temp + random.uniform(1.5, 3.0), 1)
    wind   = round(data["wind"] + random.uniform(-2, 2), 1)

    return WeatherResponse(
        city=city.title(),
        temperature=temp,
        humidity=hum,
        description=data["desc"],
        wind_speed=wind,
        icon=data["icon"],
        feels_like=feels,
        heatwave_warning=temp > 35.0,
    )
