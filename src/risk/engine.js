/**
 * BaadhRaksha — Transparent Flood Risk Engine (Kharghar Hydrology Model)
 * 
 * Hazard Model:
 *  - Rainfall Intensity (25%)
 *  - Rainfall Accumulation (20%)
 *  - Drainage & Sluice Culvert Condition (20%)
 *  - Low-Lying Exposure Factor (20%)
 *  - Tidal Resistance / Water Level (15%)
 * 
 * Normalized strictly to 0 - 100.
 * 
 * Standard Risk Categories (Accurate, transparent labels):
 *  0 - 24: LOWER MODELED RISK (Green)
 * 25 - 49: MODERATE MODELED RISK (Yellow)
 * 50 - 74: HIGH MODELED RISK (Orange)
 * 75 - 100: VERY HIGH MODELED RISK (Red)
 */

export const RISK_CONFIG = {
  weights: {
    rainfallIntensity: 0.25,
    rainfallAccumulation: 0.20,
    drainageCondition: 0.20,
    lowLyingFactor: 0.20,
    riverWaterLevel: 0.15
  }
};

export const RISK_LEVELS = {
  LOW: {
    key: 'LOW',
    labelEn: 'LOWER MODELED RISK',
    labelHi: 'कम आकलित जोखिम',
    color: '#10b981', // Green
    badgeClass: 'badge-low',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    range: [0, 24]
  },
  MODERATE: {
    key: 'MODERATE',
    labelEn: 'MODERATE MODELED RISK',
    labelHi: 'मध्यम आकलित जोखिम',
    color: '#eab308', // Yellow
    badgeClass: 'badge-medium',
    bgLight: 'rgba(234, 179, 8, 0.15)',
    range: [25, 49]
  },
  HIGH: {
    key: 'HIGH',
    labelEn: 'HIGH MODELED RISK',
    labelHi: 'उच्च आकलित जोखिम',
    color: '#f97316', // Orange
    badgeClass: 'badge-high',
    bgLight: 'rgba(249, 115, 22, 0.15)',
    range: [50, 74]
  },
  SEVERE: {
    key: 'SEVERE',
    labelEn: 'VERY HIGH MODELED RISK',
    labelHi: 'अति उच्च आकलित जोखिम',
    color: '#ef4444', // Red
    badgeClass: 'badge-severe',
    bgLight: 'rgba(239, 68, 68, 0.18)',
    range: [75, 100]
  }
};

/**
 * Determine risk level object from 0-100 score
 */
export function getRiskLevel(score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped <= 24) return RISK_LEVELS.LOW;
  if (clamped <= 49) return RISK_LEVELS.MODERATE;
  if (clamped <= 74) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.SEVERE;
}

/**
 * Evaluates sector risk score based on hydrology parameters and simulation modifiers
 */
export function evaluateDistrictRisk(district, modifiers = {}) {
  const rainMult = modifiers.rainfallMult !== undefined ? modifiers.rainfallMult : 1.0;
  const riverMult = modifiers.riverMult !== undefined ? modifiers.riverMult : 1.0;

  const rainfallIntensity = Math.min(100, (district.rainfallIntensity || 50) * rainMult);
  const rainfallAccumulation = Math.min(100, (district.rainfallAccumulation || 50) * rainMult);
  const drainageCondition = district.drainageCondition || 50;
  const lowLyingFactor = district.lowLyingFactor || 50;
  const riverWaterLevel = Math.min(100, (district.baseRisk || 50) * riverMult);

  // Raw weighted score (0 - 100)
  const score = Math.round(
    rainfallIntensity * RISK_CONFIG.weights.rainfallIntensity +
    rainfallAccumulation * RISK_CONFIG.weights.rainfallAccumulation +
    drainageCondition * RISK_CONFIG.weights.drainageCondition +
    lowLyingFactor * RISK_CONFIG.weights.lowLyingFactor +
    riverWaterLevel * RISK_CONFIG.weights.riverWaterLevel
  );

  const clampedScore = Math.max(0, Math.min(100, score));
  const levelObj = getRiskLevel(clampedScore);

  return {
    score: clampedScore,
    level: levelObj.key,
    labelEn: levelObj.labelEn,
    labelHi: levelObj.labelHi,
    color: levelObj.color,
    badgeClass: levelObj.badgeClass,
    isDemo: true
  };
}
