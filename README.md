# BaadhRaksha — 48-Hour Flood Early Warning & Emergency Intelligence Platform (Bihar)

BaadhRaksha is a simplified, mobile-responsive, offline-first flood early-warning and emergency intelligence platform focused on **Bihar, India**. It predicts flood risks ~48 hours in advance, visualizes vulnerability across North Bihar and Ganga basin districts, issues localized alerts, and coordinates citizen emergency assistance.

## Quick Start

```bash
# Start local server (zero external dependencies required)
npm start
# Or directly:
node server.cjs
```
Open **[http://localhost:3000](http://localhost:3000)** in any modern browser.

---

## Key Capabilities

1. **3 Instant Map Modes**:
   - **Thermal Heatmap**: Visualizes flood intensity gradients (Low, Moderate, High, Severe) across 12 Bihar districts (Supaul, Madhepura, Saharsa, Darbhanga, Muzaffarpur, Khagaria, Bhagalpur, Purnia, Katihar, Araria, Kishanganj, Patna).
   - **Blueprint Map**: Engineering blueprint with dark navy/charcoal styling, neon cyan district contours, grid lines, and geographic coordinates.
   - **Infrastructure Map**: Visualizes barrages (Birpur Barrage, Valmikinagar Barrage), embankments (Western Kosi Bund, Nauhatta-Mahishi Spur), gauges, and directional water-flow arrows towards the Ganga.

2. **48-Hour Simulation Engine**:
   - Interactive timeline (`NOW → +6h → +12h → +24h → +36h → +48h`) with Play/Pause/Reset.
   - State-driven risk calculations driving dynamic rainfall, river stages, and health scores.

3. **Flood Health Report**:
   - Visual gauge (0-25 Safe, 26-50 Watch, 51-75 Warning, 76-100 Critical) and printable modal report.

4. **Offline-First PWA (Service Worker + IndexedDB)**:
   - Full offline map and telemetry caching.
   - Offline SOS rescue request queueing with automated synchronization upon reconnection.

5. **Judge Demo Mode**:
   - One-click `START LIVE DEMO` launching a repeatable 10-stage guided tour.
