const express = require("express");
const pool = require("../db"); // import the pool from the new module
const router = express.Router();

router.get("/comparison-table-items", (req, res) => {
  const sql = `
    SELECT 
        i.itemID, 
        i.itemName, 
        i.price, 
        i.avRating, 
        i.calories,
        i.description,      
        i.ingredients,      
        i.isVegan,          
        r.restaurantName,   
        r.deliveryTime,     
        r.postcode, 
        r.latitude,
        r.longitude,        
        GROUP_CONCAT(a.allergenName SEPARATOR ', ') AS allergens
    FROM items i
    JOIN restaurants r ON i.restaurantID = r.restaurantID
    LEFT JOIN item_allergens ia ON i.itemID = ia.itemID
    LEFT JOIN allergens a ON ia.allergenID = a.allergenID
    GROUP BY i.itemID
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
