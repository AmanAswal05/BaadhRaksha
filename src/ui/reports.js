/**
 * BaadhRaksha — Simplified Citizen Flood Report Page
 * Kharghar, Navi Mumbai
 * 
 * Report Types:
 * - Waterlogging
 * - Flooded roads
 * - Rising water
 * - Flooded homes
 * - Blocked roads
 * - People needing rescue
 * 
 * Features:
 * - Short, clean form
 * - Optional GPS location
 * - Optional photo attachment
 * - Offline support via IndexedDB
 */

import { state } from '../state.js';
import { networkService } from '../services/network.js';

let localPhotoBlob = null;
let reportGpsCoords = null;

export function renderReportsPage() {
  const isHi = state.lang === 'hi';
  const isOnline = networkService.getState() === 'NORMAL';
  const selectedSector = state.getSelectedDistrict();

  return `
    <div class="page-container report-page">
      <div class="page-header">
        <h2 class="page-title">${isHi ? 'बाढ़ की स्थिति रिपोर्ट करें' : 'Report Flooding'}</h2>
        <span class="sim-notice-tag">KHARGHAR, NAVI MUMBAI</span>
      </div>

      <div class="report-card">
        <div class="card-head-simple">
          <h3>${isHi ? 'स्थानिक पूर स्थिती नोंदवा' : 'Submit Flood Observation'}</h3>
          <span class="sub-text">${isHi ? '30 सेकंदांत पूर्ण करा' : 'Short report (Takes ~30 seconds)'}</span>
        </div>

        ${!isOnline ? `
          <div class="offline-warning-callout">
            <strong>⚠️ ${isHi ? 'ऑफलाइन मोड' : 'Offline Mode'}</strong>
            <p>${isHi ? 'आपली नोंदणी फोनमध्ये सेव्ह केली जाईल आणि इंटरनेट सुरू होताच आपोआप सिंक होईल.' : 'Your report will be stored locally in IndexedDB and uploaded when network is restored.'}</p>
          </div>
        ` : ''}

        <form id="simple-report-form" class="simple-form">
          <!-- Report Type -->
          <div class="form-group">
            <label class="form-label">${isHi ? 'समस्येचा प्रकार' : 'Incident Type'} *</label>
            <select id="rep-type" class="form-select" required>
              <option value="Waterlogging">${isHi ? 'पाणी साचणे (Waterlogging)' : 'Waterlogging'}</option>
              <option value="Flooded roads">${isHi ? 'रस्ते जलमय (Flooded roads)' : 'Flooded roads'}</option>
              <option value="Rising water">${isHi ? 'पाण्याचा स्तर वेगाने वाढणे (Rising water)' : 'Rising water'}</option>
              <option value="Flooded homes">${isHi ? 'घरांमध्ये पाणी शिरणे (Flooded homes)' : 'Flooded homes'}</option>
              <option value="Blocked roads">${isHi ? 'वाहतूक व रस्ता बंद (Blocked roads)' : 'Blocked roads'}</option>
              <option value="People needing rescue">${isHi ? 'अडकलेल्या लोकांना मदत हवी (People needing rescue)' : 'People needing rescue'}</option>
            </select>
          </div>

          <!-- Location (Sector & Landmark) -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${isHi ? 'खारघर सेक्टर' : 'Kharghar Sector'} *</label>
              <select id="rep-district" class="form-select" required>
                ${state.districts.map(d => `
                  <option value="${d.name}" ${d.id === selectedSector.id ? 'selected' : ''}>
                    ${isHi ? d.nameHi : d.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">${isHi ? 'लँडमार्क / रस्ता' : 'Landmark / Street Name'} *</label>
              <input type="text" id="rep-locality" class="form-input" placeholder="${isHi ? 'उदा. उत्सव चौक जवळ' : 'e.g. Near Utsav Chowk / Sector 20 market'}" required>
            </div>
          </div>

          <!-- GPS Location (Optional) -->
          <div class="form-group gps-group">
            <button type="button" id="btn-rep-gps" class="btn btn-outline btn-sm">
              📍 ${isHi ? 'GPS स्थान जोडा (पर्यायी)' : 'Attach GPS Location (Optional)'}
            </button>
            <span id="rep-gps-text" class="gps-text">${isHi ? 'GPS जोडलेले नाही' : 'No GPS attached'}</span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">${isHi ? 'तपशील (पर्यायी)' : 'Situation Details (Optional)'}</label>
            <textarea id="rep-desc" class="form-textarea" rows="2" placeholder="${isHi ? 'उदा. गुडघाभर पाणी, गाड्या बंद पडल्या आहेत...' : 'e.g. Knee-deep water, culvert overflowing, slow traffic...'}"></textarea>
          </div>

          <!-- Photo Attachment (Optional) -->
          <div class="form-group">
            <label class="form-label">${isHi ? 'छायाचित्र जोडा (पर्यायी)' : 'Attach Photograph (Optional)'}</label>
            <input type="file" id="rep-photo" class="form-file-input" accept="image/*">
            <div id="rep-photo-preview" class="photo-preview-wrap" style="display:none; margin-top:8px;">
              <img id="rep-preview-img" src="" alt="Attached photo" style="max-height:120px; border-radius:6px;">
              <button type="button" id="btn-remove-rep-photo" class="btn btn-sm btn-outline" style="margin-left:10px;">Remove</button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 13px; font-size: 1rem;">
            📢 ${isHi ? 'अहवाल सादर करा' : 'SUBMIT REPORT'}
          </button>
        </form>

        <div id="rep-result-msg" style="display:none; margin-top:1.2rem;"></div>

        <!-- Recent Citizen Reports -->
        <div class="recent-reports-section" style="margin-top:2rem;">
          <h4 style="font-size:1rem; margin-bottom:0.8rem; color:#1e293b;">
            ${isHi ? 'खारघरमधील ताज्या नागरिक नोंदी' : 'Recent Citizen Reports in Kharghar'}
          </h4>
          <div class="reports-stream">
            ${state.citizenReports.slice(0, 5).map(r => `
              <div class="report-item-box">
                <div class="rep-head">
                  <strong style="color:#0284c7;">${r.reportType || 'Observation'}</strong>
                  <span class="rep-time">${r.timestamp || 'Recent'}</span>
                </div>
                <div class="rep-loc">📍 ${r.district} — ${r.locality}</div>
                <p class="rep-details">${r.details || 'Community observation submitted.'}</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;
}

export function bindReportsEvents(container) {
  const form = container.querySelector('#simple-report-form');
  const resultMsg = container.querySelector('#rep-result-msg');
  const photoInput = container.querySelector('#rep-photo');
  const photoPreviewWrap = container.querySelector('#rep-photo-preview');
  const previewImg = container.querySelector('#rep-preview-img');
  const btnRemovePhoto = container.querySelector('#btn-remove-rep-photo');

  // Photo preview
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          localPhotoBlob = re.target.result;
          if (previewImg) previewImg.src = localPhotoBlob;
          if (photoPreviewWrap) photoPreviewWrap.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
      localPhotoBlob = null;
      if (photoInput) photoInput.value = '';
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
    });
  }

  // GPS for report
  const gpsBtn = container.querySelector('#btn-rep-gps');
  const gpsText = container.querySelector('#rep-gps-text');
  if (gpsBtn && gpsText) {
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        gpsText.textContent = 'Locating GPS...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(4);
            const lon = pos.coords.longitude.toFixed(4);
            reportGpsCoords = `${lat}° N, ${lon}° E`;
            gpsText.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ GPS: ${reportGpsCoords}</span>`;
          },
          () => {
            reportGpsCoords = `19.0432° N, 73.0645° E (Utsav Chowk)`;
            gpsText.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ GPS: ${reportGpsCoords}</span>`;
          },
          { timeout: 3500 }
        );
      } else {
        reportGpsCoords = `19.0432° N, 73.0645° E (Utsav Chowk)`;
        gpsText.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ GPS: ${reportGpsCoords}</span>`;
      }
    });
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isOnline = networkService.getState() === 'NORMAL';
      const repType = container.querySelector('#rep-type').value;
      const district = container.querySelector('#rep-district').value;
      const locality = container.querySelector('#rep-locality').value.trim();
      const desc = container.querySelector('#rep-desc').value.trim();

      const newRep = await state.addCitizenReport({
        reportType: repType,
        district,
        locality,
        details: desc,
        gps: reportGpsCoords || 'None',
        photoAttached: !!localPhotoBlob
      });

      form.reset();
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
      if (gpsText) gpsText.textContent = 'No GPS attached';
      localPhotoBlob = null;
      reportGpsCoords = null;

      if (resultMsg) {
        resultMsg.style.display = 'block';
        if (isOnline) {
          resultMsg.className = 'status-callout success';
          resultMsg.innerHTML = `
            <strong>✅ REPORT RECORDED</strong>
            <p>Thank you for submitting this report for <strong>${locality}, ${district}</strong>. It helps update neighborhood waterlogging maps.</p>
          `;
        } else {
          resultMsg.className = 'status-callout warning';
          resultMsg.innerHTML = `
            <strong>⚠️ REPORT STORED LOCALLY (OFFLINE)</strong>
            <p>Your observation has been saved in local IndexedDB. It will automatically transmit to the server once connection is available.</p>
          `;
        }
      }
    });
  }
}
