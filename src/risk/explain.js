/**
 * BaadhRaksha — Risk Explanation Generator
 * Produces clear, plain-language reasoning for why a district is at its current risk category.
 */

export function generateRiskExplanation(assessment, lang = 'en') {
  const isHi = lang === 'hi';
  const score = assessment.score;
  const level = assessment.level;
  const comps = assessment.components || {};

  if (isHi) {
    if (level === 'SEVERE') {
      return `अति गंभीर जोखिम (${score}%): कोसी/गंडक/बागमती नदी खतरे के निशान से ऊपर बह रही है, बैराज से भारी जलप्रवाह जारी है और तटबंधों पर अत्यधिक दबाव है। तुरंत सुरक्षित स्थानों/राहत शिविरों की ओर जाएं।`;
    }
    if (level === 'HIGH') {
      return `उच्च जोखिम (${score}%): अत्यधिक वर्षा एवं नदी के बढ़ते जलस्तर के कारण निचले रिहायशी इलाकों में जलभराव की गंभीर आशंका है। आपातकालीन किट तैयार रखें।`;
    }
    if (level === 'MODERATE') {
      return `मध्यम जोखिम (${score}%): वर्षा और नदी के स्तर पर लगातार निगरानी की जा रही है। दियारा एवं निचले क्षेत्रों में रहने वाले लोग सतर्क रहें।`;
    }
    return `कम जोखिम (${score}%): वर्तमान में जल निकासी स्थिर है एवं प्रमुख नदियां खतरे के निशान से नीचे बह रही हैं।`;
  }

  // English
  if (level === 'SEVERE') {
    return `Severe Risk (${score}%): River stage flowing well above Danger Level with extreme upstream barrage discharge and heavy precipitation. Embankment overtopping likely in low-lying pockets. Immediate evacuation advised.`;
  }
  if (level === 'HIGH') {
    return `High Risk (${score}%): Intense rainfall and rising tributary flow creating localized inundation and drainage congestion. High vigilance and emergency kit readiness required.`;
  }
  if (level === 'MODERATE') {
    return `Moderate Risk (${score}%): River levels approaching warning threshold with moderate monsoon precipitation. Diara tracts and low-lying agricultural zones under active watch.`;
  }
  return `Low Risk (${score}%): River levels and drainage outfalls operating within safe margins. Continuous telemetry watch active.`;
}
