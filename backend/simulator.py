# -*- coding: utf-8 -*-
"""
AgriStoreSmart -- IoT Sensor Simulator
Mimics real IoT sensors by posting readings to the backend API.
Cycles: SAFE -> WARNING -> CRITICAL for each chamber.

Usage (from project root):
    .venv\\Scripts\\python.exe backend\\simulator.py

Or from backend/ directory:
    python simulator.py

Press Ctrl+C to stop.
Navomesh 2026 | Problem 26010
"""

import requests
import time
import random
import sys

API_BASE = "http://localhost:8000"
INTERVAL_SECONDS = 8   # Post every 8 seconds

# Scenario cycles per chamber (loops continuously)
# Designed to demo: SAFE -> WARNING -> CRITICAL for the judges

SCENARIOS = {
    1: [  # Chamber A -- Tomatoes (safe: 8-15 C, 85-95%)
        {"temp": 11.5, "hum": 89.0, "label": "SAFE"},
        {"temp": 13.5, "hum": 91.0, "label": "WARNING"},
        {"temp": 17.0, "hum": 88.0, "label": "CRITICAL"},
        {"temp": 10.0, "hum": 88.0, "label": "SAFE"},
    ],
    2: [  # Chamber B -- Potatoes (safe: 4-12 C, 80-90%)
        {"temp":  8.0, "hum": 84.0, "label": "SAFE"},
        {"temp": 11.0, "hum": 86.0, "label": "WARNING"},
        {"temp": 14.5, "hum": 93.0, "label": "CRITICAL"},
        {"temp":  7.0, "hum": 83.0, "label": "SAFE"},
    ],
    3: [  # Chamber C -- Mangoes (safe: 10-13 C, 85-95%)
        {"temp": 11.5, "hum": 90.0, "label": "SAFE"},
        {"temp": 12.5, "hum": 93.0, "label": "WARNING"},
        {"temp": 15.5, "hum": 97.0, "label": "CRITICAL"},
        {"temp": 11.0, "hum": 89.0, "label": "SAFE"},
    ],
    4: [  # Chamber D -- Rice (safe: 10-25 C, 55-70%)
        {"temp": 18.0, "hum": 62.0, "label": "SAFE"},
        {"temp": 23.5, "hum": 65.0, "label": "WARNING"},
        {"temp": 28.0, "hum": 73.0, "label": "CRITICAL"},
        {"temp": 16.0, "hum": 60.0, "label": "SAFE"},
    ],
}

STATUS_ICON = {"SAFE": "[OK]", "WARNING": "[WARN]", "CRITICAL": "[CRIT]"}


def check_backend():
    """Verify backend is reachable before starting."""
    try:
        r = requests.get(f"{API_BASE}/api/health", timeout=3)
        return r.status_code == 200
    except Exception:
        return False


def post_reading(chamber_id, temp, hum):
    """Post one sensor reading. Returns True on success."""
    try:
        r = requests.post(
            f"{API_BASE}/api/sensors/reading",
            json={"chamber_id": chamber_id, "temperature": temp, "humidity": hum},
            timeout=5,
        )
        return r.status_code == 200
    except Exception:
        return False


def run():
    print("=" * 55)
    print("  AgriStoreSmart -- IoT Sensor Simulator")
    print("=" * 55)
    print("  Backend  :", API_BASE)
    print("  Interval :", INTERVAL_SECONDS, "seconds")
    print("  Chambers :", list(SCENARIOS.keys()))
    print("  Press Ctrl+C to stop\n")

    if not check_backend():
        print("[ERROR] Backend not reachable at", API_BASE)
        print("        Start it first: uvicorn main:app --reload --port 8000")
        sys.exit(1)
    print("[OK] Backend connected!\n")

    cycle = 0
    while True:
        cycle += 1
        print(f"--- Cycle {cycle} -----------------------------------")
        all_ok = True

        for chamber_id, steps in SCENARIOS.items():
            step = steps[(cycle - 1) % len(steps)]

            # Add tiny random noise for realism
            temp = round(step["temp"] + random.uniform(-0.2, 0.2), 1)
            hum  = round(step["hum"]  + random.uniform(-0.5, 0.5), 1)

            ok = post_reading(chamber_id, temp, hum)
            icon = STATUS_ICON.get(step["label"], "[ ? ]")
            result = "sent" if ok else "FAILED"

            print(f"  Chamber {chamber_id}  {icon:<8}  {temp}C  {hum}%  -> {result}")
            if not ok:
                all_ok = False

        if not all_ok:
            print("\n  [WARN] Some readings failed -- is the backend running?")

        print(f"\n  Next in {INTERVAL_SECONDS}s... (Ctrl+C to stop)\n")
        try:
            time.sleep(INTERVAL_SECONDS)
        except KeyboardInterrupt:
            print("\n[STOP] Simulator stopped. Goodbye!")
            sys.exit(0)


if __name__ == "__main__":
    run()
