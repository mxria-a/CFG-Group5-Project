const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/submit-order", (req, res) => {
  const { customerId, item } = req.body;

  if (!customerId || !item || !item.price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO orders (itemID, customerID, totalPrice) VALUES (?,?,?)";
  pool.query(sql, [item.itemID, customerId, item.price], (err, result) => {
    if (err) {
      console.error("Error inserting order: ", err.message);
    }
    res.status(201).json({ message: "Order placed successfully " });
  });
});

module.exports = router;
