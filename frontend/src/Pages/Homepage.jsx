import { useState, useEffect } from "react";
import GetItem from "../Components/FoodItemInput";
import PostCodeInput from "../Components/PostCodeInput";
import SubmitButton from "../Components/SubmitButton";
import FoodComparisonPage from "./FoodComparisonPage";
import "./Homepage.css";
import { Snackbar, Alert } from "@mui/material";

// Random foods list (outside component to be safe)
const foodOptions = [
  "Burger", "Pizza", "Sushi", "Chicken", "Noodles", "Curry", "Waffle", "Burrito"
];

function Home() {
  const [item, setItem] = useState(null);
  const [postcode, setPostcode] = useState(null);
  
  const [hasSearched, setHasSearched] = useState(false);
  const [showError, setShowError] = useState(false);
  const [randomFoods, setRandomFoods] = useState([]);

  useEffect(() => {
    const shuffled = [...foodOptions].sort(() => 0.5 - Math.random());
    setRandomFoods(shuffled.slice(0, 3));
  }, []);

  const handleSuggestionClick = (food) => {
    setItem(food);
  };

  // search function
  function Search() {
    // Both are required
    if (item && postcode) {
      setHasSearched(true);
    } else {
      setShowError(true);
    }
  }

  function handleReset() {
    setHasSearched(false);
    setItem(null);
    setPostcode(null);
  }

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setShowError(false);
  };

  return (
    <div className="home-container">
      {!hasSearched ? (
        <div className="search-wrapper">
          <h1 className="home-title">Food Ordering App</h1>

          <div className="input-group">
            <GetItem item={item} setItem={setItem} />
            <PostCodeInput setPostcode={setPostcode} />
          </div>

          <div className="submit-btn-wrapper">
            <SubmitButton onClick={Search} />
          </div>

          <div className="random-box-container">
            {randomFoods.map((food, index) => (
              <div
                key={index}
                className="random-box"
                onClick={() => handleSuggestionClick(food)}
              >
                {food}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="results-wrapper">
          <FoodComparisonPage
            searchQuery={item}
            postcode={postcode}
            onBackToSearch={handleReset}
          />
        </div>
      )}

      {/* ERROR POPUP */}
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled" 
          sx={{ width: "100%" }}
        >
          {/* UPDATED MESSAGE */}
          Please enter BOTH a food item and a postcode to search!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;