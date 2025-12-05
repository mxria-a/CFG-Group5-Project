const { getLocation } = require("./postcodeCalling");
const axios = require("axios");

//mock API call
jest.mock("axios");

//test for successful API response
test("returns correct values", async () => {
  axios.get.mockResolvedValue({
    data: {
      result: {
        longitude: 1,
        latitude: 1,
      },
    },
  });
  expect(await getLocation("N1 1AB")).toEqual({
    longitude: 1,
    latitude: 1,
  });
});

//test for error
test("gives API error when API call fails", async () => {
  axios.get.mockRejectedValue(new Error("API error"));
  await expect(getLocation("N111")).rejects.toThrow("API error");
});
