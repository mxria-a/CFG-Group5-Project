const express = require("express");
const pool = require("../db"); // import the pool from the new module
const router = express.Router();

router.get("/near-restaurants", (req, res) => {
  const sql = `
    SELECT
        r.restaurantID,
        r.longitude,
        r.latitude,
        r.postcode
    FROM restaurants r
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Database error fetching comparison items:", err);
      return res.status(500).json({ error: "Database error fetching items" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
