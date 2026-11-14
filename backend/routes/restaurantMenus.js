const express = require("express");
const pool = require("../db");
const router = express.Router();

const CATEGORIES = new Set(["burger", "sushi", "chicken", "waffle", "burrito", "pizza", "noodles", "curry"]);

// Returns the same item fields as /comparison-table-items for one restaurant.
router.get("/restaurants/:restaurantId/items", (req, res) => {
  const rawId = String(req.params.restaurantId);
  if (!/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(Number(rawId))) {
    return res.status(400).json({ error: "Invalid restaurant ID" });
  }
  const category = req.query.category == null ? "" : String(req.query.category).toLowerCase();
  if (category && !CATEGORIES.has(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const sql = `
    SELECT
      i.itemID, i.restaurantID, i.category, i.itemName, i.price,
      i.avRating, i.calories, i.description, i.ingredients, i.isVegan,
      r.restaurantName, r.deliveryTime, r.postcode, r.latitude, r.longitude,
      GROUP_CONCAT(DISTINCT a.allergenName ORDER BY a.allergenName SEPARATOR ', ') AS allergens
    FROM items i
    JOIN restaurants r ON i.restaurantID = r.restaurantID
    LEFT JOIN item_allergens ia ON i.itemID = ia.itemID
    LEFT JOIN allergens a ON ia.allergenID = a.allergenID
    WHERE i.restaurantID = ? ${category ? "AND i.category = ?" : ""}
    GROUP BY i.itemID
    ORDER BY i.itemName ASC
  `;
  const values = category ? [Number(rawId), category] : [Number(rawId)];
  pool.query(sql, values, (err, rows) => {
    if (err) {
      console.error("Unable to load restaurant menu:", err);
      return res.status(500).json({ error: "Unable to load restaurant menu" });
    }
    return res.status(200).json(rows);
  });
});

module.exports = router;
