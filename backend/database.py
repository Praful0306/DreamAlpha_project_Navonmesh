"""
AgriStoreSmart — Database Module
SQLite connection manager and schema definition.
Navomesh 2026 Hackathon | Problem 26010
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "agristoresmart.db")


def get_connection():
    """Get a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_database():
    """Create all tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    # Chambers — storage unit definitions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chambers (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT    NOT NULL,
            location        TEXT    NOT NULL,
            crop_stored     TEXT    NOT NULL,
            capacity_tonnes REAL    NOT NULL
        )
    """)

    # Sensor readings — time-series temperature & humidity
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id          INTEGER  PRIMARY KEY AUTOINCREMENT,
            chamber_id  INTEGER  NOT NULL,
            temperature REAL     NOT NULL,
            humidity    REAL     NOT NULL,
            recorded_at DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (chamber_id) REFERENCES chambers(id)
        )
    """)

    # Crop thresholds — safe storage ranges per crop
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crop_thresholds (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name     TEXT    NOT NULL UNIQUE,
            min_temp      REAL    NOT NULL,
            max_temp      REAL    NOT NULL,
            min_humidity  REAL    NOT NULL,
            max_humidity  REAL    NOT NULL,
            max_days      INTEGER NOT NULL
        )
    """)

    # Batches — inventory tracking per batch
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS batches (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name   TEXT    NOT NULL,
            quantity_kg REAL    NOT NULL,
            farmer_name TEXT    NOT NULL,
            chamber_id  INTEGER NOT NULL,
            stored_date DATE    DEFAULT (date('now')),
            risk_score  TEXT    DEFAULT 'LOW'    CHECK(risk_score IN ('LOW','MEDIUM','HIGH')),
            status      TEXT    DEFAULT 'STORED' CHECK(status IN ('STORED','DISPATCHED','SPOILED')),
            FOREIGN KEY (chamber_id) REFERENCES chambers(id)
        )
    """)

    # Alerts — spoilage notifications
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id                 INTEGER  PRIMARY KEY AUTOINCREMENT,
            chamber_id         INTEGER  NOT NULL,
            crop_affected      TEXT     NOT NULL,
            severity           TEXT     NOT NULL CHECK(severity IN ('WARNING','CRITICAL')),
            message            TEXT     NOT NULL,
            recommended_action TEXT     NOT NULL,
            resolved           BOOLEAN  DEFAULT 0,
            created_at         DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (chamber_id) REFERENCES chambers(id)
        )
    """)

    # Markets — dispatch destinations
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS markets (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            name         TEXT    NOT NULL,
            location     TEXT    NOT NULL,
            distance_km  REAL    NOT NULL,
            price_per_kg REAL    NOT NULL,
            crop_demand  TEXT    NOT NULL
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")


if __name__ == "__main__":
    init_database()
    print(f"Database created at: {DB_PATH}")
