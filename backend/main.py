"""
AgriStoreSmart — FastAPI Main App
Run: uvicorn main:app --reload --port 8000
Navomesh 2026 | Problem 26010
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import init_database
from seed_data import seed_all
from routers import sensors, inventory, alerts, weather, dispatch

app = FastAPI(
    title="AgriStoreSmart API",
    description="Smart Warehouse Intelligence for Indian Farmers — Navomesh 2026",
    version="1.0.0",
    docs_url="/docs",
)

# ── CORS (allow React dev server) ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────
app.include_router(sensors.router)
app.include_router(inventory.router)
app.include_router(alerts.router)
app.include_router(weather.router)
app.include_router(dispatch.router)

# ── Startup ────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    db = os.path.join(os.path.dirname(__file__), "agristoresmart.db")
    if not os.path.exists(db):
        print("🌱 First run — seeding database...")
        seed_all()
    else:
        init_database()
        print("✅ Database ready!")

# ── Health ─────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"app": "AgriStoreSmart", "status": "running", "docs": "/docs"}

@app.get("/api/health", tags=["Health"])
async def health():
    from database import get_connection
    try:
        get_connection().execute("SELECT 1")
        return {"status": "healthy", "db": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
