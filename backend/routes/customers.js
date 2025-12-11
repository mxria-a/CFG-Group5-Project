const express = require("express");
const pool = require("../db"); // import the pool from the new module
const router = express.Router();

// Creating route to get a customer by ID
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM customers WHERE customerID = ?";
  pool.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("Database error fetching customer:", err);
      return res.status(500).json({ error: "Database error fetching customer" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(results[0]);
  });
});

module.exports = router;
