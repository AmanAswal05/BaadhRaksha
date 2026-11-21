/**
 * BaadhRaksha — Presenter Demo Scenarios for Kharghar, Navi Mumbai
 * 
 * 8 Demonstration Scenarios:
 * 1. Normal conditions (Kharghar baseline)
 * 2. 48-hour flood warning (Catchment downpour)
 * 3. Increasing flood risk (Runoff accumulation)
 * 4. Flood Risk Grid Map (Cell risk inspection)
 * 5. Severe alert (Sector 36 & Kasadi overflow)
 * 6. Citizen SOS (Online dispatch)
 * 7. Offline request (IndexedDB storage)
 * 8. Reconnection (Auto sync)
 */

import { state } from '../state.js';
import { simulationController } from './timeline.js';
import { networkService } from '../services/network.js';

export const DEMO_STEPS = [
  {
    step: 1,
    name: 'Normal conditions',
    titleEn: '1. Normal conditions',
    titleHi: '1. सामान्य परिस्थिती',
    desc: 'Baseline state. Normal rainfall, Kasadi river flowing within banks. Low modeled risk across central sectors.',
    descEn: 'Baseline state. Normal rainfall, Kasadi river flowing within banks. Low modeled risk across central sectors.',
    descHi: 'सामान्य मान्सून स्थिती. कासाडी नदी व नाले सामान्य प्रवाहावर. बहुतांश खारघरमध्ये कमी जोखीम.',
    action: () => {
      networkService.setState('NORMAL');
      simulationController.goToStage(0);
      state.setMapMode('normal');
      state.setSelectedDistrict('central-park');
      state.setView('home');
    }
  },
  {
    step: 2,
    name: '48-hour flood warning',
    titleEn: '2. 48-hour flood warning',
    titleHi: '2. 48-तास पूर्व इशारा',
    desc: 'Heavy precipitation over Kharghar hills and Taloja catchment. Early flood watch triggered.',
    descEn: 'Heavy precipitation over Kharghar hills and Taloja catchment. Early flood watch triggered.',
    descHi: 'खारघर टेकड्यांवर अतिवृष्टीचा इशारा. पावसाळी पाण्याच्या प्रवाहात वाढ.',
    action: () => {
      simulationController.goToStage(1);
      state.setSelectedDistrict('sector-19');
      state.setView('home');
    }
  },
  {
    step: 3,
    name: 'Increasing flood risk',
    titleEn: '3. Increasing flood risk',
    titleHi: '3. वाढती पूर जोखीम',
    desc: 'High astronomical tide in Panvel creek combined with sustained cloudburst. Sector 20 culverts reaching capacity.',
    descEn: 'High astronomical tide in Panvel creek combined with sustained cloudburst. Sector 20 culverts reaching capacity.',
    descHi: 'भरती आणि पावसाचे पाणी यामुळे सेक्टर २० व सखल रस्त्यांवर पाणी साचण्याची शक्यता.',
    action: () => {
      simulationController.goToStage(2);
      state.setSelectedDistrict('sector-20');
      state.setView('home');
    }
  },
  {
    step: 4,
    name: 'Flood Risk Grid map',
    titleEn: '4. Flood Risk Grid map',
    titleHi: '4. फ्लड रिस्क ग्रिड मॅप',
    desc: 'Switched to Flood Risk Grid mode. Color-coded geographic cells show localized risk gradients across Kharghar.',
    descEn: 'Switched to Flood Risk Grid mode. Color-coded geographic cells show localized risk gradients across Kharghar.',
    descHi: 'ग्रिड मॅप सक्रिय. लहान चौरस पेशींमध्ये (Cells) अचूक स्थानिक पूर जोखीम दृश्यमान.',
    action: () => {
      simulationController.goToStage(2);
      state.setMapMode('grid');
      state.setSelectedDistrict('sector-20');
      state.setView('home');
    }
  },
  {
    step: 5,
    name: 'Severe alert',
    titleEn: '5. Severe alert',
    titleHi: '5. अति उच्च जोखीम सूचना',
    desc: 'Kasadi river and Taloja-side corridor face extreme tidal backwater. Very high modeled risk for Sector 35 & 36.',
    descEn: 'Kasadi river and Taloja-side corridor face extreme tidal backwater. Very high modeled risk for Sector 35 & 36.',
    descHi: 'कासाडी नदी पात्राजवळ अति उच्च पूर जोखीम. सेक्टर ३५ व ३६ साठी सतर्कतेचा इशारा.',
    action: () => {
      simulationController.goToStage(3);
      state.setSelectedDistrict('sector-36');
      state.setView('alerts');
    }
  },
  {
    step: 6,
    name: 'Citizen SOS',
    titleEn: '6. Citizen SOS',
    titleHi: '6. नागरिक बचाव विनंती (SOS)',
    desc: 'Citizen in Kharghar Sector 20 requests emergency evacuation while online. Dispatched to local control.',
    descEn: 'Citizen in Kharghar Sector 20 requests emergency evacuation while online. Dispatched to local control.',
    descHi: 'खारघर सेक्टर २० मधून तातडीची मदत विनंती सबमिट करण्यात आली.',
    action: () => {
      networkService.setState('NORMAL');
      state.setView('help');
      state.addRescueRequest({
        name: 'Pradeep Patil',
        phone: '+91 98201 54321',
        district: 'Sector 20',
        locality: 'Near Jalvayu Vihar drainage line',
        numberOfPeople: 3,
        type: 'Water inside home / Trapped',
        details: 'Ground floor flat water entering; senior citizen stranded.'
      });
    }
  },
  {
    step: 7,
    name: 'Offline request',
    titleEn: '7. Offline request',
    titleHi: '7. ऑफलाइन विनंती',
    desc: 'Internet disconnected. Help request safely preserved in IndexedDB: "SOS SAVED LOCALLY — WAITING FOR CONNECTION".',
    descEn: 'Internet disconnected. Help request safely preserved in IndexedDB: "SOS SAVED LOCALLY — WAITING FOR CONNECTION".',
    descHi: 'इंटरनेट बंद. विनंती फोनमध्ये सुरक्षित सेव्ह झाली: "SOS SAVED LOCALLY — WAITING FOR CONNECTION".',
    action: () => {
      networkService.setState('OFFLINE');
      state.setView('help');
      state.addRescueRequest({
        name: 'Anita More',
        phone: '+91 98202 98765',
        district: 'Sector 35',
        locality: 'Metro pillar 214 lowlands',
        numberOfPeople: 4,
        type: 'Flooded roads / Evacuation needed',
        details: 'Road submerged under 0.6m water; car stalled.'
      });
    }
  },
  {
    step: 8,
    name: 'Reconnection',
    titleEn: '8. Reconnection',
    titleHi: '8. नेटवर्क पुनर्बहाली व सिंक',
    desc: 'Network signal restored. Offline queued SOS requests and citizen reports automatically synchronize.',
    descEn: 'Network signal restored. Offline queued SOS requests and citizen reports automatically synchronize.',
    descHi: 'नेटवर्क पुन्हा सुरू. ऑफलाइन रांगेतील सर्व विनंत्या व अहवाल आपोआप सिंक झाले.',
    action: () => {
      networkService.setState('NORMAL');
      state.syncQueuedRequests();
      state.setView('help');
    }
  }
];

export class DemoModeController {
  start() {
    if (!state.guidedDemo) state.guidedDemo = { active: false, step: 1, totalSteps: 8 };
    state.demoModeActive = true;
    state.guidedDemo.active = true;
    state.demoCurrentStep = 1;
    state.guidedDemo.step = 1;
    state.demoTotalSteps = DEMO_STEPS.length;
    this.applyStep(1);
  }

  exit() {
    state.demoModeActive = false;
    if (state.guidedDemo) state.guidedDemo.active = false;
    state.setMapMode('normal');
    state.setView('home');
  }

  next() {
    let cur = (state.guidedDemo && state.guidedDemo.step) || state.demoCurrentStep || 1;
    if (cur < DEMO_STEPS.length) {
      this.goToStep(cur + 1);
    } else {
      this.goToStep(1);
    }
  }

  prev() {
    let cur = (state.guidedDemo && state.guidedDemo.step) || state.demoCurrentStep || 1;
    if (cur > 1) {
      this.goToStep(cur - 1);
    }
  }

  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > DEMO_STEPS.length) return;
    state.demoCurrentStep = stepNumber;
    if (state.guidedDemo) state.guidedDemo.step = stepNumber;
    this.applyStep(stepNumber);
  }

  applyStep(stepNumber) {
    const s = DEMO_STEPS[stepNumber - 1];
    if (s && typeof s.action === 'function') {
      s.action();
    }
    state.notify();
  }
}

export const demoController = new DemoModeController();
export const guidedDemoController = demoController;
