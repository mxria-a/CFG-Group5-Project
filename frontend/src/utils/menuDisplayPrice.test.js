import { attachMenuStartingPrices, getItemComparablePrice, getItemDisplayPrice } from "./menuDisplayPrice";

const originalFetch = global.fetch;

afterEach(() => { global.fetch = originalFetch; });

test("all displayed pizza prices use the cheapest size instead of the base price", async () => {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ sizes: [
      { id: 2, name: "Medium", price: "9.00", isDefault: true },
      { id: 3, name: "Small", price: "7.50", isDefault: false },
      { id: 1, name: "Large", price: "12.00", isDefault: false },
    ] }),
  }));
  const [pizza, burger] = await attachMenuStartingPrices([
    { itemID: 99551, itemName: "Margherita Pizza", category: "pizza", price: "9.00" },
    { itemID: 99552, itemName: "Classic Burger", category: "burger", price: "8.50" },
  ]);
  expect(getItemDisplayPrice(pizza)).toBe("From £7.50");
  expect(getItemComparablePrice(pizza)).toBe(7.5);
  expect(getItemDisplayPrice(burger)).toBe("£8.50");
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("never shows the misleading regular-size price if the pricing API is unavailable", async () => {
  global.fetch = jest.fn(async () => { throw new Error("Unavailable"); });
  const [pizza] = await attachMenuStartingPrices([
    { itemID: 99553, itemName: "Test Pizza", category: "pizza", price: "9.00" },
  ]);
  expect(getItemDisplayPrice(pizza)).toBe("Price on selection");
  expect(getItemComparablePrice(pizza)).toBeNull();
});
