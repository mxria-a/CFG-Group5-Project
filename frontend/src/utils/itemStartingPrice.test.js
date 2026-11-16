import { getLowestPricedSize, getStartingPrice, formatStartingPrice } from "./itemStartingPrice";

test("uses the cheapest available pizza size, irrespective of backend default or ordering", () => {
  const sizes = [{ id: 3, price: "7.50", isDefault: false }, { id: 2, price: "9.00", isDefault: true }, { id: 1, price: "12.00" }];
  expect(getLowestPricedSize(sizes).id).toBe(3);
  expect(getStartingPrice("9.00", sizes)).toEqual({ price: 7.5, hasSizes: true });
  expect(formatStartingPrice("9.00", sizes)).toBe("From £7.50");
});

test("does not advertise 'From' when an item has no sizes", () => {
  expect(formatStartingPrice("8.00", [])).toBe("£8.00");
});

test("ignores malformed size prices", () => {
  expect(formatStartingPrice("6.00", [{ price: "not-a-price" }, { price: "11.50" }])).toBe("From £11.50");
  expect(formatStartingPrice("6.00", [{ price: null }])).toBe("£6.00");
});
