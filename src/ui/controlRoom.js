/**
 * BaadhRaksha — Disaster Control Room & Settings Drawer (Mumbai)
 * Features:
 * - Network Simulator (Normal, Slow, Offline)
 * - Flood Simulation Controls (Play, Pause, Next, Prev, Reset, Speed: 1x, 2x, 4x)
 * - Break Sensor Feed (sensor failure simulation with reduced confidence and safety hold)
 * - Raw Locality Risk Telemetry Packet Inspector
 * - System Queue, Shelter, and Audit Log Metrics
 */

import { state } from '../state.js';
import { networkService } from '../services/network.js';
import { simulationController } from '../simulation/timeline.js';

export function renderControlRoomComponent() {
  const isHi = state.lang === 'hi';
  const isMr = state.lang === 'mr';
  const netState = networkService.getState();
  const netInfo = networkService.getStateInfo();
  const sim = state.simulation;
  const currentTimelineEvent = sim.timelineEvents[sim.stageIndex] || {
    stage: 1,
    title: 'Stage 1 – Heavy Rainfall Across Mumbai',
    simulatedTime: 'Day 1, 07:00 IST'
  };
  const selectedLocality = state.getSelectedLocality();

  return `
    <div class="control-room-panel">
      <div class="cr-header">
        <div class="cr-title-group">
          <h3>🎛️ ${isMr ? 'मुंबई आपत्ती नियंत्रण कक्ष' : isHi ? 'आपदा नियंत्रण कक्ष (मुंबई)' : 'Disaster Control Room'}</h3>
          <span class="cr-sub">Engineering Demo & Telemetry Injector</span>
        </div>
        <button class="cr-close-btn" id="btn-close-cr" aria-label="Close">×</button>
      </div>

      <div class="cr-body">
        <!-- 1. Network Connectivity Simulator -->
        <div class="cr-section">
          <label class="cr-section-label">📶 Network Simulator:</label>
          <div class="net-btn-grid" style="grid-template-columns: 1fr 1fr 1fr;">
            <button class="net-btn ${netState === 'NORMAL' ? 'active normal' : ''}" data-state="NORMAL">
              🟢 Normal (4G/5G)
            </button>
            <button class="net-btn ${netState === 'SLOW' ? 'active slow' : ''}" data-state="SLOW">
              🟡 Slow Network
            </button>
            <button class="net-btn ${netState === 'OFFLINE' ? 'active offline' : ''}" data-state="OFFLINE">
              🟠 Offline Mode
            </button>
          </div>
          <div class="net-status-explainer" style="border-left: 3px solid ${netInfo.color};">
            <strong>${isMr ? netInfo.labelMr : isHi ? netInfo.labelHi : netInfo.labelEn}</strong>
            <p>${isMr ? netInfo.descriptionMr : isHi ? netInfo.descriptionHi : netInfo.descriptionEn}</p>
          </div>
        </div>

        <!-- 2. Simulation Playback Controls -->
        <div class="cr-section">
          <div class="cr-section-header">
            <label class="cr-section-label">🌊 Mumbai Monsoon Simulation:</label>
            <span class="badge ${sim.active ? 'badge-severe' : 'badge-outline'}">
              ${sim.active ? '▶ Running' : '⏸ Paused'}
            </span>
          </div>

          <!-- Current Stage Card -->
          <div class="sim-stage-indicator-box">
            <div class="sim-time-row">
              <span class="sim-clock">⏱️ ${currentTimelineEvent.simulatedTime}</span>
              <span class="sim-stage-num">Stage ${sim.stageIndex + 1} of ${sim.totalStages}</span>
            </div>
            <div class="sim-stage-name">${isMr && currentTimelineEvent.titleMr ? currentTimelineEvent.titleMr : isHi && currentTimelineEvent.titleHi ? currentTimelineEvent.titleHi : currentTimelineEvent.title}</div>
            <p class="sim-stage-desc">${currentTimelineEvent.description}</p>
            ${currentTimelineEvent.tideMeters ? `<div class="tide-meta text-sm font-bold text-muted">🌊 Arabian Sea Tide: ${currentTimelineEvent.tideMeters}</div>` : ''}
          </div>

          <!-- Control Buttons Row -->
          <div class="sim-btn-row">
            <button class="btn btn-outline" id="btn-sim-prev" title="Previous Stage" ${sim.stageIndex === 0 ? 'disabled' : ''}>
              ⏮ Prev
            </button>
            
            ${sim.active ? `
              <button class="btn btn-warning" id="btn-sim-pause">
                ⏸ Pause
              </button>
            ` : `
              <button class="btn btn-primary" id="btn-sim-play">
                ▶ Start Mumbai Simulation
              </button>
            `}

            <button class="btn btn-outline" id="btn-sim-next" title="Next Stage" ${sim.stageIndex === sim.totalStages - 1 ? 'disabled' : ''}>
              Next ⏭
            </button>
          </div>

          <!-- Speed & Reset Controls -->
          <div class="sim-sub-controls">
            <div class="speed-selector">
              <span>Speed:</span>
              <button class="speed-btn ${sim.speed === 1 ? 'active' : ''}" data-speed="1">1x</button>
              <button class="speed-btn ${sim.speed === 2 ? 'active' : ''}" data-speed="2">2x</button>
              <button class="speed-btn ${sim.speed === 4 ? 'active' : ''}" data-speed="4">4x</button>
            </div>
            <button class="btn btn-outline btn-sm" id="btn-sim-reset">
              🔄 Reset Demo
            </button>
          </div>
        </div>

        <!-- 3. Sensor Fault Injection (Break Sensor Feed) -->
        <div class="cr-section">
          <label class="cr-section-label">⚠️ Telemetry Fault Injection:</label>
          <div class="gauge-fault-box">
            <button class="btn ${state.gaugeFailure ? 'btn-danger' : 'btn-outline'} btn-block" id="btn-toggle-gauge">
              ${state.gaugeFailure ? '🔌 Restore Sensor Feed' : '⚡ Break Sensor Feed (Simulate Sensor Interruption)'}
            </button>
            ${state.gaugeFailure ? `
              <div class="fault-notice">
                <strong>⚠️ Sensor data unavailable:</strong>
                <p>Sensor data unavailable. Previous risk information retained. Data confidence reduced to 54%.</p>
              </div>
            ` : `
              <small class="text-muted">Simulates river gauge and rainfall sensor dropouts. Demonstrates fail-safe risk retention.</small>
            `}
          </div>
        </div>

        <!-- 4. Raw Locality Telemetry Packet Inspector -->
        <div class="cr-section">
          <label class="cr-section-label">📊 Locality Telemetry Packet (${selectedLocality.name}):</label>
          <pre class="telemetry-pre"><code>${JSON.stringify({
            locality: selectedLocality.name,
            region: selectedLocality.region,
            primaryChannel: selectedLocality.primaryRiver,
            score: selectedLocality.assessment ? selectedLocality.assessment.score : 0,
            level: selectedLocality.assessment ? selectedLocality.assessment.level : 'N/A',
            confidence: selectedLocality.assessment ? selectedLocality.assessment.confidence : 0,
            components: selectedLocality.assessment ? selectedLocality.assessment.components : {},
            estimatedAffectedPopulation: selectedLocality.assessment ? selectedLocality.assessment.estimatedAffectedPop : 0,
            waterloggingReports: selectedLocality.assessment ? selectedLocality.assessment.waterloggingReports : 0,
            sensorOnline: !state.gaugeFailure
          }, null, 2)}</code></pre>
        </div>

        <!-- 5. System Health & Queues -->
        <div class="cr-section">
          <label class="cr-section-label">📈 Storage & Audit Counters:</label>
          <div class="cr-stat-grid">
            <div class="cr-stat-card">
              <span>IndexedDB SOS</span>
              <strong>${state.rescueRequests.length} requests</strong>
            </div>
            <div class="cr-stat-card">
              <span>Mumbai Shelters</span>
              <strong>${state.shelters.length} centers</strong>
            </div>
            <div class="cr-stat-card">
              <span>Active Alerts</span>
              <strong>${state.alerts.length} messages</strong>
            </div>
            <div class="cr-stat-card">
              <span>Citizen Reports</span>
              <strong>${state.citizenReports.length} reports</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindControlRoomEvents(container) {
  const closeBtn = container.querySelector('#btn-close-cr');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      container.classList.remove('open');
    });
  }

  container.querySelectorAll('.net-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetState = btn.getAttribute('data-state');
      networkService.setState(targetState);
      if (targetState === 'NORMAL') {
        state.syncQueuedRequests();
      }
      state.notify();
    });
  });

  const playBtn = container.querySelector('#btn-sim-play');
  if (playBtn) playBtn.addEventListener('click', () => simulationController.start());

  const pauseBtn = container.querySelector('#btn-sim-pause');
  if (pauseBtn) pauseBtn.addEventListener('click', () => simulationController.pause());

  const prevBtn = container.querySelector('#btn-sim-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => simulationController.prevStage());

  const nextBtn = container.querySelector('#btn-sim-next');
  if (nextBtn) nextBtn.addEventListener('click', () => simulationController.nextStage());

  const resetBtn = container.querySelector('#btn-sim-reset');
  if (resetBtn) resetBtn.addEventListener('click', () => simulationController.reset());

  container.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseInt(btn.getAttribute('data-speed'), 10);
      simulationController.setSpeed(speed);
    });
  });

  const gaugeBtn = container.querySelector('#btn-toggle-gauge');
  if (gaugeBtn) {
    gaugeBtn.addEventListener('click', () => {
      state.toggleGaugeFailure();
    });
  }
}
