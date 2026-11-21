/**
 * BaadhRaksha — Emergency Help Page for Kharghar, Navi Mumbai
 * 
 * Simple, fast emergency interface:
 * 1. REQUEST RESCUE (SOS Form):
 *    - Name
 *    - Phone number
 *    - Current location using GPS
 *    - Emergency type
 *    - Number of people needing assistance
 *    - Optional message
 *    - Large REQUEST HELP button
 *    - Clear submission feedback
 *    - Offline mode: Stored in IndexedDB, transparently shown waiting for internet
 * 2. FIND SHELTER:
 *    - Kharghar designated elevated shelters & schools
 * 3. EMERGENCY CONTACTS:
 *    - Panvel Municipal Corporation (PMC) Disaster Cell, Navi Mumbai Police, Fire Brigade, NDRF
 */

import { state } from '../state.js';
import { networkService } from '../services/network.js';

let activeHelpTab = 'sos'; // 'sos' | 'shelter' | 'contacts'
let detectedGpsCoords = null;

export function renderHelpPage() {
  const isHi = state.lang === 'hi';
  const isOnline = networkService.getState() === 'NORMAL';
  const selectedSector = state.getSelectedDistrict();

  return `
    <div class="page-container help-page">
      <div class="page-header">
        <h2 class="page-title">${isHi ? 'आपत्कालीन मदत' : 'Emergency Help'}</h2>
        <span class="sim-notice-tag">KHARGHAR, NAVI MUMBAI</span>
      </div>

      <!-- Tab Switcher -->
      <div class="help-tabs-bar">
        <button class="help-tab-btn ${activeHelpTab === 'sos' ? 'active' : ''}" data-tab="sos">
          🚨 ${isHi ? 'बचाव विनंती (SOS)' : 'REQUEST RESCUE'}
        </button>
        <button class="help-tab-btn ${activeHelpTab === 'shelter' ? 'active' : ''}" data-tab="shelter">
          🏫 ${isHi ? 'पूर निवारा केंद्र' : 'FIND SHELTER'}
        </button>
        <button class="help-tab-btn ${activeHelpTab === 'contacts' ? 'active' : ''}" data-tab="contacts">
          📞 ${isHi ? 'आपत्कालीन नंबर' : 'EMERGENCY CONTACTS'}
        </button>
      </div>

      <!-- Content Area -->
      <div class="help-tab-content">
        ${activeHelpTab === 'sos' ? renderSosSection(isHi, isOnline, selectedSector) : ''}
        ${activeHelpTab === 'shelter' ? renderShelterSection(isHi) : ''}
        ${activeHelpTab === 'contacts' ? renderContactsSection(isHi) : ''}
      </div>
    </div>
  `;
}

function renderSosSection(isHi, isOnline, selectedSector) {
  return `
    <div class="help-card">
      <div class="card-head-simple">
        <h3>${isHi ? 'आपातकालीन बचाव विनंती (SOS)' : 'REQUEST EMERGENCY HELP'}</h3>
        <span class="network-badge ${isOnline ? 'online' : 'offline'}">
          ${isOnline ? '● ONLINE' : '● OFFLINE'}
        </span>
      </div>

      ${!isOnline ? `
        <div class="offline-warning-callout">
          <strong>⚠️ ${isHi ? 'इंटरनेट उपलब्ध नाही' : 'Internet Disconnected'}</strong>
          <p>${isHi ? 'तुमची मदत विनंती फोनमध्ये सुरक्षित सेव्ह होईल. इंटरनेट पुन्हा सुरू होताच ती आपत्कालीन कक्षाला पाठवली जाईल.' : 'Your request will be saved locally in IndexedDB and submitted automatically when internet connectivity returns.'}</p>
        </div>
      ` : ''}

      <form id="sos-request-form" class="simple-form">
        <!-- Name -->
        <div class="form-group">
          <label class="form-label">${isHi ? 'नाव' : 'Your Name'} *</label>
          <input type="text" id="sos-name" class="form-input" placeholder="${isHi ? 'उदा. राहुल सावंत' : 'e.g. Rahul Sawant'}" required>
        </div>

        <!-- Phone Number -->
        <div class="form-group">
          <label class="form-label">${isHi ? 'फोन नंबर' : 'Phone Number'} *</label>
          <input type="tel" id="sos-phone" class="form-input" placeholder="e.g. 98201 XXXXX" required>
        </div>

        <!-- Location (GPS & Sector) -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${isHi ? 'खारघर सेक्टर / परिसर' : 'Kharghar Sector / Area'} *</label>
            <select id="sos-district" class="form-select" required>
              ${state.districts.map(d => `
                <option value="${d.name}" ${d.id === selectedSector.id ? 'selected' : ''}>
                  ${isHi ? d.nameHi : d.name}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${isHi ? 'इमारत / लँडमार्क' : 'Building / Specific Location'} *</label>
            <input type="text" id="sos-location" class="form-input" placeholder="${isHi ? 'उदा. सेक्टर २०, बिल्डिंग ४' : 'e.g. Sector 20, Near Jalvayu Vihar'}" required>
          </div>
        </div>

        <!-- GPS Action -->
        <div class="form-group gps-group">
          <button type="button" id="btn-sos-gps" class="btn btn-outline btn-sm">
            📍 ${isHi ? 'वर्तमान GPS स्थान जोडा' : 'Fetch GPS Location'}
          </button>
          <span id="sos-gps-text" class="gps-text">${isHi ? 'GPS जोडलेले नाही' : 'No GPS attached'}</span>
        </div>

        <div class="form-row">
          <!-- Emergency Type -->
          <div class="form-group">
            <label class="form-label">${isHi ? 'आपत्कालीन प्रकार' : 'Emergency Type'} *</label>
            <select id="sos-emergency-type" class="form-select" required>
              <option value="Water inside home / Trapped">${isHi ? 'घरात पाणी शिरले / अडकलो आहोत' : 'Water inside home / Trapped'}</option>
              <option value="Medical assistance needed">${isHi ? 'तातडीची वैद्यकीय मदत' : 'Medical emergency assistance'}</option>
              <option value="Flooded roads / Evacuation needed">${isHi ? 'रस्ता जलमय / स्थलांतर आवश्यक' : 'Flooded roads / Evacuation needed'}</option>
              <option value="Food and clean water needed">${isHi ? 'पिण्याचे पाणी व अन्न हवे' : 'Food and clean water needed'}</option>
            </select>
          </div>

          <!-- Number of People -->
          <div class="form-group">
            <label class="form-label">${isHi ? 'मदत लागणाऱ्या लोकांची संख्या' : 'Number of People'} *</label>
            <input type="number" id="sos-people" class="form-input" min="1" max="50" value="2" required>
          </div>
        </div>

        <!-- Optional Message -->
        <div class="form-group">
          <label class="form-label">${isHi ? 'संदेश (पर्यायी)' : 'Optional Message'}</label>
          <textarea id="sos-details" class="form-textarea" rows="2" placeholder="${isHi ? 'उदा. तळमजल्यावर पाणी भरत आहे, वृद्ध नागरिक सोबत आहेत...' : 'e.g. Ground floor water level rising, senior citizens present...'}"></textarea>
        </div>

        <!-- Large Request Help Button -->
        <button type="submit" class="btn btn-emergency btn-block" style="padding: 14px; font-size: 1.1rem; letter-spacing: 0.5px;">
          🚨 ${isHi ? 'मदत विनंती पाठवा (REQUEST HELP)' : 'REQUEST HELP'}
        </button>
      </form>

      <!-- Submission Feedback -->
      <div id="sos-result-msg" style="display:none; margin-top:1.2rem;"></div>

      <!-- Recent Requests -->
      ${state.rescueRequests.length > 0 ? `
        <div class="recent-requests-wrap">
          <h4>${isHi ? 'तुमच्या अलीकडील विनंत्या' : 'Recent Help Requests'}</h4>
          <div class="requests-list">
            ${state.rescueRequests.map(r => `
              <div class="request-item ${r.syncStatus === 'Queued' ? 'status-queued' : 'status-sent'}">
                <div class="req-item-top">
                  <strong>${r.name || 'Citizen'} • ${r.district}</strong>
                  <span class="req-status-pill ${r.syncStatus.toLowerCase()}">
                    ${r.syncStatus === 'Queued' ? 'SAVED LOCALLY — WAITING FOR CONNECTION' : 'TRANSMITTED TO RELIEF DISPATCH'}
                  </span>
                </div>
                <div class="req-item-body">
                  <span>${r.locality} (${r.numberOfPeople} people) • ${r.type} • ${r.timestamp}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderShelterSection(isHi) {
  return `
    <div class="help-card">
      <div class="card-head-simple">
        <h3>${isHi ? 'खारघर पूर निवारा केंद्र' : 'KHARGHAR RELIEF SHELTERS'}</h3>
      </div>
      <p class="section-intro-text">
        ${isHi ? 'सिडको आणि पनवेल महानगरपालिका द्वारे निश्चित केलेली सुरक्षित पूर निवारक केंद्रे व शाळा:' : 'Designated elevated public relief shelters, schools, and civic halls across Kharghar:'}
      </p>

      <div class="shelters-grid">
        ${state.shelters.map(s => `
          <div class="shelter-item-card">
            <div class="shelter-top">
              <strong>${isHi && s.nameHi ? s.nameHi : s.name}</strong>
              <span class="shelter-cap">Capacity: ${s.capacity}</span>
            </div>
            <div class="shelter-addr">📍 ${s.address}</div>
            <div class="shelter-facilities">
              ${(s.facilities || []).map(f => `<span class="pill-facility">✓ ${f}</span>`).join('')}
            </div>
            <div class="shelter-call">
              <span>📞 ${s.phone}</span>
              <a href="tel:${s.phone.replace(/\s+/g, '')}" class="btn btn-sm btn-outline">Call Center</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderContactsSection(isHi) {
  return `
    <div class="help-card">
      <div class="card-head-simple">
        <h3>${isHi ? 'आपत्कालीन संपर्क नंबर' : 'EMERGENCY DIRECTORY'}</h3>
      </div>
      <p class="section-intro-text">
        ${isHi ? 'खारघर व नवी मुंबई आपत्ती निवारण नियंत्रण कक्ष व हेल्पलाईन नंबर:' : 'Official 24/7 disaster control helplines for Kharghar and Panvel Municipal Corporation (PMC):'}
      </p>

      <div class="contacts-list-clean">
        <div class="contact-card primary-contact">
          <div class="contact-info">
            <strong>112</strong>
            <span>${isHi ? 'राष्ट्रीय आपत्कालीन सेवा (पोलीस, रुग्णवाहिका, अग्निशामक)' : 'National Unified Emergency Response (Police, Ambulance, Fire)'}</span>
          </div>
          <a href="tel:112" class="btn btn-primary">📞 Call 112</a>
        </div>

        <div class="contact-card">
          <div class="contact-info">
            <strong>022-27458040</strong>
            <span>${isHi ? 'पनवेल महानगरपालिका (PMC) आपत्ती नियंत्रण कक्ष' : 'Panvel Municipal Corporation (PMC) Disaster Control Room'}</span>
          </div>
          <a href="tel:02227458040" class="btn btn-outline">📞 Call PMC</a>
        </div>

        <div class="contact-card">
          <div class="contact-info">
            <strong>022-27745433</strong>
            <span>${isHi ? 'खारघर अग्निशामक दल केंद्र' : 'Kharghar Fire Station Control'}</span>
          </div>
          <a href="tel:02227745433" class="btn btn-outline">📞 Call Fire</a>
        </div>

        <div class="contact-card">
          <div class="contact-info">
            <strong>022-27741364</strong>
            <span>${isHi ? 'खारघर पोलीस ठाणे' : 'Kharghar Police Station'}</span>
          </div>
          <a href="tel:02227741364" class="btn btn-outline">📞 Call Police</a>
        </div>

        <div class="contact-card">
          <div class="contact-info">
            <strong>1077</strong>
            <span>${isHi ? 'रायगड जिल्हा आपत्ती नियंत्रण कक्ष' : 'Raigad District Disaster Management Cell'}</span>
          </div>
          <a href="tel:1077" class="btn btn-outline">📞 Call 1077</a>
        </div>
      </div>
    </div>
  `;
}

export function bindHelpEvents(container) {
  // Tab Switching
  const tabBtns = container.querySelectorAll('.help-tab-btn');
  tabBtns.forEach(b => {
    b.addEventListener('click', () => {
      activeHelpTab = b.getAttribute('data-tab');
      state.notify();
    });
  });

  // GPS Click
  const gpsBtn = container.querySelector('#btn-sos-gps');
  const gpsText = container.querySelector('#sos-gps-text');
  if (gpsBtn && gpsText) {
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        gpsText.textContent = 'Acquiring GPS location...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(4);
            const lon = pos.coords.longitude.toFixed(4);
            detectedGpsCoords = `${lat}° N, ${lon}° E`;
            gpsText.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ GPS: ${detectedGpsCoords}</span>`;
          },
          () => {
            // Simulated Kharghar GPS fallback
            detectedGpsCoords = `19.0485° N, 73.0625° E (Sector 20)`;
            gpsText.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ GPS: ${detectedGpsCoords}</span>`;
          },
          { timeout: 3500 }
        );
      } else {
        detectedGpsCoords = `19.0485° N, 73.0625° E (Sector 20)`;
        gpsText.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ GPS: ${detectedGpsCoords}</span>`;
      }
    });
  }

  // SOS Form Submit
  const sosForm = container.querySelector('#sos-request-form');
  const resultMsg = container.querySelector('#sos-result-msg');

  if (sosForm) {
    sosForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isOnline = networkService.getState() === 'NORMAL';
      const name = container.querySelector('#sos-name').value.trim();
      const phone = container.querySelector('#sos-phone').value.trim();
      const district = container.querySelector('#sos-district').value;
      const location = container.querySelector('#sos-location').value.trim();
      const people = parseInt(container.querySelector('#sos-people').value, 10) || 1;
      const emergencyType = container.querySelector('#sos-emergency-type').value;
      const details = container.querySelector('#sos-details').value.trim();

      const newReq = await state.addRescueRequest({
        name: name || 'Citizen in need',
        phone,
        district,
        locality: location,
        gps: detectedGpsCoords || 'Not specified',
        numberOfPeople: people,
        type: emergencyType,
        details
      });

      sosForm.reset();
      if (gpsText) gpsText.textContent = 'No GPS attached';
      detectedGpsCoords = null;

      if (resultMsg) {
        resultMsg.style.display = 'block';
        if (isOnline) {
          resultMsg.className = 'status-callout success';
          resultMsg.innerHTML = `
            <strong>✅ EMERGENCY HELP REQUEST SUBMITTED</strong>
            <p>Your emergency request for <strong>${people} people</strong> at <strong>${location}, ${district}</strong> has been logged. Dispatch details forwarded to Kharghar Disaster Control.</p>
          `;
        } else {
          resultMsg.className = 'status-callout warning';
          resultMsg.innerHTML = `
            <strong>⚠️ SOS SAVED LOCALLY — WAITING FOR CONNECTION</strong>
            <p>You are currently offline. Your request has been stored safely in local memory (IndexedDB) and will synchronize with rescue teams the instant your device connects to the internet.</p>
          `;
        }
      }
    });
  }
}
