/**
 * BaadhRaksha — Simplified Alerts Page
 * Kharghar, Navi Mumbai
 * 
 * Filter by severity: WATCH | WARNING | SEVERE (or ALL)
 * Each alert card displays:
 *   - Severity / Modeled risk category
 *   - Location in Kharghar
 *   - Time
 *   - Expected flood window
 *   - Recommended action
 * Marked with DEMO DATA notice
 */

import { state } from '../state.js';

export function renderAlertsPage() {
  const isHi = state.lang === 'hi';
  const filter = state.alertFilter || 'ALL';

  const filteredAlerts = state.alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  return `
    <div class="page-container alerts-page">
      <div class="page-header">
        <h2 class="page-title">${isHi ? 'बाढ़ चेतावनियाँ व सूचना' : 'Kharghar Flood Alerts'}</h2>
        <span class="sim-notice-tag">DEMO DATA</span>
      </div>

      <!-- Severity Filter Buttons -->
      <div class="alert-filter-bar">
        <button class="filter-btn ${filter === 'ALL' ? 'active' : ''}" data-filter="ALL">
          ${isHi ? 'सर्व' : 'ALL'} (${state.alerts.length})
        </button>
        <button class="filter-btn filter-severe ${filter === 'SEVERE' ? 'active' : ''}" data-filter="SEVERE">
          ${isHi ? 'अति गंभीर (VERY HIGH)' : 'VERY HIGH RISK'}
        </button>
        <button class="filter-btn filter-warning ${filter === 'WARNING' ? 'active' : ''}" data-filter="WARNING">
          ${isHi ? 'उच्च (HIGH)' : 'HIGH RISK'}
        </button>
        <button class="filter-btn filter-watch ${filter === 'WATCH' ? 'active' : ''}" data-filter="WATCH">
          ${isHi ? 'मध्यम (MODERATE)' : 'MODERATE RISK'}
        </button>
      </div>

      <!-- Alerts List -->
      <div class="alerts-stack">
        ${filteredAlerts.length === 0 ? `
          <div class="empty-state">
            <p>${isHi ? 'या श्रेणीत कोणतीही सक्रिय सूचना नाही.' : 'No active alerts in this category.'}</p>
          </div>
        ` : filteredAlerts.map(alt => `
          <div class="alert-card alert-card-${alt.severity.toLowerCase()}">
            <div class="alert-card-top">
              <span class="alert-badge badge-${alt.severity.toLowerCase()}">
                ${alt.severity === 'SEVERE' ? '⚠️ VERY HIGH RISK' : alt.severity === 'WARNING' ? '⚡ HIGH RISK' : '👁️ MODERATE RISK'}
              </span>
              <span class="alert-time">${alt.time}</span>
            </div>

            <div class="alert-location-row">
              <h3 class="alert-location">📍 Kharghar ${isHi ? alt.districtHi : alt.district}, Navi Mumbai</h3>
            </div>

            <div class="alert-detail-line">
              <span class="detail-label">${isHi ? 'अपेक्षित कालावधी:' : 'Expected Flood Window:'}</span>
              <strong>${alt.expectedWindow}</strong>
            </div>

            <p class="alert-reason-text">
              ${isHi ? alt.reasonHi : alt.reason}
            </p>

            <div class="alert-action-box">
              <span class="action-label">${isHi ? 'अनुशंसित कृती:' : 'Recommended Safety Action:'}</span>
              <p class="action-text">${isHi ? alt.actionHi : alt.action}</p>
            </div>

            <div class="alert-card-footer">
              <small>DEMO MODE – Illustrative scenario, not an official IMD/PMC warning.</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindAlertsEvents(container) {
  const filterBtns = container.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');
      state.alertFilter = f;
      state.notify();
    });
  });
}
