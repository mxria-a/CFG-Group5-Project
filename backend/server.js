const express = require("express");
const cors = require("cors");
const pool = require("./db"); // import db separately
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Test DB connection
pool.getConnection((err, connection) => {
  if (err) console.error("DB Error:", err.message);
  else {
    console.log("Connected to SQL Database");
    connection.release();
  }
});

// Import routes
app.use("/", require("./routes/comparisonTable"));
app.use("/", require("./routes/callCoordinates"));
app.use("/", require("./routes/customers"));
app.use("/", require("./routes/allergens"));
app.use("/", require("./routes/orders"));
app.use("/", require("./routes/storeDetails"));
app.use("/", require("./routes/submitOrder"));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
