/**
 * BaadhRaksha — Kharghar Alert Standards & Delivery Channels
 */

export const ALERT_STAGES = {
  WATCH: {
    key: 'WATCH',
    labelEn: 'MODERATE RISK WATCH',
    labelHi: 'मध्यम जोखीम सतर्कता',
    color: '#eab308',
    badgeClass: 'badge-medium'
  },
  WARNING: {
    key: 'WARNING',
    labelEn: 'HIGH RISK WARNING',
    labelHi: 'उच्च जोखीम इशारा',
    color: '#f97316',
    badgeClass: 'badge-high'
  },
  EVACUATION: {
    key: 'EVACUATION',
    labelEn: 'VERY HIGH RISK ORDER',
    labelHi: 'अति उच्च जोखीम सूचना',
    color: '#ef4444',
    badgeClass: 'badge-severe'
  }
};

export const ALERT_TEMPLATES = {
  WATCH: {
    en: (sectorName, channel, shelter) =>
      `MODERATE RISK WATCH: ${sectorName}, Kharghar. Catchment hill runoff is increasing. Stormwater flow in ${channel} monitored. Nearest shelter on standby: ${shelter}.`,
    hi: (sectorName, channel, shelter) =>
      `मध्यम जोखीम सतर्कता: ${sectorName}, खारघर. डोंगर उतारावरून पाण्याचा प्रवाह वाढत आहे. ${channel} वर लक्ष ठेवले जात आहे. जवळचे निवारा केंद्र: ${shelter}.`
  },
  WARNING: {
    en: (sectorName, channel, shelter) =>
      `HIGH RISK WARNING: ${sectorName}, Kharghar. High tide and localized downpour may cause street waterlogging along ${channel}. Move vehicles to higher ground. Nearest shelter: ${shelter}.`,
    hi: (sectorName, channel, shelter) =>
      `उच्च जोखीम इशारा: ${sectorName}, खारघर. भरती व पावसामुळे ${channel} जवळ पाणी साचू शकते. वाहने सुरक्षित स्थळी हलवा. निवारा केंद्र: ${shelter}.`
  },
  EVACUATION: {
    en: (sectorName, channel, shelter) =>
      `VERY HIGH RISK ALERT: ${sectorName}, Kharghar. Critical inundation possible along ${channel} low-lying belt. Evacuate basement and ground floors immediately to: ${shelter}. Follow Panvel Municipal advisory.`,
    hi: (sectorName, channel, shelter) =>
      `अति उच्च जोखीम सूचना: ${sectorName}, खारघर. ${channel} सखल भागात गंभीर जलभराव संभवतो. तातडीने सुरक्षित ठिकाणी स्थलांतर करा: ${shelter}.`
  }
};
