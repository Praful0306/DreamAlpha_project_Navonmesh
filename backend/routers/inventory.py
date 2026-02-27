"""
AgriStoreSmart — Inventory & Chambers Router
GET  /api/chambers           — All chambers with latest status
GET  /api/inventory          — All stored batches with risk scores
POST /api/inventory/batch    — Add a new produce batch
Navomesh 2026 | Problem 26010
"""

from fastapi import APIRouter, HTTPException
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models import BatchCreate, BatchResponse, ChamberResponse, ChamberCreate
from database import get_connection
from datetime import date, datetime

router = APIRouter(prefix="/api", tags=["Inventory"])


def _risk(days_stored: int, max_days: int) -> str:
    ratio = days_stored / max(max_days, 1)
    if ratio >= 0.75: return "HIGH"
    if ratio >= 0.5:  return "MEDIUM"
    return "LOW"


def _status(temp, hum, th) -> str:
    if temp is None or th is None:
        return "SAFE"
    temp_out = temp < th["min_temp"] or temp > th["max_temp"]
    hum_out  = hum  < th["min_humidity"] or hum  > th["max_humidity"]
    if temp_out or hum_out:
        return "CRITICAL"
    temp_m = min(abs(temp - th["min_temp"]), abs(temp - th["max_temp"]))
    hum_m  = min(abs(hum  - th["min_humidity"]), abs(hum  - th["max_humidity"]))
    if temp_m <= 2.0 or hum_m <= 5.0:
        return "WARNING"
    return "SAFE"


@router.get("/chambers")
async def get_chambers():
    """Return all chambers with latest reading and computed status."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM chambers")
    chambers = cur.fetchall()

    result = []
    for c in chambers:
        cur.execute(
            "SELECT * FROM sensor_readings WHERE chamber_id=? ORDER BY recorded_at DESC LIMIT 1",
            (c["id"],)
        )
        reading = cur.fetchone()

        cur.execute("SELECT * FROM crop_thresholds WHERE crop_name=?", (c["crop_stored"],))
        th = cur.fetchone()

        latest_temp = reading["temperature"] if reading else None
        latest_hum  = reading["humidity"]    if reading else None
        read_time   = reading["recorded_at"] if reading else None
        status      = _status(latest_temp, latest_hum, dict(th) if th else None)

        result.append(ChamberResponse(
            id=c["id"], name=c["name"],
            location=c["location"], crop_stored=c["crop_stored"],
            capacity_tonnes=c["capacity_tonnes"],
            latest_temp=latest_temp, latest_humidity=latest_hum,
            status=status, reading_time=read_time,
        ))

    conn.close()
    return result


@router.get("/inventory")
async def get_inventory():
    """Return all stored batches sorted by risk (HIGH first)."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT b.*, c.name AS chamber_name, ct.max_days
        FROM batches b
        JOIN chambers c ON b.chamber_id = c.id
        LEFT JOIN crop_thresholds ct ON b.crop_name = ct.crop_name
        WHERE b.status = 'STORED'
        ORDER BY CASE b.risk_score WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END
    """)
    rows = cur.fetchall()

    today = date.today()
    result = []
    for r in rows:
        stored   = datetime.strptime(r["stored_date"], "%Y-%m-%d").date()
        days     = (today - stored).days
        max_days = r["max_days"] or 30
        risk     = _risk(days, max_days)

        if risk != r["risk_score"]:
            cur.execute("UPDATE batches SET risk_score=? WHERE id=?", (risk, r["id"]))

        result.append(BatchResponse(
            id=r["id"], crop_name=r["crop_name"],
            quantity_kg=r["quantity_kg"], farmer_name=r["farmer_name"],
            chamber_id=r["chamber_id"], chamber_name=r["chamber_name"],
            stored_date=r["stored_date"], risk_score=risk,
            status=r["status"], days_stored=days, max_days=max_days,
        ))

    conn.commit()
    conn.close()
    return result


@router.post("/inventory/batch")
async def add_batch(batch: BatchCreate):
    """Add a new produce batch to inventory."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM chambers WHERE id=?", (batch.chamber_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(404, f"Chamber {batch.chamber_id} not found")

    cur.execute(
        "INSERT INTO batches (crop_name, quantity_kg, farmer_name, chamber_id) VALUES (?,?,?,?)",
        (batch.crop_name, batch.quantity_kg, batch.farmer_name, batch.chamber_id)
    )
    bid = cur.lastrowid
    conn.commit()
    conn.close()
    return {"status": "ok", "message": f"Batch #{bid} added", "batch_id": bid}


@router.post("/chambers")
async def add_chamber(chamber: ChamberCreate):
    """Add a new chamber to the system."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO chambers (name, location, crop_stored, capacity_tonnes) VALUES (?,?,?,?)",
        (chamber.name, chamber.location, chamber.crop_stored, chamber.capacity_tonnes)
    )
    cid = cur.lastrowid
    conn.commit()
    conn.close()
    return {"status": "ok", "message": f"Chamber '{chamber.name}' added", "chamber_id": cid}
