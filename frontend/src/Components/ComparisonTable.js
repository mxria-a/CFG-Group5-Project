import React from 'react';
import './ComparisonTable.css'; 
import  { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ComparisonTable = ({ items, onSelectWinner }) => {

    const [showNotification, setShowNotification] = useState(false); // Notification state for adding to basket

  if (!items || items.length === 0) return <div>No items selected</div>;

  // handler to close the popup
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  // handler for the "Add to Cart" button click
  const handleAddToCartClick = (item) => {
    //  call the parent prop just in case it's needed later
    if (onSelectWinner) {
      onSelectWinner(item);
    }
    // to show the "Added to Cart" popup
    setShowNotification(true);
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

        {/*Price*/}
        <div className="table-row">
          <div className="col-label">Price</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item price-tag">
              £{item.price}
            </div>
          ))}
        </div>

        {/*Delivery*/}
        <div className="table-row">
          <div className="col-label">Delivery</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              {item.deliveryTime} mins
            </div>
          ))}
        </div>

        {/*Restaurant*/}
        <div className="table-row">
          <div className="col-label">Restaurant</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              {item.restaurantName}
            </div>
          ))}
        </div>

        {/*Rating*/}
        <div className="table-row">
          <div className="col-label">Rating</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
               {/* Display rating if it's available or  'N/A' if missing */}
               <span style={{fontWeight: 'bold', color: '#f39c12'}}>
                 {item.avRating ? `★ ${item.avRating}` : "N/A"}
               </span>
            </div>
          ))}
        </div>

        {/*Calories*/}
        <div className="table-row">
          <div className="col-label">Calories</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              {item.calories} kcal
            </div>
          ))}
        </div>

        {/*Allergens*/}
        <div className="table-row">
          <div className="col-label">Allergens</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item" style={{color: '#d9534f', fontSize: '0.85rem'}}>
              {/* checks if allergens exist otherwise show 'None' */}
              {item.allergens ? item.allergens : "None"}
            </div>
          ))}
        </div>

        {/*Vegan Status*/}
        <div className="table-row">
          <div className="col-label">Vegan?</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              <span className={`badge ${item.isVegan ? 'yes' : 'no'}`}>
                {item.isVegan ? "Yes" : "No"}
              </span>
            </div>
          ))}
        </div>

         {/* Ingredients */}
         <div className="table-row">
          <div className="col-label">Ingredients</div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item" style={{fontSize: '0.8rem', fontStyle: 'italic'}}>
              {item.ingredients ? item.ingredients.substring(0, 50) + "..." : "View details"}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        
        <div className="table-row">
          <div className="col-label"></div>
          {items.map((item) => (
            <div key={item.itemID} className="col-item">
              <button 
                className="add-to-cart-btn" 
                onClick={() => handleAddToCartClick(item)} /* click handler */
              >
                Add to Cart &#128722;
        
              </button>
            </div>
          ))}
        </div>

      </div>
      {/* MUI Snackbar popup */}
      <Snackbar 
        open={showNotification} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          Item added to cart!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ComparisonTable;