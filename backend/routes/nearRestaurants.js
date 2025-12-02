//This file pulls together the postcode calling, mySQL calling and distance calculation
const express = require("express");
const pool = require("../db"); // import the pool from the new module
const { getLocation } = require("../services/location/postcodeCalling");
const { getDistance } = require("../services/location/distanceCalculator");

const router = express.Router();

//route to find restaurants near a given postcode
router.get("/near-restaurants/:postcode", async (req, res) => {
  const userPostcode = req.params.postcode;

  try {
    //get coordinates for user postcode
    const userCoords = await getLocation(userPostcode);
    if (!userCoords) return res.status(400).json({ error: "Invalid postcode" });

    //fetch all restaurants from DB
    const sql = `
            SELECT
                restaurantID, longitude, latitude, postcode 
            FROM restaurants
        `;
    pool.query(sql, (err, results) => {
      if (err) {
        console.error("Database error: ", err);
        return res.status(500).json({ error: "Database error" });
      }

      //filter results by distance
      const maxDistance = 5; //keep to 5 km radius
      const nearbyRestaurants = results
        .map((r) => {
          const distance = getDistance(
            userCoords.longitude,
            userCoords.latitude,
            r.longitude,
            r.latitude
          );
          return { ...r, distance };
        })
        .filter((r) => r.distance <= maxDistance) //keep nearby
        .sort((a, b) => a.distance - b.distance); //sort by closest

      //return results
      res.status(200).json(nearbyRestaurants);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
