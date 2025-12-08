//Creating a route to get coordinates from postcodes
const express = require("express");
const { getLocation } = require("../services/location/postcodeCalling");
const router = express.Router();

router.get("/coordinates/:postcode", async (req, res) => {
  try {
    const location = await getLocation(req.params.postcode);

    if (!location) {
      return res.status(400).json({ error: "Invalid postcode" });
    }

    res.json(location);
  } catch (err) {
    console.error("Coordinate fetch error", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
