/**
 * BaadhRaksha — Network & Connectivity Simulator (Mumbai Urban Profile)
 * States:
 * 1. NORMAL - Internet connected (Broadband / 4G / 5G)
 * 2. SLOW - Low bandwidth (Delayed sync / compressed packets)
 * 3. OFFLINE - No internet (Local IndexedDB cache & queued rescue SOS)
 */

export const NETWORK_STATES = {
  NORMAL: {
    id: 'NORMAL',
    labelEn: 'Online (Broadband / 4G / 5G)',
    labelHi: 'ऑनलाइन (4जी / 5जी ब्रॉडबैंड)',
    labelMr: 'ऑनलाइन (४जी / ५जी ब्रॉडबँड)',
    badgeText: 'ONLINE',
    color: '#10b981',
    descriptionEn: 'Full connectivity. Real-time telemetry, instant alerts & sync enabled.',
    descriptionHi: 'पूर्ण कनेक्टिविटी। रीयल-टाइम डेटा और तुरंत अलर्ट सक्रिय।',
    descriptionMr: 'पूर्ण कनेक्टिव्हिटी. रिअल-टाइम माहिती व त्वरित इशारे सुरू.'
  },
  SLOW: {
    id: 'SLOW',
    labelEn: 'Slow Network (Low Bandwidth)',
    labelHi: 'धीमा नेटवर्क (कम बैंडविड्थ)',
    labelMr: 'मंद नेटवर्क (कमी बँडविड्थ)',
    badgeText: 'SLOW (2G)',
    color: '#f59e0b',
    descriptionEn: 'Low bandwidth. Compressed text packets & delayed sync.',
    descriptionHi: 'कम बैंडविड्थ। केवल टेक्स्ट डेटा और विलंबित सिंक।',
    descriptionMr: 'कमी बँडविड्थ. केवळ मजकूर आणि उशिरा समक्रमण.'
  },
  OFFLINE: {
    id: 'OFFLINE',
    labelEn: 'Offline (No Internet)',
    labelHi: 'ऑफलाइन (इंटरनेट बंद)',
    labelMr: 'ऑफलाइन (इंटरनेट बंद)',
    badgeText: 'OFFLINE',
    color: '#f97316',
    descriptionEn: 'No web connection. Operating entirely from cached IndexedDB & local request queue.',
    descriptionHi: 'इंटरनेट अनुपलब्ध। कैश्ड डेटा और स्थानीय कतार में सुरक्षित।',
    descriptionMr: 'इंटरनेट उपलब्ध नाही. कॅश केलेला डेटा व स्थानिक रांगेत जतन.'
  }
};

class NetworkService {
  constructor() {
    this.currentState = 'NORMAL';
    this.listeners = [];

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (this.currentState === 'OFFLINE') {
          this.setState('NORMAL');
        }
      });
      window.addEventListener('offline', () => {
        this.setState('OFFLINE');
      });
    }
  }

  getState() {
    return this.currentState;
  }

  getStateInfo() {
    return NETWORK_STATES[this.currentState] || NETWORK_STATES.NORMAL;
  }

  setState(newState) {
    if (!NETWORK_STATES[newState]) return;
    this.currentState = newState;
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.currentState, this.getStateInfo());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    const info = this.getStateInfo();
    this.listeners.forEach(cb => {
      try {
        cb(this.currentState, info);
      } catch (e) {
        console.error('Error notifying network listener', e);
      }
    });
  }
}

export const networkService = new NetworkService();
