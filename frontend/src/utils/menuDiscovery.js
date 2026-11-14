const CATEGORY_TERMS = [
  ["burger", ["burger", "cheeseburger"]],
  ["waffle", ["waffle"]],
  ["pizza", ["pizza"]],
  ["sushi", ["sushi", "maki", "nigiri", "sashimi"]],
  ["noodles", ["noodle", "ramen", "udon", "pho"]],
  ["chicken", ["chicken", "wing", "tender"]],
  ["burrito", ["burrito", "quesarito"]],
  ["curry", ["curry", "masala"]],
];
const normalise = (value) => String(value ?? "").trim().toLowerCase();
const VALID_CATEGORIES = new Set(CATEGORY_TERMS.map(([category]) => category));
const PLURALS = { burger: "Burgers", waffle: "Waffles", pizza: "Pizzas", sushi: "Sushi", noodles: "Noodles", chicken: "Chicken", burrito: "Burritos", curry: "Curries" };

export function getDishCategory(item) {
  const explicit = normalise(item?.category);
  if (VALID_CATEGORIES.has(explicit)) return explicit;
  const name = normalise(item?.itemName);
  return CATEGORY_TERMS.find(([, keywords]) => keywords.some((word) => name.includes(word)))?.[0] || null;
}

export function pluralCategory(category) {
  return PLURALS[category] || "Dishes";
}

export function sameRestaurant(a, b) {
  if (!a || !b) return false;
  if (a.restaurantID != null && b.restaurantID != null) {
    return String(a.restaurantID) === String(b.restaurantID);
  }
  return Boolean(normalise(a.restaurantName)) && normalise(a.restaurantName) === normalise(b.restaurantName);
}

export function getRestaurantCategoryItems(menu = [], current, category = getDishCategory(current)) {
  if (!current || !category) return [];
  return menu.filter((item) => sameRestaurant(item, current) && getDishCategory(item) === category);
}

export function findSimilarDishes(current, menu = [], limit = 3) {
  if (!current || current.itemID == null) return [];
  return getRestaurantCategoryItems(menu, current)
    .filter((item) => String(item.itemID) !== String(current.itemID))
    .slice(0, limit);
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
