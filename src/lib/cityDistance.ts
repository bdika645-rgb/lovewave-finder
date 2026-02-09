// Approximate distances between major Israeli cities (in km)
// Based on rough geographic coordinates

const cityCoords: Record<string, { lat: number; lon: number }> = {
  "תל אביב": { lat: 32.08, lon: 34.78 },
  "ירושלים": { lat: 31.77, lon: 35.21 },
  "חיפה": { lat: 32.79, lon: 34.99 },
  "באר שבע": { lat: 31.25, lon: 34.79 },
  "אשדוד": { lat: 31.80, lon: 34.65 },
  "נתניה": { lat: 32.33, lon: 34.86 },
  "הרצליה": { lat: 32.16, lon: 34.78 },
  "רמת גן": { lat: 32.07, lon: 34.81 },
  "פתח תקווה": { lat: 32.09, lon: 34.88 },
  "ראשון לציון": { lat: 31.97, lon: 34.80 },
  "רעננה": { lat: 32.18, lon: 34.87 },
  "כפר סבא": { lat: 32.18, lon: 34.91 },
  "רחובות": { lat: 31.90, lon: 34.81 },
  "מודיעין": { lat: 31.91, lon: 35.01 },
  "אילת": { lat: 29.56, lon: 34.95 },
  "טבריה": { lat: 32.79, lon: 35.53 },
  "נהריה": { lat: 33.00, lon: 35.09 },
  "עכו": { lat: 32.93, lon: 35.08 },
  "קריית שמונה": { lat: 33.21, lon: 35.57 },
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + 
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get approximate distance between two Israeli cities in km.
 * Returns null if either city is unknown.
 */
export function getCityDistance(city1?: string, city2?: string): number | null {
  if (!city1 || !city2) return null;
  if (city1 === city2) return 0;
  const c1 = cityCoords[city1];
  const c2 = cityCoords[city2];
  if (!c1 || !c2) return null;
  return Math.round(haversineDistance(c1.lat, c1.lon, c2.lat, c2.lon));
}

/**
 * Format distance as a human-readable Hebrew string.
 */
export function formatDistance(km: number | null): string | null {
  if (km === null) return null;
  if (km === 0) return "באותה עיר";
  if (km < 5) return "פחות מ-5 ק״מ";
  return `${km} ק״מ`;
}
