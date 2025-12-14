const express = require("express");
const pool = require("../db"); // your MySQL pool
const router = express.Router();

router.get("/addresses/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  const sql = "SELECT address FROM customers WHERE customerID = ?";
  pool.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error("Database error fetching addresses:", err);
      return res
        .status(500)
        .json({ error: "Database error fetching addresses" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Addresses not found" });
    }

    // Return only the first row (assuming one set of addresses per customer)
    res.status(200).json(results[0]);
  });
});

module.exports = router;
