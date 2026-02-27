# 🚀 Elite AgriStoreSmart

**Elite AgriStoreSmart** is a multi-million-dollar agritech logistics and inventory management platform designed to track real-time crop health, optimize dispatch routing, and predict spoilage events. The platform features a hyper-premium glassmorphism UI/UX with a high-performance Python FastAPI backend.

---

## ✨ Key Features

1. **Dashboard & Environmental Monitoring:** Real-time visibility into chamber conditions (Temp, Humidity, Ethylene) with a live-sync pulse UI.
2. **Diagnostic Command Center (Alerts):** Split-pane "Mission Control" design. Real-time timeline of critical and warning events, with optimistic UI resolution and custom rule management.
3. **Advanced Dispatch Planner:** Logistics engine calculating the nearest Mandi, estimated value, and days remaining to dispatch before spoilage. Includes an interactive Dispatch Configuration Modal and Manifest generation options.
4. **Smart Inventory Management:** Tracks batches with explicit Storage Start and auto-calculated Expiry Dates. Visual risk factor bars show urgency based on shelf life. Includes a premium Slide-over Drawer for adding batches.
5. **Market & Weather Integration:** Live layout of nearby market opportunities and full weather forecasts (simulated) tuned for agricultural needs.
6. **Dark/Light Themes:** Built from the ground up for deep slate Glassmorphism (Dark) and crisp, high-contrast layouts (Light).

---

## 📸 Screenshots

### 1. Environmental Dashboard
![Dashboard](file:///C:/Users/ASUS/.gemini/antigravity/brain/eea36bd9-962b-4c6e-836b-1bae0fc27b7f/dashboard_dark_mode_1772199155424.png)

### 2. Diagnostic Command Center (Alerts)
![Alerts Command Center](file:///C:/Users/ASUS/.gemini/antigravity/brain/eea36bd9-962b-4c6e-836b-1bae0fc27b7f/alerts_dark_mode_1772208718041.png)

### 3. Inventory Risk Management
![Inventory Tracking](file:///C:/Users/ASUS/.gemini/antigravity/brain/eea36bd9-962b-4c6e-836b-1bae0fc27b7f/inventory_table_main_1772208124265.png)

### 4. Smart Dispatch Recommendations
![Dispatch Hub](file:///C:/Users/ASUS/.gemini/antigravity/brain/eea36bd9-962b-4c6e-836b-1bae0fc27b7f/dispatch_page_main_1772208082185.png)

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS v4, Recharts, Context API.
- **Backend:** Python 3.12, FastAPI, Pydantic, SQLite (via `sqlite3`), Uvicorn.
- **Tooling:** `uv` (fast Python package manager), npm.

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have Node.js (`npm`) and `uv` installed.

### 1. Backend Setup (FastAPI)

1. Navigate to the project root.
2. Sync the Python dependencies using `uv`:
   ```bash
   uv sync
   ```
3. Start the FastAPI server on port 8000:
   ```bash
   uv run --no-project python -m uvicorn backend.main:app --reload --port 8000
   ```
   > The API will be available at `http://localhost:8000`. The database `agristore.db` is automatically seeded on startup if it doesn't exist.

### 2. Frontend Setup (React/Vite)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary Node packages (if not already done):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > The app will be available at `http://localhost:3000`. It automatically proxies `/api` calls to `http://localhost:8000`.

### 3. Running Demo Mode
Once both the backend and frontend are running, click the **"Activate Demo Stream"** button on the Dashboard. This triggers the backend simulator to inject fluctuating sensor data every 8 seconds, creating realistic SAFE ➡️ WARNING ➡️ CRITICAL cycles across the chambers and generating live alerts.

---

## 📂 Project Structure

```text
├── backend/
│   ├── database.py       # SQLite connection and schema
│   ├── main.py           # FastAPI entrypoint and CORS
│   ├── models.py         # Pydantic schemas for data validation
│   ├── seed_data.py      # Initial mock data for testing
│   ├── simulator.py      # Background IoT sensor simulation logic
│   └── routers/          # Modular API endpoints (alerts, dispatch, inventory, sensors)
└── frontend/
    ├── src/
    │   ├── api/          # Axios client (client.js)
    │   ├── components/   # Reusable UI (NavBar, UXStates, ChamberCards)
    │   ├── context/      # ThemeContext for Dark/Light mode
    │   ├── pages/        # Main route views (Dashboard, Alerts, Dispatch, etc.)
    │   ├── App.jsx       # React Router layout
    │   └── index.css     # Global Tailwind mesh gradients and scrollbars
    ├── package.json
    └── vite.config.js    # Proxy configuration to backend
```

---
*Developed by Navomesh 2026 | Problem 26010*
