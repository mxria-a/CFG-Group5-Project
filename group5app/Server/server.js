const dotenv = require('dotenv');
dotenv.config(); // configuring dotenv package


const express = require('express');
const mysql = require('mysql2'); // importing mysql2 package
const cors = require('cors');    
const app = express(); // my express app
const port = 3001;


//sql connection pool
const pool = mysql.createPool ({
    host: process.env.DB_HOST, // server host
    user: process.env.DB_USER, // database user
    password: process.env.DB_PASSWORD, // database password
    database: process.env.DB_NAME, // database name
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 0,
});

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS

// to check if my server is connected to database
pool.getConnection((err, connection) => {
    if (err) console.error('DB Error:', err.message);
    else {
        console.log('Connected to SQL Database');
        connection.release();
    }
});

// this .get api endpoint pulls all the info for the comparison table
app.get('/comparison-table-items', (req, res) => {
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
            return res.status(500).json({ error: 'Database error fetching items' });
        }
        // Success: Send 200 OK
        res.status(200).json(results);
    });
});




// main function to run the server
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});