"use strict";

const express = require("express");
const pool = require("../db");
const { priceCustomisation, SelectionError, toId } = require("../services/customisationPricing");
const router = express.Router();

function parseId(raw) {
  if (!/^[1-9]\d*$/.test(String(raw)) || !Number.isSafeInteger(Number(raw))) {
    throw new SelectionError("Invalid dish ID.");
  }
  return Number(raw);
}

const itemSQL = `
  SELECT i.itemID, i.itemName, i.restaurantID, r.restaurantName, i.category, i.price
  FROM items i JOIN restaurants r ON r.restaurantID = i.restaurantID
  WHERE i.itemID = ? LIMIT 1
`;
const sizesSQL = `
  SELECT sizeID, sizeCode, sizeName, price, isDefault
  FROM item_customisation_sizes WHERE itemID = ? ORDER BY sortOrder, sizeID
`;
const removalsSQL = `
  SELECT removalID, ingredientName
  FROM item_customisation_removals WHERE itemID = ? ORDER BY sortOrder, removalID
`;
const extrasSQL = `
  SELECT extraID, extraName, price
  FROM item_customisation_extras WHERE itemID = ? ORDER BY sortOrder, extraID
`;

async function loadCatalogue(itemID) {
  const db = pool.promise();
  const [[items], [sizes], [removals], [extras]] = await Promise.all([
    db.query(itemSQL, [itemID]),
    db.query(sizesSQL, [itemID]),
    db.query(removalsSQL, [itemID]),
    db.query(extrasSQL, [itemID]),
  ]);
  return items.length ? { item: items[0], sizes, removals, extras } : null;
}

function handleError(res, error) {
  if (error instanceof SelectionError) return res.status(400).json({ error: error.message });
  console.error("Customisation API error:", error);
  return res.status(500).json({ error: "Unable to process customisation." });
}

// Read demo size, ingredient removal and extra choices for one dish.
router.get("/items/:itemId/customisation-options", async (req, res) => {
  try {
    const catalogue = await loadCatalogue(parseId(req.params.itemId));
    if (!catalogue) return res.status(404).json({ error: "Dish not found." });
    return res.status(200).json({
      item: {
        itemID: catalogue.item.itemID,
        itemName: catalogue.item.itemName,
        restaurantName: catalogue.item.restaurantName,
        category: catalogue.item.category,
        basePrice: String(catalogue.item.price),
      },
      sizes: catalogue.sizes.map((row) => ({
        id: row.sizeID, code: row.sizeCode, name: row.sizeName,
        price: String(row.price), isDefault: Boolean(row.isDefault),
      })),
      removals: catalogue.removals.map((row) => ({ id: row.removalID, name: row.ingredientName })),
      extras: catalogue.extras.map((row) => ({ id: row.extraID, name: row.extraName, price: String(row.price) })),
      isDemo: true,
      disclaimer: "Demo customisation options and prices; not verified restaurant offerings. Always confirm allergens with the restaurant.",
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// Never accept a client-calculated price. Validate each selection against database options.
router.post("/customisations/quote", async (req, res) => {
  try {
    const { itemId, sizeId = null, removalIds = [], extraIds = [], quantity = 1 } = req.body || {};
    toId(itemId, "itemId");
    const catalogue = await loadCatalogue(itemId);
    if (!catalogue) return res.status(404).json({ error: "Dish not found." });
    return res.status(200).json(priceCustomisation(catalogue, { sizeId, removalIds, extraIds, quantity }));
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
