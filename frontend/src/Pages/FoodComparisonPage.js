import { useState, useEffect, useContext } from "react";
import ItemList from "../Components/ItemList";
import ComparisonTable from "../Components/ComparisonTable";
import "./FoodComparisonPage.css";
import { Snackbar, Alert } from "@mui/material";
import { fetchCoords } from "../utils/fetchCoords";
import { getDistance } from "../utils/distanceCalculator";
import { StoreContext } from "../Context/shop-context";

const FoodComparisonPage = ({ searchQuery, postcode, onBackToSearch }) => {
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [view, setView] = useState("selection");
  const [loading, setLoading] = useState(true);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const { addToBasket } = useContext(StoreContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await fetch("http://localhost:3001/comparison-table-items");
        const data = await res.json();

        let currentData = data;

        // 1. filter by name (Only if user actually typed an item)
        if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          currentData = currentData.filter((item) =>
            item.itemName.toLowerCase().includes(lowerCaseQuery) ||
            item.restaurantName.toLowerCase().includes(lowerCaseQuery)
          );
        }
        // (If searchQuery is null, currentData stays as ALL items)

        // 2. filter by location (Mandatory)
        // Defensive check: Homepage is supposed to block empty postcodes, but we check anyway.
        if (postcode) {
          const coords = await fetchCoords(postcode);

          if (!coords || !coords.latitude) {
            setErrorMessage(`"${postcode}" is not a valid postcode.`);
            setAllItems([]);
            setLoading(false);
            return; 
          }

          const withDistance = currentData.map((item) => {
            if (!item.latitude || !item.longitude) return { ...item, distance: 999 };
            return {
              ...item,
              distance: getDistance(coords.longitude, coords.latitude, item.longitude, item.latitude),
            };
          });

          // Distance Limit (50km for testing, change to 5km in production)
          const maxDistance = 5; 
          const nearbyItems = withDistance.filter((item) => item.distance <= maxDistance);

          if (nearbyItems.length === 0) {
            const context = searchQuery ? `"${searchQuery}" items` : "items";
            setErrorMessage(`No ${context} found within ${maxDistance}km of ${postcode}`);
          }

          setAllItems(nearbyItems);
        }

      } catch (err) {
        console.error("Error:", err);
        setErrorMessage("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [searchQuery, postcode]);

  // Handlers
  const handleToggle = (item) => { 
      const isSelected = selectedItems.some(i => i.itemID === item.itemID);
      if (isSelected) setSelectedItems(prev => prev.filter(i => i.itemID !== item.itemID));
      else {
          if (selectedItems.length >= 3) { setNotification({ open: true, message: "Max 3 items", severity: "error" }); return; }
          setSelectedItems(prev => [...prev, item]);
      }
  };
  const handleCompareClick = () => {
      if (selectedItems.length < 2) { setNotification({ open: true, message: "Select 2 items", severity: "warning" }); return; }
      setView("comparison");
  };
  const areAllItemsSelected = () => { return allItems.length > 0 && selectedItems.length === allItems.length; };
  const handleSelectAll = () => {
      if (areAllItemsSelected()) setSelectedItems([]);
      else setSelectedItems(allItems.slice(0, 3));
  };
  const handleOrder = (item) => console.log(item);
  const handleAddToBasket = () => {
    if (selectedItems.length === 0) return;

    // Loop through selected items and add them to the global basket state
    selectedItems.forEach((item) => {
      addToBasket(item.itemID); // Use the correct ID field from your DB
    });

    // Show success message
    setNotification({ 
      open: true, 
      message: `Added ${selectedItems.length} items to basket!`, 
      severity: "success" 
    });
    
    // Clear selection after adding
    setSelectedItems([]); 
  };
 const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) return <div className="loading-state">Finding food near {postcode}...</div>;

  return (
    <div className="page-container">
      {view === "selection" ? (
        <div className="selection-wrapper">
          <button onClick={onBackToSearch} className="back-btn" style={{ marginBottom: "15px" }}>&larr; Search Again</button>

          <div className="header-row-flex">
            {/* dynamic title */}
            <h2>
              {searchQuery 
                ? `Results for "${searchQuery}" near ${postcode}` 
                : `All Food near ${postcode}`
              }
            </h2>
            <button className="select-all-link" onClick={handleSelectAll}>
              {areAllItemsSelected() ? "Deselect All" : "Select All"}
            </button>
          </div>

          {errorMessage && <Alert severity="warning" style={{ marginBottom: "20px" }}>{errorMessage}</Alert>}

          <ItemList items={allItems} selectedItems={selectedItems} onToggle={handleToggle} />

          {selectedItems.length > 0 && (
            <div className="action-bar-floating">
              <span className="selection-count">{selectedItems.length} selected</span>
              <div className="action-buttons">
                <button className="primary-btn" onClick={handleCompareClick}>Compare Options &rarr;</button>
                <button className="basket-btn" onClick={handleAddToBasket}>Add to Basket &#128722;</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="comparison-wrapper">
          <button className="back-btn" onClick={() => setView("selection")}>&larr; Back to Selection</button>
          <ComparisonTable items={selectedItems} onSelectWinner={handleOrder} />
        </div>
      )}

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotification}>
        <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default FoodComparisonPage;