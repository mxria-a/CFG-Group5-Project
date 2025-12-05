const { get } = require("../../routes/nearRestaurants");
const { getDistance } = require("./distanceCalculator");

//for tests got lon/lats fron latlong.net
//lon1, lat1, lon2, lat2

//using an address in canterbury and in south wales
test("get number >100", () => {
  expect(
    getDistance(1.105941, 51.269836, -3.928809, 51.603039)
  ).toBeGreaterThan(100);
});

//using two addresses in canterbury
test("get number <1", () => {
  expect(getDistance(1.075582, 51.277209, 1.082058, 51.277934)).toBeLessThan(5);
});

//using two addresses in london
test("get number <5", () => {
  expect(getDistance(-0.141395, 51.524318, -0.107002, 51.513903)).toBeLessThan(
    5
  );
});
