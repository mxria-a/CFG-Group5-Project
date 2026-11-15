const test = require("node:test");
const assert = require("node:assert/strict");
const { priceCustomisation, SelectionError } = require("./customisationPricing");

const pizza = {
  item: { itemID: 45, itemName: "Demo Margherita Pizza", restaurantName: "Demo Pizzeria", category: "pizza", price: "9.00" },
  sizes: [
    { sizeID: 1, sizeCode: "small", sizeName: "Small", price: "7.50" },
    { sizeID: 2, sizeCode: "medium", sizeName: "Medium", price: "9.00" },
    { sizeID: 3, sizeCode: "large", sizeName: "Large", price: "12.00" },
  ],
  removals: [ { removalID: 10, ingredientName: "Tomato" } ],
  extras: [
    { extraID: 20, extraName: "Olives", price: "0.80" },
    { extraID: 21, extraName: "Mushrooms", price: "0.90" },
  ],
};
const burger = {
  item: { itemID: 1, itemName: "Demo Burger", restaurantName: "Demo Grill", category: "burger", price: "8.50" },
  sizes: [], removals: [], extras: [ { extraID: 1, extraName: "Extra pickles", price: "0.40" } ],
};

test("pizza size, extras, removals, and quantity are server-priced in pennies", () => {
  const quote = priceCustomisation(pizza, { sizeId: 3, removalIds: [10], extraIds: [20, 21], quantity: 2, price: "0.01" });
  assert.equal(quote.unitPrice, "13.70");
  assert.equal(quote.totalPrice, "27.40");
  assert.equal(quote.size.name, "Large");
  assert.deepEqual(quote.removals, [ { id: 10, name: "Tomato" } ]);
  assert.equal(quote.basePrice, "9.00");
});

test("un-sized dishes use their base price", () => {
  const quote = priceCustomisation(burger, { extraIds: [1], quantity: 1 });
  assert.equal(quote.unitPrice, "8.90");
  assert.equal(quote.size, null);
});

test("a size is required when the dish offers sizes", () => {
  assert.throws(() => priceCustomisation(pizza, { extraIds: [] }), SelectionError);
});

test("size from a different dish is rejected", () => {
  assert.throws(() => priceCustomisation(pizza, { sizeId: 99 }), /not available/);
});

test("extras from a different dish are rejected", () => {
  assert.throws(() => priceCustomisation(pizza, { sizeId: 2, extraIds: [999] }), /not available/);
});

test("ingredient removals not offered on the dish are rejected", () => {
  assert.throws(() => priceCustomisation(pizza, { sizeId: 2, removalIds: [123] }), /not available/);
});

test("duplicates are rejected to prevent duplicate charges", () => {
  assert.throws(() => priceCustomisation(pizza, { sizeId: 2, extraIds: [20, 20] }), /duplicate/);
});

test("invalid quantities are rejected", () => {
  for (const quantity of [-1, 0, 11, 1.5, "2", null]) {
    assert.throws(() => priceCustomisation(pizza, { sizeId: 2, quantity }), /Quantity/);
  }
});

test("a size cannot be added to a dish without size options", () => {
  assert.throws(() => priceCustomisation(burger, { sizeId: 2 }), /no size options/);
});
