const express = require("express");
const pool = require("../db");
const router = express.Router();

// Creating route for order history
router.get("/:customerId", (req, res) => {
  const sql = `
    SELECT o.orderID, o.totalPrice, o.orderDetails, o.orderTime, i.itemName
    FROM orders o
    JOIN items i ON o.itemID = i.itemID
    WHERE o.customerID = ?
    ORDER BY o.orderTime DESC
  `;

  pool.query(sql, [req.params.customerId], (err, results) => {
    if (err) {
      console.error("Database error fetching orders:", err);
      return res.status(500).json({ error: "Database error fetching orders" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
