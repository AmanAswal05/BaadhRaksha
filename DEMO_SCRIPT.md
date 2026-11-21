# BaadhRaksha — 3-Minute Presentation & Demo Guide

## Setup
- Open `http://localhost:3000` on a laptop or mobile phone browser.
- Verify the header displays **BaadhRaksha — Kharghar, Navi Mumbai**.

---

### Minute 0:00 – 0:45: The Problem & The Mission
**Speaker:**
> *"During intense monsoon downpours, low-lying sectors of Kharghar and the Taloja belt face rapid waterlogging. Natural runoffs descending from the Kharghar hills collide with high astronomical tides in Panvel Creek, turning culverts into bottlenecks along Sectors 19, 20, 35, 36, and the Railway Station subway.*
> 
> *During such emergencies, citizens don't need complex, overwhelming dashboards — they need four immediate answers: Is my area at risk? Where is the risk higher? What action should I take? And how can I get rescue?*
> 
> *Welcome to **BaadhRaksha** — a mobile-first, offline-resilient flood monitoring and emergency response application built specifically for Kharghar, Navi Mumbai."*

---

### Minute 0:45 – 1:30: Two Map Modes & Spatial Flood Risk Grid
**Speaker:**
> *"At the center of BaadhRaksha is our dual-mode geospatial engine:*
> 1. ***NORMAL MAP:*** *Shows clean OpenStreetMap tiles with actual roads, Kharghar sector markers, railway stations, Utsav Chowk, and the Kasadi River drainage corridors.*
> 2. ***FLOOD RISK GRID:*** *(Click the 'FLOOD RISK GRID' button).*
> *Notice how our map overlays 238 color-coded geographic grid cells aligned to real terrain. Green represents lower modeled risk, yellow moderate, orange high, and red very high risk.*
> 
> *When a citizen clicks any cell — for example, near Sector 20 or Sector 35 — an instant popup reveals the nearest sector, normalized risk score (72/100), the underlying cause (drainage culvert proximity), and recommended safety actions.*
> 
> *Notice that switching modes preserves map position and zoom seamlessly."*

---

### Minute 1:30 – 2:15: Sector Search & Emergency Actions
**Speaker:**
> *"Finding your area takes 2 seconds. In the search box, typing **'Sector 20'** instantly highlights the sector, centers the map, and updates our live alert card above.*
> 
> *Right beneath the map, we provide three large, unambiguous emergency actions:*
> - **REQUEST HELP:** *A direct emergency SOS form.*
> - **REPORT FLOODING:** *Allows citizens to crowdsource waterlogging and road blockages with optional photo and GPS.*
> - **SAFETY GUIDELINES:** *(Click 'SAFETY GUIDELINES'). A structured guide detailing practical precautions Before, During, and After a flood.*
> 
> *Notice also our verified directory of Panvel Municipal Corporation (PMC) emergency helplines and elevated school relief shelters."*

---

### Minute 2:15 – 3:00: Offline-First Resilience & Live Demo Mode
**Speaker:**
> *"Disasters often knock out mobile networks. Let's demonstrate what happens when connectivity fails.*
> 
> *(Click the header network pill to toggle to OFFLINE, then navigate to HELP).*
> 
> *When a stranded citizen submits an emergency rescue request while offline, our Service Worker and IndexedDB store it safely on the device with an honest status: `SOS SAVED LOCALLY — WAITING FOR CONNECTION`. We never give false hope that help is on the way until the message actually leaves the phone.*
> 
> *(Click the network pill back to ONLINE).*
> *The moment signal returns, our background sync automatically transmits all queued requests.*
> 
> *Judges and evaluators can click **DEMO MODE** at any time to walk through an automated 8-stage interactive scenario showcasing normal baseline conditions through peak Kasadi river overflow."*
