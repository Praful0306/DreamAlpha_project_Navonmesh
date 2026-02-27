"""
AgriStoreSmart — Alerts Router
GET  /api/alerts            — Unresolved alerts (CRITICAL first)
POST /api/alerts/{id}/resolve — Mark alert resolved
GET  /api/alerts/stats      — Badge counter stats
Navomesh 2026 | Problem 26010
"""

from fastapi import APIRouter, HTTPException
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models import AlertResponse
from database import get_connection

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("/stats")
async def get_stats():
    """Return counts for the nav-bar alert badge."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) AS n FROM alerts WHERE resolved=0")
    unresolved = cur.fetchone()["n"]
    cur.execute("SELECT COUNT(*) AS n FROM alerts WHERE resolved=0 AND severity='CRITICAL'")
    critical = cur.fetchone()["n"]
    cur.execute("SELECT COUNT(*) AS n FROM alerts WHERE resolved=0 AND severity='WARNING'")
    warnings = cur.fetchone()["n"]
    conn.close()
    return {"unresolved": unresolved, "critical": critical, "warnings": warnings}


@router.get("")
async def get_alerts(resolved: bool = False):
    """Return alerts sorted by severity then time."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT a.*, c.name AS chamber_name
        FROM alerts a
        JOIN chambers c ON a.chamber_id = c.id
        WHERE a.resolved = ?
        ORDER BY CASE a.severity WHEN 'CRITICAL' THEN 1 ELSE 2 END, a.created_at DESC
    """, (1 if resolved else 0,))

    result = [
        AlertResponse(
            id=r["id"], chamber_id=r["chamber_id"],
            chamber_name=r["chamber_name"], crop_affected=r["crop_affected"],
            severity=r["severity"], message=r["message"],
            recommended_action=r["recommended_action"],
            resolved=bool(r["resolved"]), created_at=r["created_at"],
        )
        for r in cur.fetchall()
    ]
    conn.close()
    return result


@router.post("/{alert_id}/resolve")
async def resolve_alert(alert_id: int):
    """Mark a single alert as resolved."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM alerts WHERE id=?", (alert_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(404, f"Alert #{alert_id} not found")
    cur.execute("UPDATE alerts SET resolved=1 WHERE id=?", (alert_id,))
    conn.commit()
    conn.close()
    return {"status": "ok", "message": f"Alert #{alert_id} resolved"}
