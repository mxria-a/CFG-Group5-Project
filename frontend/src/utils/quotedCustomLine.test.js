import { createQuotedCustomLine } from "./quotedCustomLine";

const item = { itemID: 51, itemName: "Margherita Pizza", restaurantName: "Pizza Express" };
const quote = {
  itemID: 51, unitPrice: "14.00", totalPrice: "28.00", quantity: 2,
  size: { id: 1, name: "Large", price: "12.00" },
  removals: [{ id: 9, name: "Mozzarella" }],
  extras: [{ id: 42, name: "Mushrooms", price: "2.00" }],
};

test("a server quote creates a named, priced and sized basket line", () => {
  const line = createQuotedCustomLine(item, quote);
  expect(line.size.name).toBe("Large");
  expect(line.removed).toEqual(["Mozzarella"]);
  expect(line.extras[0].name).toBe("Mushrooms");
  expect(line.unitPrice).toBe(14);
  expect(line.quantity).toBe(2);
});

test("size, extra and removal changes create distinct basket keys", () => {
  const large = createQuotedCustomLine(item, quote);
  expect(createQuotedCustomLine(item, { ...quote, size: { id: 2, name: "Medium" } }).key).not.toBe(large.key);
  expect(createQuotedCustomLine(item, { ...quote, removals: [] }).key).not.toBe(large.key);
  expect(createQuotedCustomLine(item, { ...quote, extras: [] }).key).not.toBe(large.key);
});

test("invalid totals and mismatching dishes are never put in the basket", () => {
  expect(createQuotedCustomLine(item, { ...quote, totalPrice: "1.00" })).toBeNull();
  expect(createQuotedCustomLine(item, { ...quote, itemID: 999 })).toBeNull();
});
