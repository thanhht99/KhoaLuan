export const Distance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const lat1_1 = toRad(lat1);
  const lat2_2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) *
      Math.sin(dLng / 2) *
      Math.cos(lat1_1) *
      Math.cos(lat2_2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

// Converts numeric degrees to radians
const toRad = (Value) => {
  return (Value * Math.PI) / 180;
};
