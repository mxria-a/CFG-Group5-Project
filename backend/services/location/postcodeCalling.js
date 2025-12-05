//This file is the backend file that calls the API
//It hasn't been integrated with the front end yet and will just call for a set postcode

//import dependencies
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

//postcode for initial searching
async function getLocation(postcode) {
  //set ip API details
  const apiUrl = `https://api.postcodes.io/postcodes/${postcode}`;

  //fetch data for longitude and latitude
  try {
    const response = await axios.get(apiUrl);

    const longitude = response.data.result.longitude;
    const latitude = response.data.result.latitude;

    //print results to the console
    console.log(`${postcode} Longitude: ${longitude}`);
    console.log(`${postcode} Latitude: ${latitude}`);

    //return values
    return { longitude, latitude };
  } catch (err) {
    console.error("API error:", err.message);
    throw err;
  }
}

module.exports = { getLocation };
