import { getDishRefinementOptions, matchesDishRefinement } from "./foodRefinements";

const dish = (itemName, ingredients = "", isVegan = 0) => ({ itemName, ingredients, isVegan });

describe("Pickier specific dish filters", () => {
  test.each([
    ["pizza", "Pepperoni", dish("Pepperoni Feast Pizza", "Pepperoni and cheese")],
    ["pizza", "Chicken", dish("Pollo Pesto Pizza", "Pesto and mozzarella")],
    ["pizza", "Veggie", dish("Roasted Pepper Pizza", "Peppers, mozzarella")],
    ["burger", "Beef", dish("Classic Burger", "Beef patty")],
    ["burger", "Vegan", dish("Plant Burger", "Plant-based patty", 1)],
    ["sushi", "Salmon", dish("Salmon Nigiri Sushi Set", "Rice and salmon")],
    ["sushi", "Veggie", dish("Vegan Maki", "Cucumber and rice", 1)],
    ["noodles", "Pho", dish("Classic Beef Pho", "Rice noodles")],
    ["noodles", "Ramen", dish("Chicken Ramen", "Broth and noodles")],
    ["chicken", "Wings", dish("BBQ Wings", "Chicken")],
    ["curry", "Paneer", dish("Paneer Tikka Masala", "Paneer and spices")],
    ["burrito", "Steak", dish("Carne Asada Burrito", "Rice and salsa")],
    ["waffle", "Strawberry", dish("Strawberry Waffle", "Fresh strawberries")],
  ])("matches %s / %s", (category, name, item) => {
    expect(matchesDishRefinement(item, category, name)).toBe(true);
  });

  test("does not mistake a restaurant name for a dish ingredient", () => {
    expect(matchesDishRefinement({ ...dish("Cheese Pizza"), restaurantName: "Pepperoni House" }, "pizza", "Pepperoni")).toBe(false);
  });

  test("does not include unrelated dishes", () => {
    expect(matchesDishRefinement(dish("Margherita Pizza", "Cheese and basil"), "pizza", "Pepperoni")).toBe(false);
    expect(matchesDishRefinement(dish("Tuna Roll", "Tuna and rice"), "sushi", "Salmon")).toBe(false);
    expect(matchesDishRefinement(dish("Chicken Burger", "Grilled chicken"), "burger", "Beef")).toBe(false);
  });

  test("counts only matching dishes and hides unavailable filters", () => {
    const items = [dish("Margherita Pizza"), dish("Pepperoni Pizza"), dish("Chicken Pizza")];
    const options = getDishRefinementOptions("pizza", items);
    expect(options.find((option) => option.label === "Pepperoni")?.count).toBe(1);
    expect(options.find((option) => option.label === "Chicken")?.count).toBe(1);
    expect(options.some((option) => option.label === "Meatball")).toBe(false);
  });

  test("keeps an active filter visible even when the new postcode has no matches", () => {
    expect(getDishRefinementOptions("pizza", [], "Pepperoni")).toEqual([{ label: "Pepperoni", count: 0 }]);
  });

  test.each([
    ["burger", dish("Beef Burger")],
    ["pizza", dish("Pepperoni Pizza")],
    ["sushi", dish("Salmon Nigiri")],
    ["noodles", dish("Chicken Ramen")],
    ["chicken", dish("BBQ Chicken Wings")],
    ["curry", dish("Lamb Korma")],
    ["burrito", dish("Bean Burrito")],
    ["waffle", dish("Chocolate Waffle")],
  ])("provides refinements for %s", (category, item) => {
    expect(getDishRefinementOptions(category, [item]).length).toBeGreaterThan(0);
  });
});
