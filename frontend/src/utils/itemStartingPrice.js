// Use the actual lowest available size price when a dish is offered in multiple sizes.
const validMoney = (value) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;

export function getLowestPricedSize(sizes) {
  if (!Array.isArray(sizes)) return null;
  return sizes.filter((size) => validMoney(size?.price)).reduce((lowest, size) =>
    !lowest || Number(size.price) < Number(lowest.price) ? size : lowest, null);
}

export function getStartingPrice(basePrice, sizes) {
  const lowest = getLowestPricedSize(sizes);
  if (lowest) return { price: Number(lowest.price), hasSizes: true };
  return { price: validMoney(basePrice) ? Number(basePrice) : null, hasSizes: false };
}

export function formatStartingPrice(basePrice, sizes) {
  const { price, hasSizes } = getStartingPrice(basePrice, sizes);
  return price === null ? "Price unavailable" : `${hasSizes ? "From " : ""}£${price.toFixed(2)}`;
}
