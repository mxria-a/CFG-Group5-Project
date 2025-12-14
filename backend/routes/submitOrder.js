const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/submit-order", (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }
});
