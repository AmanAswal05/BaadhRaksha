/**
 * BaadhRaksha — Map Component for Kharghar, Navi Mumbai
 * 
 * Two Distinct Modes:
 * 1. NORMAL MAP (Default):
 *    - OpenStreetMap Leaflet layer
 *    - Actual roads, buildings, Kharghar landmarks
 *    - Sector markers & labels (Sector 7, 10, 12, 15, 19, 20, 21, 35, 36, Central Park, Railway Station, etc.)
 *    - Drainage & water features (Kasadi River, Kopra Nullah, Central Park Lake)
 *    - Clean, uncluttered design
 * 
 * 2. FLOOD RISK GRID MAP:
 *    - Grid-based flood risk visualization over Kharghar geographical map
 *    - Color-coded cells:
 *        Green = Lower modeled risk
 *        Yellow = Moderate modeled risk
 *        Orange = High modeled risk
 *        Red = Very high modeled risk
 *    - Clicking a cell opens small information popup:
 *        Area or nearest sector
 *        Risk category
 *        Risk score (0-100)
 *        Main contributing factors
 *        Recommended safety action
 *        DEMO DATA watermark notice
 *    - Small legend visible ONLY in Flood Risk Grid mode
 * 
 * Essential top controls:
 * - [ NORMAL MAP ] [ FLOOD RISK GRID ] switch
 * - Sector search input
 * - [ 🎯 My Location ] button
 * - Preserves zoom level & map position when switching modes
 */

import { state } from '../state.js';

let leafletMap = null;
let currentMapContainer = null;
let tileLayer = null;
let gridLayerGroup = null;
let drainageLayerGroup = null;
let sectorMarkerGroup = null;
let boundaryLayer = null;
let userLocationMarker = null;

const KHARGHAR_CENTER = [19.0380, 73.0670];
const KHARGHAR_DEFAULT_ZOOM = 13.5;

export function renderMapComponent() {
  const isHi = state.lang === 'hi';
  const mode = state.mapMode === 'grid' ? 'grid' : 'normal';

  return `
    <div class="flood-map-card">
      <!-- Minimal Map Header Controls -->
      <div class="map-top-bar">
        <!-- Switchable Layers: NORMAL MAP / FLOOD RISK GRID -->
        <div class="map-switcher-group" role="tablist">
          <button class="map-mode-btn ${mode === 'normal' ? 'active' : ''}" id="btn-map-normal" type="button">
            ${isHi ? 'सामान्य मानचित्र' : 'NORMAL MAP'}
          </button>
          <button class="map-mode-btn ${mode === 'grid' ? 'active' : ''}" id="btn-map-grid" type="button">
            ${isHi ? 'बाढ़ जोखिम ग्रिड' : 'FLOOD RISK GRID'}
          </button>
        </div>

        <!-- Right Side Controls: Search & My Location -->
        <div class="map-controls-row-right">
          <!-- Sector Search -->
          <div class="map-search-wrap">
            <input type="text" id="map-sector-search" class="map-search-input" 
                   placeholder="${isHi ? 'सेक्टर खोजें (उदा. Sector 20)...' : 'Search Kharghar sector (e.g. Sector 20)...'}" 
                   value="${state.searchQuery || ''}" autocomplete="off">
            <div id="map-search-suggestions" class="search-suggestions" style="display:none;"></div>
          </div>

          <!-- My Location Button -->
          <button type="button" id="btn-map-my-location" class="btn btn-sm btn-location" title="Find My Location">
            🎯 ${isHi ? 'मेरा स्थान' : 'My Location'}
          </button>
        </div>
      </div>

      <!-- Main Interactive Leaflet Map Canvas -->
      <div class="map-viewport-container" id="leaflet-map-canvas">
        <!-- Transparent Demo Watermark Tag -->
        <div class="map-sim-tag">
          DEMO DATA – Modeled Kharghar Flood Risk
        </div>

        <!-- Legend (Shown ONLY in FLOOD RISK GRID mode) -->
        <div class="map-legend ${mode === 'grid' ? 'visible' : 'hidden'}" id="map-grid-legend">
          <div class="legend-header">FLOOD RISK GRID</div>
          <div class="legend-row">
            <span class="legend-dot" style="background:#10b981;"></span>
            <span>${isHi ? 'कम आकलित जोखिम' : 'Lower modeled risk'} (0–24)</span>
          </div>
          <div class="legend-row">
            <span class="legend-dot" style="background:#eab308;"></span>
            <span>${isHi ? 'मध्यम आकलित जोखिम' : 'Moderate modeled risk'} (25–49)</span>
          </div>
          <div class="legend-row">
            <span class="legend-dot" style="background:#f97316;"></span>
            <span>${isHi ? 'उच्च आकलित जोखिम' : 'High modeled risk'} (50–74)</span>
          </div>
          <div class="legend-row">
            <span class="legend-dot" style="background:#ef4444;"></span>
            <span>${isHi ? 'अति उच्च आकलित जोखिम' : 'Very high modeled risk'} (75–100)</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initOrUpdateMap(container) {
  const mapEl = container.querySelector('#leaflet-map-canvas');
  if (!mapEl || typeof window.L === 'undefined') return;

  // If container changed or not yet initialized
  if (leafletMap && currentMapContainer !== mapEl) {
    try {
      leafletMap.remove();
    } catch (e) {
      console.warn('Map cleanup error:', e);
    }
    leafletMap = null;
    tileLayer = null;
    gridLayerGroup = null;
    drainageLayerGroup = null;
    sectorMarkerGroup = null;
    boundaryLayer = null;
    userLocationMarker = null;
  }

  if (!leafletMap) {
    currentMapContainer = mapEl;
    leafletMap = L.map(mapEl, {
      center: KHARGHAR_CENTER,
      zoom: KHARGHAR_DEFAULT_ZOOM,
      minZoom: 12,
      maxZoom: 17,
      zoomControl: true,
      attributionControl: false
    });

    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(leafletMap);

    drainageLayerGroup = L.layerGroup().addTo(leafletMap);
    gridLayerGroup = L.layerGroup().addTo(leafletMap);
    sectorMarkerGroup = L.layerGroup().addTo(leafletMap);

    // Initial resize trigger
    window.addEventListener('resize', () => {
      if (leafletMap) leafletMap.invalidateSize();
    });
  }

  setTimeout(() => {
    if (leafletMap) {
      leafletMap.invalidateSize();
      updateMapLayers();
    }
  }, 60);

  updateMapLayers();
}

export function updateMapLayers() {
  if (!leafletMap) return;

  const mode = state.mapMode === 'grid' ? 'grid' : 'normal';
  const selectedSector = state.getSelectedDistrict();

  // 1. Render Boundary Layer if available
  if (boundaryLayer) {
    try {
      leafletMap.removeLayer(boundaryLayer);
    } catch (e) {}
    boundaryLayer = null;
  }

  if (state.khargharBoundaryGeoJSON) {
    boundaryLayer = L.geoJSON(state.khargharBoundaryGeoJSON, {
      style: {
        color: '#0284c7',
        weight: 2,
        dashArray: '4, 4',
        fillColor: '#38bdf8',
        fillOpacity: 0.04
      }
    }).addTo(leafletMap);
  }

  // 2. Render Drainage Features (Rivers / Nullahs)
  if (drainageLayerGroup) {
    drainageLayerGroup.clearLayers();
    if (Array.isArray(state.rivers)) {
      state.rivers.forEach(r => {
        const polyline = L.polyline(r.coordinates, {
          color: r.riskCategory === 'HIGH' ? '#0284c7' : '#0369a1',
          weight: r.name.includes('Kasadi') ? 5 : 3.5,
          opacity: 0.85
        });
        polyline.bindPopup(`
          <div style="font-family:inherit; font-size:13px; line-height:1.4;">
            <strong>🌊 ${state.lang === 'hi' ? r.nameHi : r.name}</strong><br>
            <span>${r.type}</span><br>
            <small style="color:#64748b;">${r.description}</small>
          </div>
        `);
        polyline.addTo(drainageLayerGroup);
      });
    }
  }

  // 3. Render Sector & Landmark Markers
  if (sectorMarkerGroup) {
    sectorMarkerGroup.clearLayers();
    state.districts.forEach(sec => {
      const isSelected = sec.id === selectedSector.id;
      const score = sec.assessment?.score || sec.baseRisk || 30;
      let color = '#10b981';
      if (score >= 75) color = '#ef4444';
      else if (score >= 50) color = '#f97316';
      else if (score >= 25) color = '#eab308';

      const markerHtml = `
        <div class="kharghar-sector-pin ${isSelected ? 'selected' : ''}" style="border-color:${color};">
          <span class="pin-badge" style="background:${color};"></span>
          <span class="pin-name">${state.lang === 'hi' ? sec.nameHi : sec.name}</span>
        </div>
      `;

      const icon = L.divIcon({
        className: 'sector-pin-wrapper',
        html: markerHtml,
        iconSize: [110, 30],
        iconAnchor: [55, 15]
      });

      const marker = L.marker([sec.lat, sec.lon], { icon });
      marker.on('click', () => {
        state.setSelectedDistrict(sec.id);
      });

      marker.bindPopup(`
        <div style="font-family:inherit; font-size:13px; line-height:1.4;">
          <strong>📍 ${sec.name} (${sec.region})</strong><br>
          Modeled Risk: <strong style="color:${color};">${score}/100</strong><br>
          <p style="margin:4px 0 2px; font-size:12px; color:#475569;">${sec.reasonForRisk}</p>
          <div style="margin-top:4px; font-size:11px; color:#0369a1;"><strong>Action:</strong> ${sec.action}</div>
          <small style="display:block; margin-top:4px; color:#94a3b8; font-size:10px;">DEMO DATA – Modeled index</small>
        </div>
      `);

      marker.addTo(sectorMarkerGroup);
    });
  }

  // 4. Render FLOOD RISK GRID MAP
  if (gridLayerGroup) {
    gridLayerGroup.clearLayers();
  }

  // Show grid cells ONLY if in 'grid' mode
  const legendEl = document.getElementById('map-grid-legend');
  if (legendEl) {
    if (mode === 'grid') {
      legendEl.className = 'map-legend visible';
    } else {
      legendEl.className = 'map-legend hidden';
    }
  }

  if (mode === 'grid' && state.gridCells && state.gridCells.length > 0) {
    state.gridCells.forEach(cell => {
      const score = cell.currentRiskScore !== undefined ? cell.currentRiskScore : cell.riskScore;
      let color = '#10b981';
      let category = 'LOWER RISK';
      if (score >= 75) {
        color = '#ef4444'; // Red
        category = 'VERY HIGH';
      } else if (score >= 50) {
        color = '#f97316'; // Orange
        category = 'HIGH';
      } else if (score >= 25) {
        color = '#eab308'; // Yellow
        category = 'MODERATE';
      }

      const rect = L.rectangle(cell.bounds, {
        color: color,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.42,
        className: 'grid-risk-rect'
      });

      rect.on('mouseover', function () {
        this.setStyle({ weight: 2.5, fillOpacity: 0.65 });
      });
      rect.on('mouseout', function () {
        this.setStyle({ weight: 1, fillOpacity: 0.42 });
      });

      // Information popup requirement:
      // Area or nearest sector
      // Risk category
      // Risk score from 0–100
      // Main contributing factors, if known
      // Recommended safety action
      const popupContent = `
        <div class="grid-popup-content">
          <div class="grid-popup-head">
            <strong>Area: Kharghar ${cell.nearestSectorName}</strong>
            <span class="grid-popup-badge" style="background:${color}; color:#fff;">${category}</span>
          </div>
          <div class="grid-popup-row">
            <span>Risk score:</span>
            <strong>${score}/100</strong>
          </div>
          <div class="grid-popup-section">
            <strong>Reason:</strong>
            <p>${cell.factors || 'Illustrative rainfall and drainage scenario.'}</p>
          </div>
          <div class="grid-popup-section">
            <strong>Action:</strong>
            <p>${cell.recommendedAction || 'Avoid waterlogged roads and monitor official alerts.'}</p>
          </div>
          <div class="grid-popup-footer">
            <small>DEMO DATA – Not an official forecast</small>
          </div>
        </div>
      `;

      rect.bindPopup(popupContent, {
        maxWidth: 260,
        className: 'grid-cell-leaflet-popup'
      });

      rect.addTo(gridLayerGroup);
    });
  }

  // Pan to selected sector if explicitly switched
  if (selectedSector && selectedSector.lat && selectedSector.lon) {
    try {
      const bounds = leafletMap.getBounds();
      if (!bounds.contains([selectedSector.lat, selectedSector.lon])) {
        leafletMap.panTo([selectedSector.lat, selectedSector.lon], { animate: true, duration: 0.4 });
      }
    } catch (e) {}
  }
}

export function bindMapEvents(container) {
  initOrUpdateMap(container);

  const btnNormal = container.querySelector('#btn-map-normal');
  const btnGrid = container.querySelector('#btn-map-grid');

  if (btnNormal) {
    btnNormal.addEventListener('click', () => {
      state.setMapMode('normal');
      updateMapLayers();
    });
  }

  if (btnGrid) {
    btnGrid.addEventListener('click', () => {
      state.setMapMode('grid');
      updateMapLayers();
    });
  }

  // My Location feature
  const locBtn = container.querySelector('#btn-map-my-location');
  if (locBtn) {
    locBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        locBtn.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude;
            const userLon = pos.coords.longitude;
            setUserLocationPin(userLat, userLon, 'Your Location');
            locBtn.innerHTML = `🎯 My Location`;
          },
          () => {
            // Simulated Kharghar location (Sector 20 default)
            setUserLocationPin(19.0485, 73.0625, 'Simulated: Sector 20');
            locBtn.innerHTML = `🎯 Sector 20`;
          },
          { timeout: 3500 }
        );
      } else {
        setUserLocationPin(19.0485, 73.0625, 'Simulated: Sector 20');
      }
    });
  }

  function setUserLocationPin(lat, lon, label) {
    if (!leafletMap) return;
    if (userLocationMarker) {
      leafletMap.removeLayer(userLocationMarker);
    }
    const icon = L.divIcon({
      className: 'user-location-pin',
      html: `<div class="user-pulse-marker" title="${label}">📍</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    userLocationMarker = L.marker([lat, lon], { icon }).addTo(leafletMap);
    userLocationMarker.bindPopup(`<strong>${label}</strong><br>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`).openPopup();
    leafletMap.setView([lat, lon], 15, { animate: true });
  }

  // Sector Search
  const searchInput = container.querySelector('#map-sector-search');
  const suggestionsBox = container.querySelector('#map-search-suggestions');

  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      state.searchQuery = e.target.value;

      if (!q) {
        suggestionsBox.style.display = 'none';
        return;
      }

      const matches = state.districts.filter(d => 
        d.name.toLowerCase().includes(q) || (d.nameHi && d.nameHi.includes(q))
      );

      if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(d => `
          <div class="search-item" data-id="${d.id}">
            <div>
              <strong>${state.lang === 'hi' ? d.nameHi : d.name}</strong>
              <small style="color:#64748b; margin-left:6px;">${d.type}</small>
            </div>
            <span class="badge ${d.assessment?.badgeClass || 'badge-medium'}">${d.assessment?.score || d.baseRisk}/100</span>
          </div>
        `).join('');
        suggestionsBox.style.display = 'block';

        suggestionsBox.querySelectorAll('.search-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            state.setSelectedDistrict(id);
            suggestionsBox.style.display = 'none';
            searchInput.value = '';
            // Center map on sector
            const found = state.districts.find(d => d.id === id);
            if (found && leafletMap) {
              leafletMap.setView([found.lat, found.lon], 15, { animate: true });
            }
          });
        });
      } else {
        suggestionsBox.innerHTML = `<div class="search-item text-muted">No Kharghar sector found</div>`;
        suggestionsBox.style.display = 'block';
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });
  }
}
