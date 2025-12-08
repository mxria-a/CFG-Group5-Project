//calculates distances between long/lats
//using the Haversine formula

function getDistance(lon1, lat1, lon2, lat2) {
  const R = 6371; // radius of the earth in km
  const dLon = deg2rad(lon2 - lon1);
  const dLat = deg2rad(lat2 - lat1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; //distance in km

  //return the distance to be used for the sql filtering
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = { getDistance };
