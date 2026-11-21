/**
 * BaadhRaksha — Main Application Entry & Simplified Router
 * Redesigned for Kharghar, Navi Mumbai, Maharashtra
 */

import { state } from './state.js';
import { networkService } from './services/network.js';
import * as demoModule from './simulation/demo.js';
const demoController = demoModule.demoController || demoModule.guidedDemoController;
const DEMO_STEPS = demoModule.DEMO_STEPS || demoModule.DEMO_STAGES || demoModule.GUIDED_STEPS;
import { renderMapComponent, bindMapEvents } from './ui/map.js';
import { renderAlertsPage, bindAlertsEvents } from './ui/alerts.js?v=7.0.0';
import { renderHelpPage, bindHelpEvents } from './ui/help.js?v=7.0.0';
import { renderReportsPage, bindReportsEvents } from './ui/reports.js?v=7.0.0';

class App {
  constructor() {
    this.root = document.getElementById('app-root');
    this.init();
  }

  async init() {
    // 1. Unregister any stale Service Worker and clear old cache for instant update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (let reg of regs) {
          reg.update();
        }
      });
      navigator.serviceWorker.register('./sw.js?v=7.0.0')
        .then(reg => console.log('BaadhRaksha Kharghar PWA SW active:', reg.scope))
        .catch(err => console.warn('SW failed:', err));
    }

    // 2. Load data
    await state.loadInitialData();

    // 3. Subscriptions
    state.subscribe(() => this.render());
    networkService.subscribe(() => this.render());

    // 4. Initial bindings
    this.bindHeaderEvents();
    this.render();
  }

  bindHeaderEvents() {
    // Demo Mode toggle button in header
    const demoBtn = document.getElementById('btn-header-demo');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        if (state.demoModeActive) {
          demoController.exit();
        } else {
          state.demoModeActive = true;
          demoController.start();
        }
      });
    }

    // Language toggle
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const next = state.lang === 'en' ? 'hi' : 'en';
        state.setLanguage(next);
        langBtn.textContent = next === 'en' ? 'हिन्दी' : 'English';
      });
    }

    // Network status simulator toggle
    const netPill = document.getElementById('header-network-pill');
    if (netPill) {
      netPill.addEventListener('click', () => {
        const curr = networkService.getState();
        const next = curr === 'NORMAL' ? 'OFFLINE' : 'NORMAL';
        networkService.setState(next);
        if (next === 'NORMAL') {
          state.syncQueuedRequests();
        }
      });
    }
  }

  render() {
    const isHi = state.lang === 'hi';
    const netState = networkService.getState();
    const netInfo = networkService.getStateInfo();

    // Update Header Pill
    const netPill = document.getElementById('header-network-pill');
    if (netPill) {
      netPill.className = `network-pill ${netState.toLowerCase()}`;
      netPill.textContent = `● ${netInfo.badgeText}`;
      netPill.title = "Click to toggle Online/Offline simulation";
    }

    // Update Header Demo button text
    const demoBtn = document.getElementById('btn-header-demo');
    if (demoBtn) {
      demoBtn.className = `btn btn-sm ${state.demoModeActive ? 'btn-danger' : 'btn-outline-primary'}`;
      demoBtn.textContent = state.demoModeActive ? '✕ EXIT DEMO' : 'DEMO MODE';
    }

    // Render Navigation & Content
    this.root.innerHTML = `
      <!-- SIMULATION MODE STRIP (Visible only when DEMO MODE is active) -->
      ${state.demoModeActive ? this.renderDemoToolbar(isHi) : ''}

      <!-- MAIN PAGE CONTENT ROUTER -->
      <main class="page-viewport" id="page-viewport">
        ${this.renderCurrentView()}
      </main>

      <!-- SIMPLE NAVIGATION BAR (Desktop Top/Sub + Mobile Bottom Navigation) -->
      ${this.renderNavigationBar(isHi)}

      <!-- SAFETY GUIDELINES MODAL -->
      ${state.showSafetyGuidelinesModal ? this.renderSafetyGuidelinesModal(isHi) : ''}
    `;

    // Bind view-specific events
    this.bindNavigationEvents();
    if (state.demoModeActive) this.bindDemoToolbarEvents();
    if (state.showSafetyGuidelinesModal) this.bindModalEvents();

    if (state.currentView === 'home') {
      this.bindHomeEvents();
      bindMapEvents(this.root);
    } else if (state.currentView === 'alerts') {
      bindAlertsEvents(this.root);
    } else if (state.currentView === 'help') {
      bindHelpEvents(this.root);
    } else if (state.currentView === 'report') {
      bindReportsEvents(this.root);
    }
  }

  renderNavigationBar(isHi) {
    const v = state.currentView;
    return `
      <nav class="app-bottom-nav" id="app-bottom-nav" aria-label="Main Navigation">
        <button class="nav-item ${v === 'home' ? 'active' : ''}" data-view="home">
          <span class="nav-icon">🏠</span>
          <span class="nav-label">${isHi ? 'होम' : 'HOME'}</span>
        </button>
        <button class="nav-item ${v === 'alerts' ? 'active' : ''}" data-view="alerts">
          <span class="nav-icon">⚠️</span>
          <span class="nav-label">${isHi ? 'चेतावनियाँ' : 'ALERTS'}</span>
          ${state.alerts.length > 0 ? `<span class="nav-badge">${state.alerts.length}</span>` : ''}
        </button>
        <button class="nav-item ${v === 'help' ? 'active' : ''}" data-view="help">
          <span class="nav-icon">🆘</span>
          <span class="nav-label">${isHi ? 'मदद' : 'HELP'}</span>
        </button>
        <button class="nav-item ${v === 'report' ? 'active' : ''}" data-view="report">
          <span class="nav-icon">📢</span>
          <span class="nav-label">${isHi ? 'रिपोर्ट' : 'REPORT'}</span>
        </button>
      </nav>
    `;
  }

  renderCurrentView() {
    switch (state.currentView) {
      case 'alerts': return renderAlertsPage();
      case 'help': return renderHelpPage();
      case 'report': return renderReportsPage();
      case 'home':
      default:
        return this.renderHomePage();
    }
  }

  /**
   * USER-FRIENDLY HOMEPAGE LAYOUT:
   * 1. Header (in index.html)
   * 2. Main Alert Card (Current risk status, selected area, last updated time, 1 short explanation, 1 recommended action)
   * 3. Flood Map (Normal Map & Flood Risk Grid switch)
   * 4. Emergency Actions (Only three primary actions: REQUEST HELP, REPORT FLOODING, SAFETY GUIDELINES)
   * 5. Local Flood Information (Number of high-risk grid cells, Current modeled risk level, Last updated time, Active alert status)
   */
  renderHomePage() {
    const isHi = state.lang === 'hi';
    const selectedDist = state.getSelectedDistrict();
    const stageEvent = state.simulation.timelineEvents[state.simulation.stageIndex] || state.simulation.timelineEvents[0] || {};
    const riskLevel = selectedDist.assessment?.level || 'HIGH';
    
    // Count high-risk and very-high risk grid cells
    const highRiskCellCount = (state.gridCells || []).filter(c => {
      const s = c.currentRiskScore !== undefined ? c.currentRiskScore : c.riskScore;
      return s >= 50;
    }).length;

    const riskBadgeText = riskLevel === 'SEVERE' 
      ? (isHi ? 'अति उच्च आकलित जोखिम' : 'VERY HIGH MODELED RISK')
      : riskLevel === 'HIGH' 
      ? (isHi ? 'उच्च आकलित जोखिम' : 'HIGH MODELED RISK')
      : riskLevel === 'MODERATE' 
      ? (isHi ? 'मध्यम आकलित जोखिम' : 'MODERATE MODELED RISK')
      : (isHi ? 'कम आकलित जोखिम' : 'LOWER MODELED RISK');

    return `
      <div class="homepage-container">
        
        <!-- TRANSPARENT NOTICE STRIP -->
        <div class="demo-transparency-strip">
          <span>ℹ️ <strong>DEMO MODE</strong> – Flood risk values are illustrative and are not official forecasts.</span>
        </div>

        <!-- 1. MAIN ALERT CARD -->
        <section class="home-section-alert">
          <div class="current-alert-card alert-risk-${riskLevel.toLowerCase()}">
            <div class="alert-top-row">
              <span class="alert-level-badge badge-${riskLevel.toLowerCase()}">
                ⚠️ ${riskBadgeText}
              </span>
              <span class="sim-pill">DEMO DATA</span>
            </div>

            <h2 class="alert-location-title">
              📍 Kharghar ${isHi ? selectedDist.nameHi : selectedDist.name}, Navi Mumbai
            </h2>

            <div class="alert-meta-line">
              <span>🕒 Last updated: <strong>Just now (Live simulation)</strong></span>
            </div>

            <p class="alert-explanation">
              ${selectedDist.reasonForRisk || 'Urban drainage corridor and hill runoff may cause water accumulation during high rainfall.'}
            </p>

            <div class="alert-action-highlight">
              <strong>Recommended Action:</strong>
              <span>${selectedDist.action || 'Avoid waterlogged internal roads and monitor official civic alerts.'}</span>
            </div>

            <button class="btn btn-outline alert-safety-btn" id="btn-view-safety">
              [ VIEW SAFETY GUIDELINES ]
            </button>
          </div>
        </section>

        <!-- 2. FLOOD MAP (Normal Map and Flood Risk Grid Switch) -->
        <section class="home-section-map">
          ${renderMapComponent()}
        </section>

        <!-- 3. EMERGENCY ACTIONS (Only Three Primary Actions) -->
        <section class="home-section-actions">
          <div class="action-buttons-group">
            <button class="btn btn-emergency action-big-btn" id="btn-home-request-help">
              <span class="btn-icon-large">🆘</span>
              <div class="btn-text-wrap">
                <strong>REQUEST HELP</strong>
                <small>Emergency SOS Assistance</small>
              </div>
            </button>

            <button class="btn btn-primary action-big-btn" id="btn-home-report-flooding">
              <span class="btn-icon-large">📢</span>
              <div class="btn-text-wrap">
                <strong>REPORT FLOODING</strong>
                <small>Waterlogging & Blockages</small>
              </div>
            </button>

            <button class="btn btn-secondary action-big-btn" id="btn-home-safety-guide">
              <span class="btn-icon-large">📋</span>
              <div class="btn-text-wrap">
                <strong>SAFETY GUIDELINES</strong>
                <small>Before, During & After Flood</small>
              </div>
            </button>
          </div>
        </section>

        <!-- 4. LOCAL FLOOD INFORMATION (Only 4 Clean Metrics) -->
        <section class="home-section-health">
          <div class="flood-health-card">
            <div class="health-header">
              <span class="health-title">LOCAL KHARGHAR FLOOD METRICS</span>
              <span class="health-status-badge badge-${riskLevel.toLowerCase()}">
                ${riskBadgeText}
              </span>
            </div>

            <div class="health-stats-row">
              <div class="health-stat">
                <span class="stat-lbl">High-Risk Grid Cells:</span>
                <strong class="stat-val stat-danger">${highRiskCellCount}</strong>
              </div>
              <div class="health-stat">
                <span class="stat-lbl">Current Modeled Risk:</span>
                <strong class="stat-val">${selectedDist.assessment?.score || selectedDist.baseRisk || 50}/100</strong>
              </div>
              <div class="health-stat">
                <span class="stat-lbl">Last Updated Time:</span>
                <strong class="stat-val">Just now</strong>
              </div>
              <div class="health-stat">
                <span class="stat-lbl">Active Alert Status:</span>
                <strong class="stat-val stat-warning">${state.alerts.length} Active Notice${state.alerts.length === 1 ? '' : 's'}</strong>
              </div>
            </div>

            <div class="health-footnote">
              <small>* DEMO MODE – Values are generated from illustrative local hydrology & drainage models.</small>
            </div>
          </div>
        </section>

      </div>
    `;
  }

  renderDemoToolbar(isHi) {
    const curStep = (state.guidedDemo && state.guidedDemo.step) || state.demoCurrentStep || 1;
    const total = DEMO_STEPS.length;
    const curObj = DEMO_STEPS[curStep - 1] || DEMO_STEPS[0] || {};
    const title = isHi ? (curObj.titleHi || curObj.name) : (curObj.titleEn || curObj.name || curObj.title);
    const desc = isHi ? (curObj.descHi || curObj.desc) : (curObj.descEn || curObj.desc);

    return `
      <div class="demo-toolbar" id="demo-toolbar">
        <div class="demo-bar-top">
          <div class="demo-title-wrap">
            <span class="demo-tag">DEMO MODE</span>
            <span class="demo-counter">Scenario ${curStep} of ${total}</span>
            <strong class="demo-name">${title}</strong>
          </div>
          <button class="demo-close-btn" id="btn-demo-exit" title="Exit Demo">✕</button>
        </div>
        <p class="demo-desc">${desc}</p>
        <div class="demo-controls-row">
          <div class="demo-step-chips">
            ${DEMO_STEPS.map((s) => `
              <button class="demo-chip ${s.step === curStep ? 'active' : ''}" data-step="${s.step}">
                ${s.step}
              </button>
            `).join('')}
          </div>
          <div class="demo-nav-btns">
            <button class="btn btn-sm btn-outline" id="btn-demo-prev" ${curStep === 1 ? 'disabled' : ''}>← Prev</button>
            <button class="btn btn-sm btn-primary" id="btn-demo-next">
              ${curStep === total ? 'Restart Demo ↺' : 'Next Scenario →'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * SAFETY GUIDELINES: Before, During, After a flood
   * Short instructions, icons, simple language
   */
  renderSafetyGuidelinesModal(isHi) {
    return `
      <div class="modal-backdrop" id="guidelines-modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <h3>📋 ${isHi ? 'पूर सुरक्षा मार्गदर्शिका' : 'Kharghar Flood Safety Guidelines'}</h3>
            <button class="btn-close" id="btn-close-guidelines">✕</button>
          </div>
          <div class="modal-body guidelines-container">
            
            <!-- BEFORE A FLOOD -->
            <div class="guideline-block">
              <h4 class="guide-phase-title"><span class="guide-phase-icon">🟡</span> BEFORE A FLOOD</h4>
              <ul class="guide-list">
                <li><strong>Clear Drains:</strong> Keep building compound and stilt drainage gratings free of plastic and leaves.</li>
                <li><strong>Elevate Essentials:</strong> Store important documents, battery power banks, and medicines on upper shelves.</li>
                <li><strong>Prepare Emergency Kit:</strong> Keep bottled water, non-perishable snacks, a torch, and first-aid supplies handy.</li>
                <li><strong>Identify Shelters:</strong> Know your sector's nearest elevated school or community hall.</li>
              </ul>
            </div>

            <!-- DURING A FLOOD -->
            <div class="guideline-block">
              <h4 class="guide-phase-title"><span class="guide-phase-icon">🔴</span> DURING A FLOOD</h4>
              <ul class="guide-list">
                <li><strong>Never Walk or Drive in Floodwaters:</strong> Just 6 inches of moving water can sweep you off your feet, and 12 inches can float cars.</li>
                <li><strong>Disconnect Power:</strong> Switch off main circuit breakers immediately if water enters your home or basement.</li>
                <li><strong>Avoid Underpasses:</strong> Stay away from the Kharghar Railway Station subway and low-lying highway underpasses.</li>
                <li><strong>Stay High & Call 112:</strong> Move to higher floors and send an SOS request or call emergency numbers.</li>
              </ul>
            </div>

            <!-- AFTER A FLOOD -->
            <div class="guideline-block">
              <h4 class="guide-phase-title"><span class="guide-phase-icon">🟢</span> AFTER A FLOOD</h4>
              <ul class="guide-list">
                <li><strong>Beware of Fallen Wires:</strong> Avoid downed power cables and standing pools of water near utility poles.</li>
                <li><strong>Boil Drinking Water:</strong> Contamination is common after sewer overflow; drink only boiled or filtered water.</li>
                <li><strong>Inspect Buildings:</strong> Check for electrical shorts or foundation damage before turning power back on.</li>
                <li><strong>Report Blockages:</strong> Submit photos of clogged storm drains to civic authorities via the Report feature.</li>
              </ul>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" id="btn-dismiss-guidelines">${isHi ? 'समजले / बंद करा' : 'Understood / Close'}</button>
          </div>
        </div>
      </div>
    `;
  }

  bindNavigationEvents() {
    const navItems = this.root.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetView = item.getAttribute('data-view');
        state.setView(targetView);
      });
    });
  }

  bindHomeEvents() {
    // Safety Instructions button on Alert
    const safetyBtn = this.root.querySelector('#btn-view-safety');
    if (safetyBtn) {
      safetyBtn.addEventListener('click', () => {
        state.showSafetyGuidelinesModal = true;
        this.render();
      });
    }

    // Emergency Action Button 1: REQUEST HELP
    const reqHelpBtn = this.root.querySelector('#btn-home-request-help');
    if (reqHelpBtn) {
      reqHelpBtn.addEventListener('click', () => {
        state.setView('help');
      });
    }

    // Emergency Action Button 2: SAFETY GUIDELINES
    const guideBtn = this.root.querySelector('#btn-home-safety-guide');
    if (guideBtn) {
      guideBtn.addEventListener('click', () => {
        state.showSafetyGuidelinesModal = true;
        this.render();
      });
    }

    // Emergency Action Button 3: REPORT FLOODING
    const repFloodBtn = this.root.querySelector('#btn-home-report-flooding');
    if (repFloodBtn) {
      repFloodBtn.addEventListener('click', () => {
        state.setView('report');
      });
    }
  }

  bindDemoToolbarEvents() {
    const exitBtn = this.root.querySelector('#btn-demo-exit');
    if (exitBtn) exitBtn.addEventListener('click', () => demoController.exit());

    const prevBtn = this.root.querySelector('#btn-demo-prev');
    if (prevBtn) prevBtn.addEventListener('click', () => demoController.prev());

    const nextBtn = this.root.querySelector('#btn-demo-next');
    if (nextBtn) nextBtn.addEventListener('click', () => demoController.next());

    const chips = this.root.querySelectorAll('.demo-chip');
    chips.forEach(c => {
      c.addEventListener('click', () => {
        const st = parseInt(c.getAttribute('data-step'), 10);
        demoController.goToStep(st);
      });
    });
  }

  bindModalEvents() {
    const closeBtn = this.root.querySelector('#btn-close-guidelines');
    const dismissBtn = this.root.querySelector('#btn-dismiss-guidelines');
    const backdrop = this.root.querySelector('#guidelines-modal-backdrop');

    const closeModal = () => {
      state.showSafetyGuidelinesModal = false;
      this.render();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
