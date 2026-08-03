import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import ItemList from "../Components/ItemList";
import ComparisonTable from "../Components/ComparisonTable";
import "./FoodComparisonPage.css";

import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { fetchCoords } from "../utils/fetchCoords";
import { getDistance } from "../utils/distanceCalculator";

import { StoreContext } from "../Context/shop-context"; 

const FoodComparisonPage = ({ searchQuery, postcode, onBackToSearch }) => {
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [view, setView] = useState("selection");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // State for popups
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [openDialog, setOpenDialog] = useState(false);

  const { addToBasket } = useContext(StoreContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await fetch("https://cfg-group5-backend.onrender.com/comparison-table-items");
        const data = await res.json();
        let currentData = data;

        if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          currentData = currentData.filter((item) =>
            item.itemName.toLowerCase().includes(lowerCaseQuery) ||
            item.restaurantName.toLowerCase().includes(lowerCaseQuery)
          );
        }

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

          const maxDistance = 50; 
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

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  
  const handleAddToBasket = () => {
    if (selectedItems.length === 0) return;

   
    selectedItems.forEach((item) => {
      addToBasket(item.itemID); 
    });

    // Show Snackbar
    setNotification({ 
      open: true, 
      message: `Added ${selectedItems.length} items to basket!`, 
      severity: "success" 
    });
    
    // Clear selected items
    setSelectedItems([]); 

    // Wait 1.5 seconds, Close Snackbar, Open Dialog
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
      setOpenDialog(true);
    }, 1500);
  };

  if (loading) return <div className="loading-state">Finding food near {postcode}...</div>;

  return (
    <div className="page-container">
      {view === "selection" ? (
        <div className="selection-wrapper">
          <button onClick={onBackToSearch} className="back-btn" style={{ marginBottom: "15px" }}>&larr; Search Again</button>

          <div className="header-row-flex">
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

      {/* THE DIALOG POPUP */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Items Added!</DialogTitle>
        <DialogContent>
          <Typography>
            Success! The selected items have been added to your basket.
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

      {/* THE SNACKBAR */}
      <Snackbar open={notification.open} autoHideDuration={1500} onClose={handleCloseNotification}>
        <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default FoodComparisonPage;