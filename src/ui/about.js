/**
 * BaadhRaksha — About & Architecture Page (Mumbai Profile)
 * Contains:
 * - Architecture Pipeline Diagram
 * - Real Data Deployment Reality Explanation
 * - Future Integrations (IMD, BMC, GPM, CWC)
 * - Honest Disclosure of Real vs Simulated Prototype Features
 * - India Emergency Helpline 112 Notice
 */

export function renderAboutComponent() {
  return `
    <div class="about-view-container">
      <div class="view-header">
        <div>
          <h2>ℹ️ About BaadhRaksha & System Architecture</h2>
          <p class="subtitle">Smarter Flood Response. Safer Mumbai. Technical stack, mathematical flood hazard formula, and honest hackathon prototype disclosures.</p>
        </div>
      </div>

      <div class="about-grid">
        <!-- Architecture Diagram Card -->
        <div class="card about-card">
          <h3>📐 Technical Architecture Pipeline</h3>
          <p class="text-muted">How data flows from urban meteorological sources into offline citizen handsets:</p>
          
          <div class="architecture-diagram-ascii">
            <pre>
┌────────────────────────────────────────────────────────────────────────┐
│                              DATA INPUTS                               │
│  Rainfall Intensity │ Accumulation │ River/Tide Levels │ Ground Reports│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FLOOD RISK ENGINE                               │
│  Hazard = 0.25×RainIntensity + 0.20×Accum + 0.20×River + 0.15×Drainage │
│         + 0.10×HighTide + 0.10×LowLying                                │
│  Risk Score = Hazard × [0.60 + 0.20×(Exposure) + 0.20×(Vuln)]          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        AREA-LEVEL ASSESSMENT                           │
│   26 Mumbai Localities │  Color-Coded Shading  │  Confidence Metric    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           TARGETED ACTIONS                             │
│  Localized Warnings (Watch/Warn/Evac) │ Rescue SOS │ Shelter Routing   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     COMMUNICATION & OFFLINE RESILIENCE                 │
│  4G Push Notifications │ SMS Integration Point │ Offline IndexedDB     │
└────────────────────────────────────────────────────────────────────────┘
            </pre>
          </div>

          <div class="info-alert-box">
            <strong>⚠️ Real Deployment Workflow:</strong>
            <p style="margin-top:0.4rem;">
              In a real deployment, verified weather, river, tide, and municipal drainage data would be collected from authorized sources.
              The risk engine would process this information and provide area-level risk assessments. Authorities would review and approve public warnings.
            </p>
            <h5 style="margin-top:0.75rem; margin-bottom:0.25rem;">Future Sensor & Infrastructure Integration Possibilities:</h5>
            <ul class="about-steps-list">
              <li><strong>IMD Rainfall Forecasts</strong>: Doppler radar and automated weather station telemetry.</li>
              <li><strong>NASA GPM Satellite Precipitation</strong>: Near-real-time precipitation estimates.</li>
              <li><strong>Central Water Commission (CWC)</strong>: River discharge and gauge monitoring where applicable.</li>
              <li><strong>Verified Tide Tables</strong>: High tide and astronomical spring-tide timing feeds.</li>
              <li><strong>BMC Disaster Management Department</strong>: Municipal waterlogging telemetry and pumping station status.</li>
              <li><strong>NDMA Common Alerting Protocol (CAP)</strong>: Authorized multi-channel SMS and cell broadcast infrastructure.</li>
            </ul>
          </div>
        </div>

        <!-- Honest Disclosures & Reality vs Simulation Card -->
        <div class="card about-card">
          <h3>⚖️ Prototype Honesty & Disclosures</h3>
          <p>We believe hackathon integrity comes from absolute clarity on what is real and what is simulated:</p>

          <div class="disclosure-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Implementation Status</th>
                  <th>Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Frontend UI & PWA</strong></td>
                  <td><span class="badge badge-low">100% Real</span></td>
                  <td>Complete vanilla JavaScript, Service Worker offline caching, responsive mobile-first UI.</td>
                </tr>
                <tr>
                  <td><strong>Flood Risk Engine</strong></td>
                  <td><span class="badge badge-low">100% Real</span></td>
                  <td>Real JavaScript module computing weighted hazard scores, components, and plain-language explanations.</td>
                </tr>
                <tr>
                  <td><strong>IndexedDB Local Storage</strong></td>
                  <td><span class="badge badge-low">100% Real</span></td>
                  <td>Real offline browser database storing rescue requests, alerts, and citizen field reports.</td>
                </tr>
                <tr>
                  <td><strong>Volunteer & Shelter Matcher</strong></td>
                  <td><span class="badge badge-low">100% Real</span></td>
                  <td>Real Haversine distance, skill matching, and capacity overflow ranking algorithms.</td>
                </tr>
                <tr>
                  <td><strong>Monsoon Rainfall & River Levels</strong></td>
                  <td><span class="badge badge-medium">Simulated</span></td>
                  <td>Plausible illustrative readings representing severe Mumbai monsoon events.</td>
                </tr>
                <tr>
                  <td><strong>SMS Delivery</strong></td>
                  <td><span class="badge badge-medium">Simulated</span></td>
                  <td>Simulated handset feed with interactive 2-way SOS dispatch.</td>
                </tr>
                <tr>
                  <td><strong>Volunteers & Shelters</strong></td>
                  <td><span class="badge badge-medium">Fictional Demo</span></td>
                  <td>All volunteer identities and shelter contacts are fictional demo entries.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="emergency-helpline-box">
            <div class="helpline-num">🚨 OFFICIAL EMERGENCY NUMBER: 112</div>
            <p>
              BaadhRaksha is an experimental disaster coordination prototype and does not replace official emergency services.
              In an actual flood or municipal emergency, dial <strong>112 (National Emergency Helpline)</strong> or
              <strong>1916 (BMC Disaster Control Room Helpline)</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
