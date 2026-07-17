const RESTAURANT_COORDS = {
  lat: 7.3018,
  lng: 5.139,
};

const ZONE_SURCHARGE: Record<string, number> = {
  'FUTA Core': 0,
  'Campus Hostels': 150,
  'Off Campus': 300,
};

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function getDistanceFromRestaurantKm(latitude: number, longitude: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(latitude - RESTAURANT_COORDS.lat);
  const dLng = toRadians(longitude - RESTAURANT_COORDS.lng);

  const lat1 = toRadians(RESTAURANT_COORDS.lat);
  const lat2 = toRadians(latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function estimateDeliveryFee(baseFee: number, zone?: string, distanceKm?: number): number {
  const zoneSurcharge = zone ? (ZONE_SURCHARGE[zone] ?? 150) : 150;

  let distanceSurcharge = 0;
  if (typeof distanceKm === 'number') {
    if (distanceKm > 8) distanceSurcharge = 450;
    else if (distanceKm > 5) distanceSurcharge = 300;
    else if (distanceKm > 2.5) distanceSurcharge = 150;
  }

  return Math.max(0, Math.round(baseFee + zoneSurcharge + distanceSurcharge));
}
