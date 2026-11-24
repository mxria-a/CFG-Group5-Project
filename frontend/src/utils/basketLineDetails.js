export function getBasketLineDetails(line) {
  const selected = [
    ...(line.size ? [`${line.size.name} size`] : []),
    ...(line.removed || []).map((name) => `No ${String(name).toLowerCase()}`),
    ...(line.extras || []).map((extra) => `Extra ${extra.name}`),
  ];
  if (selected.length) return selected;
  if (line.type === "custom") return [];
  const ingredients = Array.isArray(line.ingredients)
    ? line.ingredients
    : String(line.ingredients || "").split(/[,;]+/);
  return ingredients.map((value) => String(value).trim()).filter(Boolean);
}
