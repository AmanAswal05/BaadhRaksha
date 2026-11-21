/**
 * BaadhRaksha — Central Reactive State Store for Kharghar, Navi Mumbai
 */

import { db } from './db.js';
import { evaluateDistrictRisk, getRiskLevel } from './risk/engine.js';
import { networkService } from './services/network.js';

class StateStore {
  constructor() {
    this.currentView = 'home'; // 'home' | 'alerts' | 'help' | 'report'
    this.lang = 'en'; // 'en' | 'hi'
    this.mapMode = 'normal'; // 'normal' | 'grid' (FLOOD RISK GRID MAP)
    this.districts = []; // Kharghar sectors & landmarks
    this.gridCells = []; // Grid risk cells
    this.gridGeoJSON = null;
    this.khargharBoundaryGeoJSON = null;
    this.rivers = []; // Drainage channels & water bodies
    this.selectedDistrictId = 'sector-20'; // Default Kharghar focus
    this.searchQuery = '';
    this.activeGridPopupCell = null;

    // Entities
    this.shelters = [];
    this.citizenReports = [];
    this.alerts = [];
    this.rescueRequests = [];

    // Filter on Alerts page
    this.alertFilter = 'ALL'; // 'ALL' | 'SEVERE' | 'WARNING' | 'WATCH'

    // Simulation / Demo Mode
    this.demoModeActive = false;
    this.guidedDemo = { active: false, step: 1, totalSteps: 8 };
    this.demoCurrentStep = 1;
    this.demoTotalSteps = 8;
    this.simulation = {
      active: false,
      stageIndex: 2, // Realistic active rainfall scenario
      totalStages: 4,
      timelineEvents: []
    };

    // Modals
    this.showSafetyGuidelinesModal = false;

    this.listeners = new Set();
  }

  async loadInitialData() {
    try {
      const [distRes, shRes, repRes, timeRes, gridGeoRes, gridDataRes, boundRes, rivRes] = await Promise.all([
        fetch('./data/districts.json').then(r => r.json()),
        fetch('./data/shelters.json').then(r => r.json()),
        fetch('./data/reports.json').then(r => r.json()),
        fetch('./data/timeline.json').then(r => r.json()),
        fetch('./data/kharghar_grid.geojson').then(r => r.json()).catch(() => null),
        fetch('./data/grid_risk.json').then(r => r.json()).catch(() => []),
        fetch('./data/kharghar_boundary.geojson').then(r => r.json()).catch(() => null),
        fetch('./data/rivers.json').then(r => r.json()).catch(() => [])
      ]);

      this.districts = distRes;
      this.shelters = shRes;
      this.citizenReports = repRes;
      this.simulation.timelineEvents = timeRes;
      this.gridGeoJSON = gridGeoRes;
      this.gridCells = gridDataRes;
      this.khargharBoundaryGeoJSON = boundRes;
      this.rivers = rivRes;

      // IndexedDB saved requests & reports
      const [savedRequests, savedReports] = await Promise.all([
        db.getAll('rescueRequests').catch(() => []),
        db.getAll('citizenReports').catch(() => [])
      ]);

      if (savedRequests && savedRequests.length > 0) {
        this.rescueRequests = savedRequests;
      }
      if (savedReports && savedReports.length > 0) {
        const existingIds = new Set(this.citizenReports.map(r => r.id));
        savedReports.forEach(r => {
          if (!existingIds.has(r.id)) this.citizenReports.unshift(r);
        });
      }

      this.recalculateAllRisks();
      this.notify();
    } catch (err) {
      console.error('Failed to load initial Kharghar data:', err);
    }
  }

  setView(view) {
    if (['home', 'alerts', 'help', 'report'].includes(view)) {
      this.currentView = view;
      this.notify();
    }
  }

  setLanguage(lang) {
    if (lang === 'en' || lang === 'hi') {
      this.lang = lang;
      this.notify();
    }
  }

  setMapMode(mode) {
    if (['normal', 'grid', 'real', 'thermal'].includes(mode)) {
      // Map legacy modes if triggered
      if (mode === 'real') mode = 'normal';
      if (mode === 'thermal') mode = 'grid';
      this.mapMode = mode;
      this.notify();
    }
  }

  setSelectedDistrict(id) {
    const found = this.districts.find(d => d.id === id);
    if (found) {
      this.selectedDistrictId = id;
      this.notify();
    }
  }

  getSelectedDistrict() {
    return this.districts.find(d => d.id === this.selectedDistrictId) || this.districts[0] || {};
  }

  recalculateAllRisks() {
    const stageEvent = this.simulation.timelineEvents[this.simulation.stageIndex] || {};
    const mods = stageEvent.modifications || {};

    this.districts = this.districts.map(dist => {
      const assessment = evaluateDistrictRisk(dist, mods);
      return {
        ...dist,
        assessment
      };
    });

    // Also update grid cells dynamically based on simulation multiplier
    if (this.gridCells && this.gridCells.length > 0) {
      const rainMult = mods.rainfallMult || 1.0;
      this.gridCells.forEach(cell => {
        const baseScore = cell.riskScore;
        const adjustedScore = Math.min(99, Math.max(5, Math.round(baseScore * (0.8 + 0.3 * rainMult))));
        cell.currentRiskScore = adjustedScore;
        const levelObj = getRiskLevel(adjustedScore);
        cell.currentCategory = levelObj.key === 'SEVERE' ? 'VERY HIGH' : levelObj.key;
        cell.currentColor = levelObj.color;
      });
    }

    this.generateDynamicAlerts();
  }

  generateDynamicAlerts() {
    const stageEvent = this.simulation.timelineEvents[this.simulation.stageIndex] || {};
    const hour = stageEvent.hour || 12;

    const severeDistricts = this.districts.filter(d => (d.assessment?.level === 'SEVERE'));
    const highDistricts = this.districts.filter(d => (d.assessment?.level === 'HIGH'));
    const moderateDistricts = this.districts.filter(d => (d.assessment?.level === 'MODERATE'));

    const newAlerts = [];

    // VERY HIGH (SEVERE) alerts
    severeDistricts.forEach(d => {
      newAlerts.push({
        id: `alt-${d.id}-sev`,
        severity: 'SEVERE',
        category: 'VERY HIGH',
        districtId: d.id,
        district: d.name,
        districtHi: d.nameHi,
        time: '10 mins ago',
        expectedWindow: `Next ${Math.max(6, 24 - hour)} hours`,
        reason: `${d.reasonForRisk} Modeled flood depth exceeds 0.5m.`,
        reasonHi: `${d.reasonForRisk} आकलित पाण्याचा साठा ०.५ मीटरहून अधिक असू शकतो.`,
        action: d.action || 'Avoid waterlogged internal roads and follow official municipal alerts.',
        actionHi: 'जलमय रस्त्यांवर जाणे टाळा व महापालिकेच्या सूचनांचे पालन करा.'
      });
    });

    // HIGH alerts
    highDistricts.forEach(d => {
      newAlerts.push({
        id: `alt-${d.id}-high`,
        severity: 'WARNING',
        category: 'HIGH',
        districtId: d.id,
        district: d.name,
        districtHi: d.nameHi,
        time: '30 mins ago',
        expectedWindow: `Next 12–24 hours`,
        reason: `${d.reasonForRisk} Storm runoff approaching culvert capacity.`,
        reasonHi: `${d.reasonForRisk} पावसाळी पाण्याच्या नाल्यांची क्षमता मर्यादेत.`,
        action: d.action || 'Drive cautiously and stay clear of stormwater drains.',
        actionHi: 'सावधगिरीने प्रवास करा आणि उघड्या गटारांपासून दूर राहा.'
      });
    });

    // MODERATE alerts
    moderateDistricts.forEach(d => {
      newAlerts.push({
        id: `alt-${d.id}-watch`,
        severity: 'WATCH',
        category: 'MODERATE',
        districtId: d.id,
        district: d.name,
        districtHi: d.nameHi,
        time: '1 hour ago',
        expectedWindow: 'Next 24–48 hours',
        reason: `Urban runoff monitored. Surface pooling possible in basement ramps and roadside depressions.`,
        reasonHi: `नागरी जलवाहिन्यांवर लक्ष ठेवले जात आहे. सखल भागात किरकोळ पाणी साचू शकते.`,
        action: d.action || 'Keep residential building drainage channels clear.',
        actionHi: 'इमारतीचे सांडपाणी नाले स्वच्छ ठेवा.'
      });
    });

    this.alerts = newAlerts;
  }

  async addRescueRequest(req) {
    const isOnline = networkService.getState() === 'NORMAL';
    const newReq = {
      ...req,
      id: 'sos-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      syncStatus: isOnline ? 'Delivered' : 'Queued'
    };

    this.rescueRequests.unshift(newReq);
    await db.put('rescueRequests', newReq);
    this.notify();
    return newReq;
  }

  async addCitizenReport(rep) {
    const isOnline = networkService.getState() === 'NORMAL';
    const newRep = {
      ...rep,
      id: 'rep-' + Date.now(),
      timestamp: 'Just now',
      syncStatus: isOnline ? 'Delivered' : 'Queued'
    };

    this.citizenReports.unshift(newRep);
    await db.put('citizenReports', newRep);
    this.notify();
    return newRep;
  }

  async syncQueuedRequests() {
    let synced = 0;
    const queuedReqs = this.rescueRequests.filter(r => r.syncStatus === 'Queued');
    for (const r of queuedReqs) {
      r.syncStatus = 'Delivered';
      await db.put('rescueRequests', r);
      synced++;
    }

    const queuedReps = this.citizenReports.filter(r => r.syncStatus === 'Queued');
    for (const r of queuedReps) {
      r.syncStatus = 'Delivered';
      await db.put('citizenReports', r);
      synced++;
    }

    this.notify();
    return synced;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this);
      } catch (e) {
        console.error('State subscriber error:', e);
      }
    });
  }
}

export const state = new StateStore();
