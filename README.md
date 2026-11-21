# BaadhRaksha (बाढ़रक्षा) 🌊

### Real-Time Flood Monitoring, Spatial Risk Grid & Emergency Response Platform
**Focus Geography:** Kharghar, Navi Mumbai, Maharashtra, India 🇮🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Offline First](https://img.shields.io/badge/Offline-IndexedDB-orange.svg)](#offline-first--pwa-resilience)
[![GIS Engine](https://img.shields.io/badge/GIS-Leaflet%20%7C%20GeoJSON-blueviolet.svg)](#interactive-map-system)
[![Status: Production Ready](https://img.shields.io/badge/Status-Complete-success.svg)](#)

---

## 📌 Executive Overview

During intense coastal monsoon downpours and high astronomical tides in Panvel Creek, low-lying sectors of Kharghar, Navi Mumbai face severe waterlogging, culvert overflow, and urban flooding. Traditional disaster dashboards are often cluttered, overly technical, or fail entirely when mobile cellular connectivity collapses.

**BaadhRaksha** is an ultra-fast, mobile-first, offline-capable Progressive Web Application (PWA) engineered specifically for **Kharghar, Navi Mumbai**. Designed around the principle of immediate situational clarity, it answers four vital citizen questions within 5 seconds:

1. **What is the current flood situation?**
2. **Is my sector or street at risk?**
3. **Where is the risk higher in nearby neighborhoods?**
4. **How can I get immediate rescue or help?**

---

## 🌟 Key Capabilities & Features

### 1. 🗺️ Dual-Mode Interactive GIS Map Engine
Built on top of Leaflet.js with seamless state retention (switching preserves position, zoom, and active pins without reloads):
- **Normal Map Mode**:
  - OpenStreetMap base layer showcasing actual streets, buildings, transit hubs, and landmarks.
  - Highlights Kharghar sectors (Sectors 7, 10, 12, 15, 19, 20, 21, 35, 36).
  - Identifies natural drainage corridors: **Kasadi (Kasardi) River**, **Kopra Nullah Channel**, and the **Central Park Retention Lake**.
- **Flood Risk Grid Map Mode (Spatial Risk Analysis)**:
  - Overlays **238 accurate geographic grid cells** (~300m resolution) across Kharghar and the Taloja boundary.
  - Color-coded risk visualization:
    - 🟢 **Green** (`#10b981`): Lower Modeled Risk (0–24)
    - 🟡 **Yellow** (`#eab308`): Moderate Modeled Risk (25–49)
    - 🟠 **Orange** (`#f97316`): High Modeled Risk (50–74)
    - 🔴 **Red** (`#ef4444`): Very High Modeled Risk (75–100)
  - **Dynamic Legend**: Visible strictly when Flood Risk Grid mode is active.
  - **Interactive Cell Popups**: Click any grid cell to view:
    - Target Sector / Landmark Name
    - Normalized Risk Score (0–100)
    - Modeled Hydrological Contributing Factors (elevation, culvert proximity, tidal backwater)
    - Recommended Citizen Safety Action
    - Data transparency watermark (`DEMO DATA`)

---

### 2. ⚡ Instant Sector Search & Geolocation
- **Autocomplete Sector Finder**: Quick search for any Kharghar sector or landmark (`Sector 7`, `Sector 12`, `Sector 20`, `Sector 35`, `Central Park`, `Railway Station`, `Utsav Chowk`, etc.). Selecting an item smoothly centers the map, highlights local risk, and presents sector-specific advisory.
- **🎯 My Location**: One-click GPS locator pinpoints user coordinates with a pulsing map marker, falling back gracefully to Sector 20 if GPS permissions are denied.

---

### 3. 🆘 Streamlined Citizen Emergency Actions
Three large, touch-friendly primary buttons prominently positioned:
1. **REQUEST HELP (SOS)**:
   - Minimal fields: Name, Phone Number, Kharghar Sector, GPS auto-detect, Number of People trapped, Emergency Type, and optional details.
   - **True Offline Resilience**: If cellular data or Wi-Fi drops, the request is stored locally in IndexedDB with an explicit status:
     `⚠️ SOS SAVED LOCALLY — WAITING FOR CONNECTION`
     *(Never gives false reassurance that offline messages reached rescue squads until actual connectivity returns).*
   - **Auto-Sync**: Reconnection automatically transmits queued distress pleas to emergency dispatch.
2. **REPORT FLOODING**:
   - Crowdsource ground-truth observations in under 30 seconds.
   - Categorized reporting: *Waterlogging*, *Flooded roads*, *Rising water*, *Flooded homes*, *Blocked roads*, *People needing rescue*.
   - Includes optional GPS tagging and camera photograph attachment.
3. **SAFETY GUIDELINES**:
   - Practical, plain-language emergency action guide divided into:
     - 🟡 **Before a Flood**: Clearing compound drains, elevating valuables, packing emergency kits.
     - 🔴 **During a Flood**: Avoiding underpasses (such as the Kharghar Station subway), disconnecting power mains, never driving through floodwaters.
     - 🟢 **After a Flood**: Electrical hazard checks, water purification, reporting debris blockages.

---

### 4. 📞 Kharghar & Panvel Municipal Helplines
Quick-dial access to verified local authorities:
- **Panvel Municipal Corporation (PMC) Disaster Cell**: `022-27458040`
- **Kharghar Fire Station**: `022-27745433`
- **Kharghar Police Station**: `022-27741364`
- **Raigad District Disaster Management**: `1077`
- **National Unified Emergency Response**: `112`

---

### 5. 🏫 Kharghar Elevated Relief Shelters
Direct information and routing to designated elevated public evacuation centers:
- Ramsheth Thakur Public School Elevated Shelter (Sector 19)
- CIDCO Community Centre (Sector 12)
- Bharati Vidyapeeth College of Engineering Auditorium (Sector 7)
- Swapnapurti CIDCO Community Hall (Sector 36)

---

### 6. 📱 Progressive Web App (PWA) & Offline Capabilities
- Registered Service Worker with cache-first and background revalidation strategies.
- OpenStreetMap tile caching for offline map inspection.
- Full bilingual support: **English** and **मराठी / हिन्दी** with instant toggle.
- Mobile-first responsive layout tested across 360px, 390px, 430px, and desktop screens with zero horizontal scrolling.

---

## 🏗️ Architecture & Project Structure

```
BaadhRaksha/
├── index.html                   # Clean, single-page application entry point
├── manifest.webmanifest         # PWA web app manifest
├── sw.js                        # Service worker with offline asset & tile caching
├── server.cjs                   # Zero-dependency Node.js HTTP server
├── package.json                 # Project configuration
├── css/
│   └── app.css                  # Mobile-first CSS design system
├── data/
│   ├── districts.json           # Kharghar sectors & landmarks dataset
│   ├── grid_risk.json           # 238 Kharghar geographical grid cells
│   ├── kharghar_grid.geojson    # GeoJSON FeatureCollection for spatial GIS grid
│   ├── kharghar_boundary.geojson# Node boundary polygon
│   ├── rivers.json              # Kasadi River & Kopra Creek channel vectors
│   ├── shelters.json            # Elevated civic shelter locations & facilities
│   ├── infrastructure.json      # Pumps, sluices, and flood control bunds
│   ├── reports.json             # Seed citizen flood reports
│   ├── timeline.json            # 48-hour monsoon downpour simulation scenario
│   └── volunteers.json          # Kharghar local response volunteer network
├── icons/
│   └── icon.svg                 # SVG brand vector logo
├── src/
│   ├── main.js                  # Application bootstrapper & core view router
│   ├── state.js                 # Central reactive state store & IndexedDB sync
│   ├── db.js                    # IndexedDB client wrapper for offline storage
│   ├── risk/
│   │   ├── engine.js            # Transparent Kharghar hydrology risk calculation
│   │   └── explain.js           # Natural language risk explanations
│   ├── services/
│   │   ├── alerts.js            # Alert stage standards & CAP templates
│   │   ├── network.js           # Online/Offline simulation & connection detector
│   │   ├── shelterMatcher.js    # Proximity matching for evacuation shelters
│   │   └── volunteerMatcher.js  # Citizen volunteer dispatch matching
│   ├── simulation/
│   │   ├── demo.js              # 8-step presenter demonstration controller
│   │   └── timeline.js          # 48-hour flood progression playback
│   └── ui/
│       ├── map.js               # Leaflet GIS Normal Map + Flood Risk Grid engine
│       ├── alerts.js            # Geo-fenced flood alert feed with severity filters
│       ├── help.js              # SOS help form, shelter finder & emergency contacts
│       └── reports.js           # Citizen observation reporting interface
└── vendor/
    ├── leaflet.css              # Leaflet mapping styles
    ├── leaflet.js               # Leaflet GIS library
    └── images/                  # Marker icons and pin assets
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 16 or newer recommended).
- **No external npm packages required** — runs on vanilla standard modern ES modules and native Node.js HTTP APIs.

### Installation & Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AmanAswal05/BaadhRaksha.git
   cd BaadhRaksha
   ```

2. **Launch the Local Server**:
   ```bash
   node server.cjs
   ```
   *(Or using npm)*:
   ```bash
   npm start
   ```

3. **Open in Web Browser**:
   Navigate to:
   ```
   http://localhost:3000
   ```

---

## 🧪 Presenter Demo Mode

For hackathon presentations, demonstrations, or stress testing:
1. Click the **`DEMO MODE`** button in the header.
2. Use the interactive scenario stepper to demonstrate:
   - **Step 1**: Normal monsoon baseline.
   - **Step 2**: 48-hour catchment downpour advisory.
   - **Step 3**: Increasing flood risk with tidal resistance.
   - **Step 4**: Flood Risk Grid inspection & cell details popup.
   - **Step 5**: Very High risk alert along Kasadi river (Sectors 35 & 36).
   - **Step 6**: Live citizen SOS submission.
   - **Step 7**: Network drop simulation and transparent IndexedDB queuing.
   - **Step 8**: Network restoration and automatic distress request dispatch.

---

## 🔒 Data Accuracy & Ethical AI Principles

- **No Artificial Panic**: Areas are accurately classified with transparent labels such as **"Lower modeled risk"** instead of an absolute "Safe".
- **Explicit Demo Watermark**: All simulated rainfall, modeled water depths, and generated grid scores are clearly labeled:
  `DEMO MODE – Flood risk values are illustrative and are not official forecasts.`
- **Authentic Municipal Integration**: Emergency telephone lines direct exclusively to authorized local bodies (Panvel Municipal Corporation, Maharashtra Fire & Police Services, and NDRF).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — open for community enhancement, humanitarian use, and civic development.
