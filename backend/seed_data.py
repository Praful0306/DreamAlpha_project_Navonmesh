"""
AgriStoreSmart — Seed Data
Populates the database with realistic demo data for the hackathon.
Navomesh 2026 Hackathon | Problem 26010

Run: python seed_data.py  (from backend/ directory)
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import get_connection, init_database


def seed_all():
    """Seed all tables with demo data."""
    init_database()
    conn = get_connection()
    cursor = conn.cursor()

    # ── Clear existing data ─────────────────────────────────────────────
    for table in ["alerts", "sensor_readings", "batches", "markets", "chambers", "crop_thresholds"]:
        cursor.execute(f"DELETE FROM {table}")

    # ── 7 Crop Thresholds ───────────────────────────────────────────────
    crop_thresholds = [
        ("Tomatoes",  8.0, 15.0, 85.0, 95.0, 14),
        ("Potatoes",  4.0, 12.0, 80.0, 90.0, 90),
        ("Onions",   25.0, 35.0, 60.0, 75.0, 120),
        ("Rice",     10.0, 25.0, 55.0, 70.0, 365),
        ("Wheat",    10.0, 25.0, 55.0, 65.0, 365),
        ("Mangoes",  10.0, 13.0, 85.0, 95.0, 7),
        ("Bananas",  13.0, 16.0, 85.0, 95.0, 10),
    ]
    cursor.executemany(
        "INSERT INTO crop_thresholds (crop_name, min_temp, max_temp, min_humidity, max_humidity, max_days) VALUES (?, ?, ?, ?, ?, ?)",
        crop_thresholds
    )

    # ── 4 Chambers ──────────────────────────────────────────────────────
    chambers = [
        ("Chamber A", "North Wing - Section 1", "Tomatoes", 10.0),
        ("Chamber B", "North Wing - Section 2", "Potatoes", 15.0),
        ("Chamber C", "South Wing - Section 1", "Mangoes",   8.0),
        ("Chamber D", "South Wing - Section 2", "Rice",     20.0),
    ]
    cursor.executemany(
        "INSERT INTO chambers (name, location, crop_stored, capacity_tonnes) VALUES (?, ?, ?, ?)",
        chambers
    )

    # ── 5 Demo Batches ───────────────────────────────────────────────────
    batches = [
        ("Tomatoes", 2500.0, "Ram Singh",     1, "2026-02-20", "LOW",    "STORED"),
        ("Potatoes", 5000.0, "Suresh Patel",  2, "2026-02-10", "LOW",    "STORED"),
        ("Mangoes",  1200.0, "Anita Devi",    3, "2026-02-25", "MEDIUM", "STORED"),
        ("Rice",     8000.0, "Mohan Sharma",  4, "2026-01-15", "LOW",    "STORED"),
        ("Tomatoes", 1800.0, "Priya Kumari",  1, "2026-02-22", "HIGH",   "STORED"),
    ]
    cursor.executemany(
        "INSERT INTO batches (crop_name, quantity_kg, farmer_name, chamber_id, stored_date, risk_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        batches
    )

    # ── 5 Demo Markets ───────────────────────────────────────────────────
    markets = [
        ("Pune Mandi",      "Pune, Maharashtra",      15.0, 35.0, "Tomatoes,Potatoes,Onions"),
        ("Mumbai APMC",     "Navi Mumbai",            120.0, 45.0, "Mangoes,Bananas,Tomatoes"),
        ("Nashik Market",   "Nashik, Maharashtra",     85.0, 30.0, "Onions,Tomatoes,Potatoes"),
        ("Kolhapur Bazaar", "Kolhapur, Maharashtra",  180.0, 28.0, "Rice,Wheat,Potatoes"),
        ("Solapur Mandi",   "Solapur, Maharashtra",   200.0, 32.0, "Wheat,Rice,Onions"),
    ]
    cursor.executemany(
        "INSERT INTO markets (name, location, distance_km, price_per_kg, crop_demand) VALUES (?, ?, ?, ?, ?)",
        markets
    )

    # ── Initial Sensor Readings (one per chamber, all SAFE) ─────────────
    initial_readings = [
        (1, 11.5, 88.0),   # Chamber A — Tomatoes: SAFE
        (2,  8.0, 84.0),   # Chamber B — Potatoes: SAFE
        (3, 12.0, 90.0),   # Chamber C — Mangoes:  SAFE
        (4, 18.0, 62.0),   # Chamber D — Rice:     SAFE
    ]
    cursor.executemany(
        "INSERT INTO sensor_readings (chamber_id, temperature, humidity) VALUES (?, ?, ?)",
        initial_readings
    )

    conn.commit()
    conn.close()

    print("✅ Seed data loaded successfully!")
    print("   → 7 crop thresholds  (Tomatoes, Potatoes, Onions, Rice, Wheat, Mangoes, Bananas)")
    print("   → 4 chambers         (Chamber A–D)")
    print("   → 5 demo batches     (realistic farmer data)")
    print("   → 5 nearby markets   (Pune, Mumbai, Nashik, Kolhapur, Solapur)")
    print("   → 4 sensor readings  (all SAFE at startup)")


if __name__ == "__main__":
    seed_all()
