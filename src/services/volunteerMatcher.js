/**
 * BaadhRaksha — Volunteer Matcher for Mumbai
 * Formula:
 * Match Score = 0.50 * Distance Score + 0.35 * Skill Match + 0.15 * Availability
 */

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function matchVolunteers(request, volunteersList) {
  // Default to Kurla coordinates if not provided
  const targetLat = request.lat || 19.065;
  const targetLon = request.lon || 72.879;
  const reqType = (request.typeOfHelp || 'Rescue').toLowerCase();
  const hasVulnerable = request.hasVulnerable || false;

  const scoredVolunteers = volunteersList.map(vol => {
    // 1. Distance score (higher is closer, max 100 at 0km, 0 at >= 25km within Mumbai urban bounds)
    const distKm = calculateDistanceKm(targetLat, targetLon, vol.lat, vol.lon);
    const distanceScore = Math.max(0, 100 - (distKm * 4));

    // 2. Skill match
    let skillScore = 30;
    const volSkills = vol.skills.map(s => s.toLowerCase());

    if (reqType.includes('boat')) {
      if (volSkills.some(s => s.includes('boat'))) skillScore = 100;
      else if (volSkills.some(s => s.includes('rescue'))) skillScore = 65;
    } else if (reqType.includes('medical')) {
      if (volSkills.some(s => s.includes('medical'))) skillScore = 100;
      else if (volSkills.some(s => s.includes('first aid'))) skillScore = 80;
    } else if (reqType.includes('food')) {
      if (volSkills.some(s => s.includes('food'))) skillScore = 100;
      else skillScore = 55;
    } else {
      // General Rescue
      if (volSkills.some(s => s.includes('rescue') || s.includes('boat'))) skillScore = 100;
      else if (volSkills.some(s => s.includes('first aid'))) skillScore = 70;
    }

    // 3. Availability score
    const availScore = vol.available ? 100 : 20;

    // Composite explainable score
    const matchScore = Math.round(
      (0.50 * distanceScore) +
      (0.35 * skillScore) +
      (0.15 * availScore)
    );

    // Human-readable reason
    let reason = '';
    if (distKm <= 3.5 && skillScore >= 90) {
      reason = `Selected because of immediate proximity (${distKm} km) and verified ${vol.skills[0]} rescue capabilities.`;
    } else if (skillScore >= 90) {
      reason = `Specialized responder for ${request.typeOfHelp} stationed within immediate response radius (${distKm} km).`;
    } else {
      reason = `Community auxiliary responder available nearby (${distKm} km).`;
    }

    return {
      ...vol,
      distanceKm: distKm,
      matchScore,
      distanceScore: Math.round(distanceScore),
      skillScore,
      availScore,
      selectionReason: reason
    };
  });

  // Sort descending by match score
  scoredVolunteers.sort((a, b) => b.matchScore - a.matchScore);

  return {
    bestMatch: scoredVolunteers[0],
    alternatives: scoredVolunteers.slice(1, 3),
    allMatches: scoredVolunteers,
    priority: hasVulnerable ? 'HIGH (Vulnerable Persons Present)' : 'STANDARD'
  };
}
