# BaadhRaksha — 3-Minute Hackathon Demo Script (Bihar)

## Setup
- Open [http://localhost:3000](http://localhost:3000) on laptop or mobile browser.
- Have judges observe the clean, minimal emergency dashboard.

---

### Minute 0:00 – 0:45: The Problem & The Solution
**Speaker:**
> *"Every monsoon, North Bihar faces catastrophic deluge when torrential precipitation strikes the upper Himalayas and Nepal catchments, sending hundreds of thousands of cusecs surging through the Kosi and Gandak barrages. Citizens often receive alerts too late or get overwhelmed by confusing, cluttered dashboards.*
> 
> *Welcome to **BaadhRaksha** — a simplified, 48-Hour Flood Early Warning and Emergency Intelligence platform built specifically for Bihar. Designed minimal, mobile-responsive, and offline-first, it answers 6 vital questions instantly: Where flooding is expected, which areas are at high risk, time remaining, issued alerts, regional flood health, and citizen actions."*

---

### Minute 0:45 – 1:30: Three Map Modes & 48-Hour Simulation
**Speaker:**
> *"At the center of BaadhRaksha is our Bihar geospatial visualization with three instant modes:*
> 1. ***Thermal Heatmap Mode:*** *Visualizes risk intensity gradients across 12 target Bihar districts — from Supaul (92% Severe) and Madhepura to Patna. Clicking Supaul shows live gauge telemetry (49.30m vs 47.75m Danger level) and explainable reasons for risk.*
> 2. ***Blueprint Mode:*** *Switches to an engineering cartographic blueprint with dark charcoal styling, neon cyan district contours, grid lines, and geographic coordinates.*
> 3. ***Infrastructure Map:*** *Reveals Bihar's flood management network — Birpur Barrage (48 gates open, 462,000 cusecs discharge), Gandak Barrage, embankments along Nirmali and Mahishi, with water-flow directional arrows draining into the Ganga.*
> 
> *Watch what happens when we advance our **48-Hour Simulation Slider** from NOW through +12h, +24h to +48h: rainfall accumulation climbs, river crests propagate downstream, and our **Flood Health Index** transitions dynamically from SAFE to CRITICAL."*

---

### Minute 1:30 – 2:15: Flood Health Report & Dynamic Alerts
**Speaker:**
> *"Citizens don't need complex graphs — they need clear health status and actionable warnings.*
> 
> *Notice our **Flood Health Report** on the right with a color-coded meter (0-25 Safe, 26-50 Watch, 51-75 Warning, 76-100 Critical). Clicking **VIEW FULL REPORT** opens an instant, printable executive summary with district rankings, river levels, and life-saving precautions.*
> 
> *Right beneath it, our **Targeted Alert Feed** broadcasts geo-fenced evacuation and warning orders — for instance, evacuating vulnerable diara settlements in Supaul and Madhepura to elevated high-plinth relief camps."*

---

### Minute 2:15 – 3:00: Offline-First SOS & Live Guided Tour
**Speaker:**
> *"During actual disasters, mobile networks frequently collapse. Let's demonstrate our offline resilience.*
> 
> *Notice our network indicator. When mobile connectivity drops to **OFFLINE**, our Service Worker keeps the application fully functional from local cache. When a stranded citizen clicks **REQUEST RESCUE (SOS)** and submits an emergency plea, the app stores it locally in **IndexedDB** with the status: `SOS QUEUED — WAITING FOR CONNECTION` — never creating false hope.*
> 
> *The moment cell service restores, our background sync automatically transmits the queue to emergency rescue boats without duplicate requests.*
> 
> *Judges can click **START LIVE DEMO** at any time to run an automated 10-stage guided tour through the entire 48-hour flood early warning lifecycle."*
