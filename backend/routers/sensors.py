"""
AgriStoreSmart — Sensors Router
POST /api/sensors/reading — Save sensor reading + trigger alerts
POST /api/sensors/simulate — Fire demo simulation (cycles SAFE→WARNING→CRITICAL)
GET  /api/sensors/history/{chamber_id} — Reading history
Navomesh 2026 | Problem 26010
"""

from fastapi import APIRouter, HTTPException
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models import SensorReadingCreate
from database import get_connection
import random

router = APIRouter(prefix="/api/sensors", tags=["Sensors"])


def compute_status(temperature: float, humidity: float, threshold: dict) -> str:
    """Return SAFE / WARNING / CRITICAL based on threshold breach."""
    temp_out = temperature < threshold["min_temp"] or temperature > threshold["max_temp"]
    hum_out  = humidity  < threshold["min_humidity"] or humidity  > threshold["max_humidity"]
    if temp_out or hum_out:
        return "CRITICAL"

    temp_margin = min(abs(temperature - threshold["min_temp"]),
                      abs(temperature - threshold["max_temp"]))
    hum_margin  = min(abs(humidity  - threshold["min_humidity"]),
                      abs(humidity  - threshold["max_humidity"]))
    if temp_margin <= 2.0 or hum_margin <= 5.0:
        return "WARNING"
    return "SAFE"


def maybe_create_alert(chamber_id: int, temperature: float, humidity: float):
    """Insert alert row if reading is WARNING or CRITICAL."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM chambers WHERE id=?", (chamber_id,))
    chamber = cur.fetchone()
    if not chamber:
        conn.close(); return

    cur.execute("SELECT * FROM crop_thresholds WHERE crop_name=?", (chamber["crop_stored"],))
    th = cur.fetchone()
    if not th:
        conn.close(); return

    status = compute_status(temperature, humidity, dict(th))

    if status in ("WARNING", "CRITICAL"):
        issues = []
        if temperature < th["min_temp"]:
            issues.append(f"Temp too LOW ({temperature}°C, min {th['min_temp']}°C)")
        elif temperature > th["max_temp"]:
            issues.append(f"Temp too HIGH ({temperature}°C, max {th['max_temp']}°C)")
        if humidity < th["min_humidity"]:
            issues.append(f"Humidity too LOW ({humidity}%, min {th['min_humidity']}%)")
        elif humidity > th["max_humidity"]:
            issues.append(f"Humidity too HIGH ({humidity}%, max {th['max_humidity']}%)")

        msg = f"{status}: {' | '.join(issues)} in {chamber['name']}"

        if any("HIGH" in i and "Temp" in i for i in issues):
            action = f"Activate cooling/ventilation in {chamber['name']} ({chamber['location']}) immediately."
        elif any("LOW" in i and "Temp" in i for i in issues):
            action = f"Reduce ventilation and check insulation in {chamber['name']}."
        else:
            action = f"Check humidity controls and sealing in {chamber['name']}."

        cur.execute(
            "INSERT INTO alerts (chamber_id, crop_affected, severity, message, recommended_action) VALUES (?,?,?,?,?)",
            (chamber_id, chamber["crop_stored"], status, msg, action)
        )
        conn.commit()

    conn.close()


@router.post("/reading")
async def add_reading(reading: SensorReadingCreate):
    """Save a sensor reading and trigger alert checks."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM chambers WHERE id=?", (reading.chamber_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(404, f"Chamber {reading.chamber_id} not found")

    cur.execute(
        "INSERT INTO sensor_readings (chamber_id, temperature, humidity) VALUES (?,?,?)",
        (reading.chamber_id, reading.temperature, reading.humidity)
    )
    conn.commit()
    conn.close()

    maybe_create_alert(reading.chamber_id, reading.temperature, reading.humidity)
    return {"status": "ok", "message": f"Reading saved for chamber {reading.chamber_id}"}


@router.post("/simulate")
async def simulate_readings():
    """Post randomised readings to all chambers for demo purposes."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT c.id, c.crop_stored, ct.min_temp, ct.max_temp, ct.min_humidity, ct.max_humidity
        FROM chambers c
        JOIN crop_thresholds ct ON c.crop_stored = ct.crop_name
    """)
    chambers = cur.fetchall()
    conn.close()

    results = []
    scenarios = ["SAFE", "SAFE", "WARNING", "CRITICAL"]

    for ch in chambers:
        scenario = random.choice(scenarios)
        mid_t = (ch["min_temp"] + ch["max_temp"]) / 2
        mid_h = (ch["min_humidity"] + ch["max_humidity"]) / 2

        if scenario == "SAFE":
            temp = mid_t + random.uniform(-1, 1)
            humd = mid_h + random.uniform(-2, 2)
        elif scenario == "WARNING":
            temp = ch["max_temp"] - random.uniform(0.5, 1.5)
            humd = mid_h + random.uniform(-3, 3)
        else:
            temp = ch["max_temp"] + random.uniform(2, 5)
            humd = ch["max_humidity"] + random.uniform(2, 6)

        temp = round(temp, 1)
        humd = round(humd, 1)
        await add_reading(SensorReadingCreate(chamber_id=ch["id"], temperature=temp, humidity=humd))
        results.append({"chamber_id": ch["id"], "temp": temp, "humidity": humd, "scenario": scenario})

    return {"status": "ok", "readings": results}


@router.get("/history/{chamber_id}")
async def get_history(chamber_id: int, limit: int = 20):
    """Return the last N sensor readings for a chamber (chronological)."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM sensor_readings WHERE chamber_id=? ORDER BY recorded_at DESC LIMIT ?",
        (chamber_id, limit)
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return {"chamber_id": chamber_id, "readings": list(reversed(rows))}
