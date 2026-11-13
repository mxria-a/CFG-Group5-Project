const CATEGORY_TERMS = ["waffle", "burger", "pizza", "sushi", "ramen", "noodle", "chicken", "burrito", "wrap", "pasta", "curry", "salad", "sandwich", "taco", "pancake", "cookie", "rice", "fries"];
const normalise = (value) => String(value ?? "").trim().toLowerCase();
export function findSimilarDishes(current, menu = [], limit = 3) {
  if (!current || !current.restaurantName || !current.itemName) return [];
  const restaurant = normalise(current.restaurantName);
  const itemName = normalise(current.itemName);
  const category = CATEGORY_TERMS.find((term) => itemName.includes(term));
  if (!category) return [];
  return menu.filter((item) =>
    String(item.itemID) !== String(current.itemID) &&
    normalise(item.restaurantName) === restaurant &&
    normalise(item.itemName).includes(category)
  ).slice(0, limit);
}

// Frontend-only example options. These are NOT confirmed restaurant offerings.
const OPTION_GROUPS = {
  burger: {
    removals: ["Pickles", "Onions", "Lettuce", "Tomato"],
    extras: [{ id: "fries", name: "Fries", price: 2.50 }, { id: "cheese", name: "Extra cheese", price: 1.00 }, { id: "drink", name: "Drink", price: 1.75 }],
  },
  waffle: {
    removals: ["Whipped cream", "Syrup", "Strawberries"],
    extras: [{ id: "chocolate", name: "Chocolate sauce", price: 1.25 }, { id: "strawberries", name: "Extra strawberries", price: 1.50 }],
  },
  pizza: {
    removals: ["Onions", "Olives", "Mushrooms"],
    extras: [{ id: "cheese", name: "Extra cheese", price: 1.50 }, { id: "dip", name: "Garlic dip", price: .75 }],
  },
};
export function getDemoOptions(item) {
  const name = normalise(item?.itemName);
  const kind = Object.keys(OPTION_GROUPS).find((term) => name.includes(term));
  return OPTION_GROUPS[kind] || { removals: [], extras: [] };
}
