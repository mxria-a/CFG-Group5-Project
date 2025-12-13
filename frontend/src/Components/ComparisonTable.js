import React, { useState, useContext } from "react";
import "./ComparisonTable.css";

import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, 
  Snackbar, Alert 
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import { StoreContext } from "../Context/shop-context"; 

const ComparisonTable = ({ items, onSelectWinner }) => {
  // State for the " Dialog Popup" and "Notification"
  const [showNotification, setShowNotification] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedIngredients, setExpandedIngredients] = useState({});

  const { addToBasket } = useContext(StoreContext);
  const navigate = useNavigate();

  if (!items || items.length === 0) return <div>No items selected</div>;

  // Handler to close Snackbar
  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setShowNotification(false);
  };

  // Snackbar first, then Dialog 
  const handleAddToCartClick = (item) => {
    // Add to Global Basket
    addToBasket(item.itemID);

    // Call parent prop if exists
    if (onSelectWinner) {
      onSelectWinner(item);
    }

    // Show Snackbar Immediately
    setShowNotification(true);

    // Wait 1.5 seconds, Close Snackbar, Open Dialog
    setTimeout(() => {
      setShowNotification(false);
      setOpenDialog(true);
    }, 1500); 
  };

  const toggleIngredient = (id) => {
    setExpandedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="compare-container">
      <h2 className="table-title">Compare Options</h2>

      <div className="comparison-scroll-wrapper">
        {/* Header Row*/}
        <div className="table-row header-row">
          <div className="col-label">Feature</div>
          {items.map((item, index) => (
            <div key={item.itemID} className="col-item">
              <span className="option-tag">Option {index + 1}</span>
              <span className="item-name">{item.itemName}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="table-row">
          <div className="col-label">Price</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item price-tag">
              £{item.price}
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div className="table-row">
          <div className="col-label">Delivery</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              {item.deliveryTime} mins
            </div>
          ))}
        </div>

        {/* Restaurant */}
        <div className="table-row">
          <div className="col-label">Restaurant</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              {item.restaurantName}
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="table-row">
          <div className="col-label">Rating</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              <span style={{ fontWeight: "bold", color: "#f39c12" }}>
                {item.avRating ? `★ ${item.avRating}` : "N/A"}
              </span>
            </div>
          ))}
        </div>

        {/* Calories */}
        <div className="table-row">
          <div className="col-label">Calories</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              {item.calories ? `${item.calories} kcal` : "N/A"}
            </div>
          ))}
        </div>

        {/* Allergens */}
        <div className="table-row">
          <div className="col-label">Allergens</div>
          {items.map((item) => (
            <div
              key={item.itemID}
              className="col-item"
              style={{ color: "#d9534f", fontSize: "0.85rem" }}
            >
              {item.allergens ? item.allergens : "None"}
            </div>
          ))}
        </div>

        {/* Vegan Status */}
        <div className="table-row">
          <div className="col-label">Vegan?</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              <span className={`badge ${item.isVegan ? "yes" : "no"}`}>
                {item.isVegan ? "Yes" : "No"}
              </span>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div className="table-row">
          <div className="col-label">Ingredients</div>
          {items.map((item) => {
            const fullText = item.ingredients || "View details";
            const isExpanded = expandedIngredients[item.itemID];
            const textLimit = 50;
            const shouldTruncate = fullText.length > textLimit;

            return (
              <div key={item.itemID} className="col-item ingredients-cell">
                <span style={{ fontStyle: "italic" }}>
                  {isExpanded || !shouldTruncate
                    ? fullText
                    : `${fullText.substring(0, textLimit)}...`}
                </span>
                {shouldTruncate && (
                  <button
                    className="view-more-link"
                    onClick={() => toggleIngredient(item.itemID)}
                  >
                    {isExpanded ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="table-row">
          <div className="col-label"></div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCartClick(item)}
              >
                Add to Cart &#128722;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* THE DIALOG POPUP (Decision) */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <Typography>
            Item added to basket. What would you like to do next?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Keep Shopping</Button>
          <Button 
            onClick={() => navigate("/basket")} 
            variant="contained" 
            color="success"
          >
            View Basket
          </Button>
        </DialogActions>
      </Dialog>

      {/* THE SNACKBAR NOTIFICATION */}
      <Snackbar
        open={showNotification}
        autoHideDuration={1500} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Item added to cart!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ComparisonTable;