import { useState } from "react";
import GetItem from "../Components/FoodItemInput";
import PostCodeInput from "../Components/PostCodeInput";
import SubmitButton from "../Components/SubmitButton";
import FoodComparisonPage from "./FoodComparisonPage";
import "./Homepage.css";
import { Snackbar, Alert } from "@mui/material";

function Home() {
  const [item, setItem] = useState(null);
  const [postcode, setPostcode] = useState(null);

  // Tracks if the search button has been clicked
  const [hasSearched, setHasSearched] = useState(false);
  const [showError, setShowError] = useState(false);

  function Search() {
    // Check if either item OR postcode has a value
    if ((item && postcode) || postcode) {
      setHasSearched(true);
    } else {
      // Only show error if both are empty
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
        // search screen
        <div className="search-wrapper">
          <h1 className="home-title">Food Ordering App</h1>

          <div className="input-group">
            <GetItem setItem={setItem} />
            <PostCodeInput setPostcode={setPostcode} />
          </div>

          <div className="submit-btn-wrapper">
            <SubmitButton onClick={Search} />
          </div>
        </div>
      ) : (
        // results screen
        <div className="results-wrapper">
          <FoodComparisonPage
            searchQuery={item}
            postcode={postcode}
            onBackToSearch={handleReset}
          />
        </div>
      )}

      {/* Error Popup */}
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
          Please enter a postcode to start!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;
