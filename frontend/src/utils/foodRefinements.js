// Second-level menu filters. Use dish names and ingredient lists, never restaurant names.
// Counts are calculated from the real nearby menu; unavailable options are hidden.
const RULES = {
  burger: [
    ["Beef", /\bbeef\b/i], ["Chicken", /\bchicken\b/i],
    ["Veggie", /\bveggie\b|\bvegetarian\b|\bbean patty\b|plant.based|pea protein/i],
    ["Vegan", "vegan"], ["Cheese", /cheese|cheddar/i],
    ["Bacon", /\bbacon\b/i], ["Spicy", /\bspicy\b|jalape[nñ]o|chill?i/i],
    ["Fish", /\bfish\b/i],
  ],
  sushi: [
    ["Salmon", /\bsalmon\b/i], ["Tuna", /\btuna\b/i],
    ["Nigiri", /nigiri/i], ["Maki", /\bmaki\b/i],
    ["Veggie", "veggie"], ["Tempura", /tempura/i],
    ["California", /california/i], ["Dragon", /\bdragon\b/i],
  ],
  pizza: [
    ["Pepperoni", /pepperoni/i], ["Chicken", /\bchicken\b|\bpollo\b/i],
    ["Veggie", "veggie-pizza"], ["Margherita", /margherita/i],
    ["Four cheese", /four cheese|four-cheese/i], ["Mushroom", /mushroom/i],
    ["Spicy", /\bspicy\b|chill?i/i], ["Meatball", /meatball/i],
  ],
  noodles: [
    ["Ramen", /ramen/i], ["Pho", /\bpho\b/i],
    ["Udon", /udon/i], ["Pad Thai", /pad thai/i],
    ["Chow Mein", /chow mein/i], ["Spicy", /\bspicy\b|chill?i/i],
    ["Chicken", /\bchicken\b/i], ["Veggie", "veggie"],
  ],
  chicken: [
    ["Wings", /\bwings?\b/i], ["Fried", /\bfried\b/i],
    ["Grilled", /\bgrilled\b/i], ["Tenders", /\btenders?\b/i],
    ["BBQ", /\bbbq\b|barbe?cue/i], ["Spicy", /\bspicy\b|\bhot\b|peri[ -]?peri|chill?i/i],
    ["Wraps", /\bwraps?\b/i], ["Bites", /\bbites?\b|\bpopcorn\b/i],
  ],
  curry: [
    ["Chicken", /\bchicken\b/i], ["Lamb", /\blamb\b/i],
    ["Veggie", "veggie"], ["Paneer", /paneer/i],
    ["Prawn", /prawn/i], ["Korma", /korma/i],
    ["Spicy", /\bspicy\b|vindaloo|chill?i/i], ["Chickpea", /chickpea|chana/i],
  ],
  burrito: [
    ["Chicken", /\bchicken\b/i], ["Beef", /\bbeef\b/i],
    ["Steak", /\bsteak\b|carne asada/i], ["Veggie", "veggie"],
    ["Bean", /\bbeans?\b/i], ["Spicy", /\bspicy\b|chipotle|chill?i/i],
    ["Breakfast", /breakfast/i], ["Pork", /\bpork\b|carnitas/i],
  ],
  waffle: [
    ["Chocolate", /chocolate|choco|nutella/i], ["Strawberry", /strawberr/i],
    ["Caramel", /caramel/i], ["Banana", /banana/i],
    ["Chicken", /\bchicken\b/i], ["Vegan", "vegan"],
    ["Classic", /classic|belgian/i], ["Bacon", /\bbacon\b/i],
  ],
};

const isVeganDish = (item) => item?.isVegan === true || item?.isVegan === 1 ||
  item?.isVegan === "1" || String(item?.isVegan).toLowerCase() === "true";
const foodText = (item) => `${item?.itemName || ""} ${item?.ingredients || ""}`;
const isVeggie = (item) => isVeganDish(item) ||
  /\bveggie\b|\bvegetarian\b|\bvegetables?\b|\bpaneer\b|\bchana\b|chickpea|\bplant.based\b/i.test(foodText(item));

export function matchesDishRefinement(item, category, label) {
  const rule = RULES[category]?.find(([name]) => name === label)?.[1];
  if (!rule || !item) return false;
  if (rule === "vegan") return isVeganDish(item);
  if (rule === "veggie") return isVeggie(item);
  if (rule === "veggie-pizza") return isVeggie(item) ||
    /roasted pepper|bell pepper/i.test(foodText(item));
  return rule.test(foodText(item));
}

export function getDishRefinementOptions(category, items = [], selected = "") {
  return (RULES[category] || [])
    .map(([label]) => ({
      label,
      count: items.filter((item) => matchesDishRefinement(item, category, label)).length,
    }))
    .filter(({ label, count }) => count > 0 || label === selected);
}
