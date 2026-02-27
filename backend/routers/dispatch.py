"""
AgriStoreSmart — Dispatch Router
GET /api/dispatch/recommend — Ranked dispatch recommendations
Algorithm: risk_weight + days_urgency + market_value score
Navomesh 2026 | Problem 26010
"""

from fastapi import APIRouter
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models import DispatchRecommendation
from database import get_connection
from datetime import date, datetime

router = APIRouter(prefix="/api/dispatch", tags=["Dispatch"])


def _score(days_stored, days_remaining, risk, price, qty) -> float:
    risk_w   = {"HIGH": 100, "MEDIUM": 50, "LOW": 10}.get(risk, 10)
    day_f    = (1 / max(days_remaining, 1)) * 50
    market_s = (price * qty) / 1000
    return round(risk_w + day_f + market_s, 2)


def _urgency(score: float) -> str:
    if score >= 100: return "SELL NOW"
    if score >= 50:  return "SELL SOON"
    return "CAN WAIT"


@router.get("/recommend")
async def get_recommendations():
    """Return all stored batches ranked by dispatch urgency."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT b.*, ct.max_days
        FROM batches b
        LEFT JOIN crop_thresholds ct ON b.crop_name = ct.crop_name
        WHERE b.status = 'STORED'
    """)
    batches = cur.fetchall()

    cur.execute("SELECT * FROM markets ORDER BY distance_km ASC")
    markets = cur.fetchall()

    today = date.today()
    result = []

    for b in batches:
        stored        = datetime.strptime(b["stored_date"], "%Y-%m-%d").date()
        days_stored   = (today - stored).days
        max_days      = b["max_days"] or 30
        days_remaining = max(max_days - days_stored, 0)

        # Best matching market for this crop
        market = next(
            (m for m in markets if b["crop_name"] in m["crop_demand"]),
            markets[0] if markets else None
        )
        if not market:
            continue

        score = _score(days_stored, days_remaining, b["risk_score"],
                       market["price_per_kg"], b["quantity_kg"])

        result.append(DispatchRecommendation(
            batch_id=b["id"], crop_name=b["crop_name"],
            quantity_kg=b["quantity_kg"], farmer_name=b["farmer_name"],
            risk_score=b["risk_score"], days_stored=days_stored,
            days_remaining=days_remaining,
            urgency=_urgency(score), urgency_score=score,
            recommended_market=market["name"],
            market_distance_km=market["distance_km"],
            estimated_price_per_kg=market["price_per_kg"],
            estimated_total_value=round(market["price_per_kg"] * b["quantity_kg"], 2),
        ))

    conn.close()
    result.sort(key=lambda x: x.urgency_score, reverse=True)
    return result
