import { buildBasketSummary } from "./basketSummary";

const pizza = { itemID: 51, itemName: "Margherita Pizza", restaurantName: "Pizza Express", restaurantID: 45, price: "9.00" };
const burger = { itemID: 8, itemName: "Burger", restaurantName: "Burger King", restaurantID: 11, price: "8.00" };
const quoted = { key: "large-pizza", itemID: 51, itemName: pizza.itemName, restaurantName: pizza.restaurantName, restaurantID: 45, size: { id: 1, name: "Large" }, removed: ["Basil"], extras: [{ id: 9, name: "Mozzarella", price: 1 }], unitPrice: 13, quantity: 2 };

test("groups standard and differently customised items by restaurant, preserving each line", () => {
  const summary = buildBasketSummary([pizza, burger], { 51: 1, 8: 1 }, { "large-pizza": quoted });
  expect(summary.groups).toHaveLength(2);
  expect(summary.groups[0].items).toHaveLength(2);
  expect(summary.groups[0].subtotalPence).toBe(3500);
  expect(summary.itemCount).toBe(4);
  expect(summary.foodSubtotalPence).toBe(4300);
  expect(summary.deliveryFeesPence).toBe(430);
  expect(summary.serviceFeePence).toBe(149);
  expect(summary.totalPence).toBe(4879);
});

test("removing the last item from a restaurant removes only its delivery fee", () => {
  const both = buildBasketSummary([pizza, burger], { 51: 1, 8: 1 });
  const one = buildBasketSummary([pizza, burger], { 51: 1 });
  expect(both.deliveryFeesPence - one.deliveryFeesPence).toBe(180);
  expect(one.groups).toHaveLength(1);
});

test("empty basket has no fees and ignores zero-quantity rows", () => {
  const empty = buildBasketSummary([pizza], { 51: 0 });
  expect(empty.totalPence).toBe(0);
  expect(empty.groups).toEqual([]);
});
