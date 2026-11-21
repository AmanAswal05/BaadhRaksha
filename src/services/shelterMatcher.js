/**
 * BaadhRaksha — Shelter Matcher & Capacity Management (Mumbai)
 * Rules:
 * - Do not recommend shelters in SEVERE risk areas
 * - Prioritize high capacity, ground-floor accessibility, proximity, and safety rating
 * - Overflow warning if occupancy > 90%
 */

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function matchShelters(location, sheltersList, options = {}, localities = []) {
  const targetLat = location.lat || 19.065;
  const targetLon = location.lon || 72.879;
  const peopleCount = options.peopleCount || 1;

  const evaluated = sheltersList.map(sh => {
    const availableCapacity = Math.max(0, sh.capacity - sh.occupancy);
    const occupancyPercent = Math.round((sh.occupancy / sh.capacity) * 100);
    const isFull = availableCapacity < peopleCount;
    const isOverflowWarning = occupancyPercent >= 90;

    const distKm = calculateDistanceKm(targetLat, targetLon, sh.lat, sh.lon);

    // Check if the shelter's locality is in severe risk
    const parentLoc = localities.find(l => l.id === sh.districtId);
    const isParentSevere = parentLoc && parentLoc.assessment && parentLoc.assessment.level === 'SEVERE';

    // 1. Proximity score (0 to 100)
    const distScore = Math.max(0, 100 - (distKm * 5));

    // 2. Available capacity score
    const capScore = isFull ? 0 : Math.round((availableCapacity / sh.capacity) * 100);

    // 3. Accessibility bonus
    const accessScore = sh.groundFloorAccess ? 100 : 50;

    // 4. Safety rating score
    let safetyScore = sh.safetyRating.includes('High') ? 100 : 70;
    if (isParentSevere) {
      safetyScore = 20; // Drastically penalize shelters situated inside active severe flood epicenters
    }

    let rankScore = 0;
    if (!isFull && !isParentSevere) {
      rankScore = Math.round(
        (0.40 * distScore) +
        (0.30 * capScore) +
        (0.15 * accessScore) +
        (0.15 * safetyScore)
      );
    }

    let recommendationReason = '';
    if (isFull) {
      recommendationReason = 'SHELTER AT CAPACITY (Overflow redirected to secondary center)';
    } else if (isParentSevere) {
      recommendationReason = 'ADVISORY: Surrounding locality under SEVERE waterlogging. Redirecting to higher-elevation center.';
    } else if (distKm <= 3.5 && availableCapacity >= 30) {
      recommendationReason = `Optimal high-ground proximity option (${distKm} km) with ${availableCapacity} open spaces and backup power.`;
    } else {
      recommendationReason = `Designated regional relief center with ${availableCapacity} remaining places.`;
    }

    return {
      ...sh,
      distKm,
      availableCapacity,
      occupancyPercent,
      isFull,
      isParentSevere,
      isOverflowWarning,
      rankScore,
      recommendationReason
    };
  });

  // Filter available and safe shelters
  const eligibleShelters = evaluated.filter(s => !s.isFull && !s.isParentSevere);
  eligibleShelters.sort((a, b) => b.rankScore - a.rankScore);

  const bestShelter = eligibleShelters[0] || evaluated[0];
  const alternatives = eligibleShelters.slice(1, 4);

  return {
    bestShelter,
    alternatives,
    allShelters: evaluated
  };
}
