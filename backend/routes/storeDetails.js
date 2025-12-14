const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/store-details", (req, res) => {
  const { firstName, lastName, email, address, postcode, phone } = req.body;

  if (!firstName || !lastName || !email || !address || !postcode || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO customers (firstName, lastName, emailAddress, phoneNumber, address, postcode) VALUES (?, ?, ?, ?, ?, ?)";

  pool.query(
    sql,
    [firstName, lastName, email, phone, address, postcode],
    (err, result) => {
      if (err) {
        console.error("error inserting customer: ", err.message);
        return res.status(500).json({ error: "database error" });
      }
      res.status(201).json({
        message: "customer details saved",
        id: result.insertId,
      });
    }
  );
});

module.exports = router;
