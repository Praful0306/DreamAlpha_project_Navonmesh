# 🌾 AgriStoreSmart — System Design Document

> **Navomesh 2026 Hackathon | Problem Statement: 26010**
> *"From Farm to Market — Nothing Lost in Between"*

---

## 1. Problem Statement

**India loses ₹1.53 Lakh Crore worth of food every year after harvest** — enough to feed Bihar for an entire year. 86% of Indian farmers are small-holders storing 2–20 tonnes. 85% of warehouses have **zero monitoring systems**. Farmers like Ram Singh have no idea when temperature spikes — by the time they find out, half their produce is gone.

### The Core Pain Points

| Pain Point | Impact | Current Reality |
|---|---|---|
| **Delayed spoilage detection** | 30–35% post-harvest loss in fruits & vegetables | Manual checking once a day or less |
| **No actionable data** | Farmers react AFTER damage | No temperature/humidity alerts |
| **Poor market coordination** | Sell at distress pricing | No information on nearest mandis |
| **No risk visibility** | Cannot prioritize which batch to sell first | Guesswork on spoilage risk |

### Why Existing Solutions Fail

| Factor | Existing (StarAgri, SLCM) | AgriStoreSmart |
|---|---|---|
| **Target** | Large corporates (500+ MT) | Small farmers (2–20 MT) |
| **Setup Cost** | ₹50,000+ per unit | **Zero hardware needed** |
| **Required Staff** | Dedicated warehouse managers | Works on any phone |
| **Functionality** | Only monitoring | Monitoring + Risk + Dispatch advice |

---

## 2. Proposed Solution

**AgriStoreSmart** is a web-based Smart Warehouse Intelligence System that provides:

1. **🌡️ Real-time environmental monitoring** — Temperature & humidity tracking per storage chamber
2. **📦 Batch inventory management** — Track every batch with crop type, quantity, farmer name, and risk score
3. **🚨 Spoilage alert system** — Color-coded alerts (GREEN/YELLOW/RED) with recommended actions
4. **🚛 Dispatch Planner** — Weather-aware sell recommendations with nearest market matching

### User Story (Ram Singh's Day)

> *"I log in at 7 AM, I see 2 red alerts. I click on them and know exactly which chamber has a problem and what action to take. I do not need to manually check every unit."*

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     AGRISTORESMART ARCHITECTURE                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌──────────────┐    HTTP     ┌──────────────┐               │
│   │   React 18   │ ◄────────► │   FastAPI     │               │
│   │   Frontend   │  (axios)   │   Backend     │               │
│   │  :3000       │            │  :8000        │               │
│   └──────────────┘            └──────┬───────┘               │
│                                      │                        │
│                           ┌──────────┴──────────┐            │
│                           │                     │            │
│                     ┌─────▼─────┐      ┌────────▼────────┐   │
│                     │  SQLite   │      │ OpenWeatherMap  │   │
│                     │  Database │      │   Free API      │   │
│                     └───────────┘      └─────────────────┘   │
│                                                                │
│   ┌──────────────┐                                            │
│   │  Simulator   │ ── Posts fake sensor data every 8 sec ──► │
│   │  (Python)    │    POST /api/sensors/reading               │
│   └──────────────┘                                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React | 18.x | SPA with component-based UI |
| **Routing** | React Router DOM | 6.x | Client-side navigation (4 pages) |
| **Charts** | Recharts | 2.x | Temperature/humidity history graphs |
| **Styling** | TailwindCSS | 3.x | Utility-first responsive CSS |
| **HTTP Client** | Axios | 1.x | Frontend → Backend API calls |
| **Backend** | FastAPI | 0.110+ | Async REST API framework |
| **Server** | Uvicorn | 0.29+ | ASGI server with hot-reload |
| **Database** | SQLite | Built-in | Zero-config file-based database |
| **Validation** | Pydantic | 2.0+ | Request/response model schemas |
| **Weather API** | OpenWeatherMap | Free tier | Real-time external weather data |
| **Env Mgmt** | python-dotenv | 1.0+ | Secure API key management |

### 3.3 Data Flow

```
Sensor Simulator ─► POST /api/sensors/reading
                      │
                      ├─► Save to sensor_readings table
                      ├─► Check against crop_thresholds
                      │     └─► If OUT OF RANGE → Insert into alerts table
                      └─► Return status

React Dashboard ◄── GET /api/chambers (polls every 10s)
                      └─► Returns all chambers with latest readings + status

React Alerts ◄───── GET /api/alerts (polls every 15s)
                      └─► Returns unresolved alerts sorted by severity

React Dispatch ◄─── GET /api/dispatch/recommend
                      └─► Scores batches by risk + days remaining + market price
```

---

## 4. Database Design

### 4.1 Entity Relationship

```
┌─────────────────┐     ┌───────────────────┐     ┌──────────────┐
│  chambers       │     │  sensor_readings  │     │  alerts      │
│─────────────────│     │───────────────────│     │──────────────│
│ id (PK)         │◄────│ chamber_id (FK)   │     │ id (PK)      │
│ name            │     │ id (PK)           │     │ chamber_id   │
│ location        │     │ temperature       │     │ crop_affected│
│ crop_stored     │     │ humidity          │     │ severity     │
│ capacity_tonnes │     │ recorded_at       │     │ message      │
└─────────────────┘     └───────────────────┘     │ recommended  │
                                                   │ resolved     │
┌─────────────────┐     ┌───────────────────┐     │ created_at   │
│ crop_thresholds │     │     batches       │     └──────────────┘
│─────────────────│     │───────────────────│
│ id (PK)         │     │ id (PK)           │
│ crop_name       │     │ crop_name         │
│ min_temp        │     │ quantity_kg       │
│ max_temp        │     │ farmer_name       │
│ min_humidity    │     │ chamber_id        │
│ max_humidity    │     │ stored_date       │
│ max_days        │     │ risk_score        │
└─────────────────┘     │ status            │
                         └───────────────────┘
```

### 4.2 Table Definitions

#### `chambers` — Storage chamber definitions

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `name` | TEXT | e.g., "Chamber A", "Chamber B" |
| `location` | TEXT | Physical location in warehouse |
| `crop_stored` | TEXT | Current crop: "Tomatoes", "Potatoes" |
| `capacity_tonnes` | REAL | Max capacity in metric tonnes |

#### `sensor_readings` — Time-series temperature & humidity data

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `chamber_id` | INTEGER FK | References `chambers.id` |
| `temperature` | REAL | Reading in °C |
| `humidity` | REAL | Reading in % |
| `recorded_at` | DATETIME | Timestamp (auto: `datetime('now')`) |

#### `crop_thresholds` — Safe storage ranges per crop

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `crop_name` | TEXT | Crop identifier |
| `min_temp` | REAL | Minimum safe temperature (°C) |
| `max_temp` | REAL | Maximum safe temperature (°C) |
| `min_humidity` | REAL | Minimum safe humidity (%) |
| `max_humidity` | REAL | Maximum safe humidity (%) |
| `max_days` | INTEGER | Maximum safe storage days |

#### `batches` — Inventory tracking per batch

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `crop_name` | TEXT | Crop type |
| `quantity_kg` | REAL | Quantity in kilograms |
| `farmer_name` | TEXT | Farmer who deposited |
| `chamber_id` | INTEGER FK | Which chamber it's stored in |
| `stored_date` | DATE | Date batch was stored |
| `risk_score` | TEXT | `LOW` / `MEDIUM` / `HIGH` |
| `status` | TEXT | `STORED` / `DISPATCHED` / `SPOILED` |

#### `alerts` — Spoilage alert records

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `chamber_id` | INTEGER FK | Which chamber triggered alert |
| `crop_affected` | TEXT | Crop at risk |
| `severity` | TEXT | `WARNING` / `CRITICAL` |
| `message` | TEXT | Human-readable alert description |
| `recommended_action` | TEXT | e.g., "Reduce temperature in Chamber A1" |
| `resolved` | BOOLEAN | `0` = active, `1` = resolved |
| `created_at` | DATETIME | When the alert was generated |

### 4.3 Seed Data (Pre-loaded for Demo)

- **7 crop thresholds**: Tomatoes, Potatoes, Onions, Rice, Wheat, Mangoes, Bananas
- **4 chamber definitions**: Chamber A–D with different crops
- **5 demo batches**: Realistic entries with varying risk scores
- **5 demo markets**: Pune Mandi, Mumbai APMC, Nashik Market, etc.

---

## 5. API Design

### 5.1 Backend Endpoints

| Method | Endpoint | Purpose | Request Body |
|---|---|---|---|
| `POST` | `/api/sensors/reading` | Save a sensor reading | `{chamber_id, temperature, humidity}` |
| `POST` | `/api/sensors/simulate` | Trigger demo simulation | — |
| `GET` | `/api/chambers` | Get all chambers with latest status | — |
| `GET` | `/api/inventory` | Get all batches with risk scores | — |
| `POST` | `/api/inventory/batch` | Add a new produce batch | `{crop_name, quantity_kg, farmer_name, chamber_id}` |
| `GET` | `/api/alerts` | Get all unresolved alerts | — |
| `POST` | `/api/alerts/{id}/resolve` | Mark alert as resolved | — |
| `GET` | `/api/weather` | Get current weather from OpenWeatherMap | `?city=Pune` |
| `GET` | `/api/dispatch/recommend` | Get dispatch recommendations | — |
| `GET` | `/docs` | FastAPI auto-generated Swagger UI | — |

### 5.2 Status Computation Logic

```python
def compute_chamber_status(temperature, humidity, crop_thresholds):
    """
    SAFE     → All readings within min/max thresholds
    WARNING  → Within 2°C of threshold boundary
    CRITICAL → Outside threshold boundaries
    """
    temp_diff = min(
        abs(temperature - crop_thresholds.min_temp),
        abs(temperature - crop_thresholds.max_temp)
    )

    if temperature < crop_thresholds.min_temp or temperature > crop_thresholds.max_temp:
        return "CRITICAL"  # RED border
    elif temp_diff <= 2.0:
        return "WARNING"   # ORANGE border
    else:
        return "SAFE"      # GREEN border
```

### 5.3 Dispatch Recommendation Algorithm

```python
def score_batch(batch, weather, nearest_market):
    """
    Score = risk_weight + days_factor + market_opportunity
    Higher score = sell FIRST
    """
    risk_weight = {"HIGH": 100, "MEDIUM": 50, "LOW": 10}[batch.risk_score]
    days_stored = (today - batch.stored_date).days
    days_remaining = crop_thresholds.max_days - days_stored
    market_score = nearest_market.price_per_kg * batch.quantity_kg

    return risk_weight + (1 / max(days_remaining, 1)) * 50 + market_score / 1000
```

---

## 6. Frontend Design

### 6.1 Page Structure

```
App.jsx
├── / (redirect to /dashboard)
├── /dashboard   → Dashboard.jsx  (Feature 1: Environmental Monitoring)
├── /inventory   → Inventory.jsx  (Feature 2: Batch Management)
├── /alerts      → Alerts.jsx     (Feature 3: Spoilage Notifications)
└── /dispatch    → Dispatch.jsx   (Feature 4: Dispatch Planner)
```

### 6.2 Component Hierarchy

```
App.jsx
├── NavigationBar (with AlertBadge counter)
├── <Routes>
│   ├── Dashboard.jsx
│   │   ├── ChamberCard.jsx (×4 — one per chamber)
│   │   │   └── Color-coded border: GREEN / ORANGE / RED
│   │   └── Demo Controls Panel (simulate sensor readings)
│   │
│   ├── Inventory.jsx
│   │   ├── BatchTable.jsx (sortable, color-coded rows)
│   │   └── AddBatchForm.jsx (crop, quantity, farmer, chamber)
│   │
│   ├── Alerts.jsx
│   │   └── AlertCard (severity, chamber, action, resolve button)
│   │
│   └── Dispatch.jsx
│       ├── WeatherPanel.jsx (OpenWeatherMap live data)
│       └── DispatchCard (batch, market, distance, urgency)
└── Footer
```

### 6.3 Key UI Patterns

| Pattern | Implementation |
|---|---|
| **Live data polling** | `useEffect` + `setInterval` every 10–15 seconds |
| **Color coding** | GREEN = SAFE, ORANGE = WARNING, RED = CRITICAL |
| **Alert badge** | Real-time unresolved count in navigation bar |
| **Responsive layout** | TailwindCSS grid: 1-col mobile, 2-col tablet, 4-col desktop |
| **Form validation** | All fields required, no empty submissions |
| **Loading states** | Spinner while API data is being fetched |
| **Error handling** | "Unable to connect" message if backend is down |

### 6.4 API Client (`api/client.js`)

```javascript
// Single file for ALL backend API calls
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

export const getChambers    = () => API.get('/api/chambers');
export const getInventory   = () => API.get('/api/inventory');
export const addBatch       = (data) => API.post('/api/inventory/batch', data);
export const getAlerts      = () => API.get('/api/alerts');
export const resolveAlert   = (id) => API.post(`/api/alerts/${id}/resolve`);
export const getWeather     = (city) => API.get(`/api/weather?city=${city}`);
export const getDispatch    = () => API.get('/api/dispatch/recommend');
export const simulateSensor = () => API.post('/api/sensors/simulate');
```

---

## 7. Folder & File Structure

```
agristoresmart/
├── backend/
│   ├── main.py              ← FastAPI app entry point (run this)
│   ├── database.py          ← SQLite connection + CREATE TABLE
│   ├── models.py            ← Pydantic request/response models
│   ├── routers/
│   │   ├── sensors.py       ← POST /api/sensors/reading + simulate
│   │   ├── inventory.py     ← GET/POST /api/inventory
│   │   ├── alerts.py        ← GET /api/alerts + resolve
│   │   ├── weather.py       ← OpenWeatherMap integration
│   │   └── dispatch.py      ← Dispatch recommendation engine
│   ├── seed_data.py         ← Populate database with demo data
│   ├── simulator.py         ← Fake sensor readings every 8 seconds
│   ├── requirements.txt     ← Python packages
│   └── .env                 ← API keys (NEVER commit!)
│
├── frontend/
│   ├── public/
│   │   └── index.html       ← HTML entry point
│   ├── src/
│   │   ├── App.jsx          ← Root component + React Router
│   │   ├── index.jsx        ← React entry point
│   │   ├── api/
│   │   │   └── client.js    ← All fetch() calls
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Alerts.jsx
│   │   │   └── Dispatch.jsx
│   │   ├── components/
│   │   │   ├── ChamberCard.jsx
│   │   │   ├── BatchTable.jsx
│   │   │   ├── AlertBadge.jsx
│   │   │   ├── WeatherPanel.jsx
│   │   │   └── AddBatchForm.jsx
│   │   └── styles/
│   │       └── index.css
│   └── package.json
│
├── README.md
├── .gitignore
└── pyproject.toml            ← UV package definition
```

---

## 8. Feature Details

### Feature 1: Environmental Dashboard (MUST BUILD)

**Addresses**: *"blind warehouses"* — farmers cannot see what's happening inside

| What User Sees | Technical Implementation |
|---|---|
| 4 chamber cards with live temp/humidity | `GET /api/chambers` polled every 10 seconds |
| Color-coded borders (green/orange/red) | Status computed from `crop_thresholds` table |
| Temperature history chart (Recharts) | `sensor_readings` table, last 20 records |
| "Demo Controls" panel to simulate readings | `POST /api/sensors/simulate` button |

**Demo Moment**: Open dashboard → trigger warning → see card turn ORANGE → trigger critical → see it turn RED

### Feature 2: Batch Inventory Management (MUST BUILD)

**Addresses**: *"no inventory tracking"* — farmers lose track of what's stored where

| What User Sees | Technical Implementation |
|---|---|
| Batch table with risk color coding | Rows: green (LOW), orange (MEDIUM), red (HIGH) |
| "Days Stored" column | `stored_date` subtracted from today |
| Add Batch form | `POST /api/inventory/batch` |
| Immediate table update on form submit | Re-fetch inventory after successful POST |

**Demo Moment**: Add a new batch via form → it appears in table immediately → change chamber temp → show risk update

### Feature 3: Spoilage Alerts & Notifications (MUST BUILD)

**Addresses**: *"delayed detection of spoilage"* — the most painful part for farmers

| What User Sees | Technical Implementation |
|---|---|
| Bell icon with unread count badge | `GET /api/alerts` filtered for `resolved=0` |
| Alert list sorted by severity | CRITICAL first, then WARNING |
| Each alert: chamber, crop, what went wrong | Alert record with `message` + `recommended_action` |
| "Resolve" button per alert | `POST /api/alerts/{id}/resolve` |

**Demo Moment**: Simulate critical temperature spike → alert appears in nav bar with RED badge → navigate to alerts → show actionable message → resolve it

### Feature 4: Dispatch Planner + Weather (BUILD IF TIME — BIG WOW FACTOR)

**Addresses**: *"poor market coordination"* — transforms monitoring tool into decision tool

| What User Sees | Technical Implementation |
|---|---|
| Weather panel with outside conditions | `GET /api/weather` → OpenWeatherMap API |
| Heatwave warning if temp > 35°C | Flag in weather response |
| Table of at-risk batches with "Dispatch Now" | `GET /api/dispatch/recommend` scores by risk |
| Nearest market, distance, estimated price | 5 pre-loaded demo markets in database |

**Demo Moment**: Show weather panel with "38°C outside — elevated spoilage risk" → show dispatch recommendation card → judge sees ENTIRE value chain covered

---

## 9. Sensor Simulator Design

The simulator is a Python script (`simulator.py`) that mimics IoT sensor behavior:

```python
# Cycle through realistic scenarios
SCENARIOS = [
    {"temp": 12.5, "humidity": 85.0},   # SAFE (potatoes)
    {"temp": 14.0, "humidity": 88.0},   # WARNING (approaching limit)
    {"temp": 18.0, "humidity": 92.0},   # CRITICAL (above threshold)
    {"temp": 11.0, "humidity": 82.0},   # Back to SAFE
]

# Posts to POST /api/sensors/reading every 8 seconds
# Cycles: SAFE → WARNING → CRITICAL every few minutes for demo effect
```

---

## 10. 24-Hour Sprint Timeline

| Hour | Task | Git Commit |
|---|---|---|
| **0** (0:00–1:00) | Setup & Kickoff | `#1: Initial project setup with React and FastAPI` |
| **1–3** (1:00–3:00) | Database + Core APIs | `#2: Database schema, seed data, sensor + inventory APIs` |
| **3–5** (3:00–5:00) | Alerts + Status Logic | `#3: Alert system, threshold logic, chamber status` |
| **5–8** (5:00–8:00) | React Dashboard | `#4: React dashboard with live chamber cards + demo controls` |
| **8–10** (8:00–10:00) | Inventory Page | `#5: Inventory page with batch table, risk scores, add form` |
| **10–12** (10:00–12:00) | Alerts + Navigation | `#6: Alerts page, navigation, badge counter, resolve` |
| **12–14** (12:00–14:00) | Weather + Dispatch | `#7: Weather integration + dispatch recommendation engine` |
| **14–17** (14:00–17:00) | Simulator + Testing | `#8: Sensor simulator, loading states, error handling` |
| **17–19** (17:00–19:00) | UI Polish + Mobile | `#9: UI polish, mobile responsiveness, final styling` |
| **19–21** (19:00–21:00) | Demo Data + Scenario | `#10: Final demo data and realistic scenario setup` |
| **21–22** (21:00–22:00) | Pitch Deck | `#11: README updated with setup instructions` |
| **22–23** (22:00–23:00) | Final Testing + Backup | `#12: v1.0 Complete AgriStoreSmart MVP ready for demo` |
| **23–24** (23:00–24:00) | Rest & Mental Prep | — |

---

## 11. Security Considerations

| Concern | Solution |
|---|---|
| API keys in code | `.env` file + `python-dotenv` + `.gitignore` |
| SQL injection | Parameterized queries via SQLite `?` placeholders |
| CORS | FastAPI CORS middleware configured for `localhost:3000` |
| Data validation | Pydantic models enforce type safety on all endpoints |
| Production readiness | `warehouse_id` field in all tables for multi-tenancy |

---

## 12. Scalability Roadmap

| Phase | Timeline | Feature |
|---|---|---|
| **Phase 1** | 1 month | Connect real IoT sensors (₹600 per kit) |
| **Phase 2** | 3 months | WhatsApp alerts + regional language support |
| **Phase 3** | 6 months | Marketplace connect + warehouse receipt financing |
| **Phase 4** | 1 year | Pan-India FPO network + AI price prediction |

### Revenue Model

- **SaaS**: ₹500/month per warehouse (less than one day's spoilage loss)
- **Transaction fees**: Dispatch marketplace usage
- **Data analytics**: Anonymized data sold to agricultural research organizations
- **Target**: 10,000 warehouses = ₹5 Crore annual revenue

---

## 13. Impact Metrics

| Metric | Expected Impact |
|---|---|
| Spoilage reduction | **35%** (based on IoT monitoring pilot studies) |
| Storage operation costs | **25% reduction** |
| Per warehouse savings | **₹50,000 per 100-tonne warehouse per season** |
| At scale (1,000 warehouses) | **₹500 Crore saved in losses yearly** |

---

> **"Every year, India loses ₹1.5 lakh crore of food after harvest — enough to feed Bihar for an entire year. We built AgriStoreSmart: a dashboard that shows real-time temperature and humidity for every storage chamber, tracks all inventory with spoilage risk scores, and gives farmers clear action alerts before it is too late. Zero hardware needed. Works on any phone. Built in 24 hours. We help farmers save their harvest and their income."**

---

*AgriStoreSmart · Navomesh 2026 · Problem 26010*
