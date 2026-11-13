import { findSimilarDishes, getDemoOptions } from "./menuDiscovery";

const menu = [
  { itemID: 1, restaurantName: "Sunday Brunch", itemName: "Classic Belgian Waffle" },
  { itemID: 2, restaurantName: "Sunday Brunch", itemName: "Chocolate Waffle" },
  { itemID: 3, restaurantName: "Another Restaurant", itemName: "Strawberry Waffle" },
  { itemID: 4, restaurantName: "Sunday Brunch", itemName: "Cheeseburger" },
];
test("similar items stay within the same restaurant and food type", () => {
  expect(findSimilarDishes(menu[0], menu)).toEqual([menu[1]]);
});
test("an unrecognised dish type shows no unrelated suggestions", () => {
  expect(findSimilarDishes({ itemID: 5, restaurantName: "Sunday Brunch", itemName: "Chef special" }, menu)).toEqual([]);
});
test("customisation choices are clearly demo data and include example burger extras", () => {
  const options = getDemoOptions({ itemName: "Classic Cheeseburger" });
  expect(options.removals).toContain("Pickles");
  expect(options.extras.find((option) => option.id === "fries").price).toBe(2.5);
});
