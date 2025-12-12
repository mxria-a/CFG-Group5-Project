const express = require("express");
const pool = require("../db");
const router = express.Router();

// Creating route to get allergens displayed in dropdown
router.get("/allergens", (req, res) => {
  const sql = "SELECT * FROM allergens";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Database error fetching allergens:", err);
      return res
        .status(500)
        .json({ error: "Database error fetching allergens" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
