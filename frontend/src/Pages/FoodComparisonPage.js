import { useState, useEffect } from 'react';
import ItemList from '../Components/ItemList';
import ComparisonTable from '../Components/ComparisonTable';
import './FoodComparisonPage.css';
import { Snackbar, Alert } from '@mui/material';

const FoodComparisonPage = () => {
  const [allItems, setAllItems] = useState([]); //to hold all fetched items

  const [selectedItems, setSelectedItems] = useState([]); //to hold user-selected items for comparison

  const [view, setView] = useState('selection'); // 'selection' or 'comparison'

  const [loading, setLoading] = useState(true); // loading state for data fetch

 

  
 
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // setting sucess as default
  });


  //fetch items from api on component mount
  useEffect(() => {
    
    // later we may move this to a custom hook if the app grows
    fetch('http://localhost:3001/comparison-table-items')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
      .then(data => {
        setAllItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading food items:", err);
        setLoading(false); 
      });
  }, []);

  //toggle item selection in selection view 
  //basically runs when you tick a checkbox
  const handleToggle = (item) => {
    //check if item is already selected
    const isAlreadySelected = selectedItems.some(i => i.itemID === item.itemID);

    if (isAlreadySelected) {
        //remove item from selected list
      setSelectedItems(prev => prev.filter(i => i.itemID !== item.itemID));
      
    } else {
      //only allow up to 3 items can be selected
       if (selectedItems.length >= 3) {
        setNotification({
          open: true,
          message: "You can only compare up to 3 items at a time.",
          severity: 'error' // this error makes MUI alert turn red
        });
        return;
      }
      
        //add item to selected list
      setSelectedItems(prev => [...prev, item]);
    }
  };
  // handler to handle comparison count
  const handleCompareClick = () => {
    if (selectedItems.length < 2) {
      setNotification({
        open: true,
        message: "Please select at least 2 items to compare.",
        severity: 'warning' // Orange color (or use 'error' for Red)
      });
      return; // Stop here, do not change view
    }
    
    // If we have 2 or 3 items, proceed
    setView('comparison');
  };

  const handleSelectAll = () => {
    //a shortcut button.
    //if all are selected deselect all otherwise select all
    const isAllSelected = selectedItems.length === allItems.length;
    setSelectedItems(isAllSelected ? [] : allItems);
  };

  const handleOrder = (item) => {
    // teammates part
    // for now just building a layout will change later
    
    console.log("Ordering item:", item);
  
  };

  
  

  // add to basket function placeholder
 // this function shows the popup when clicked
  const handleAddToBasket = () => {
    
    //triggers green alert notification
    setNotification({
      open: true,
      message: "Items successfully added to cart!",
      severity: 'success' 
    });
  };

  // this function closes the popup
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return; // doesn't close unless user just clicks somewhere else on screen
    }
      setNotification(prev => ({ ...prev, open: false }));
  };
    

  if (loading) return <div className="loading-state">Loading options...</div>;

  return (
    //main container
    <div className="page-container">
      {view === 'selection' ? (
        <div className="selection-wrapper">
          <header className="page-header">
            <h2>Select Items to Compare</h2>
            
        {/* action bar with select all and compare button */}
            <div className="action-bar">
              <button className="secondary-btn" onClick={handleSelectAll}>
                {selectedItems.length === allItems.length ? "Deselect All" : "Select All"}
              </button>
              
              
              {selectedItems.length > 0 && (
                <> 
                  <button className="primary-btn" onClick={handleCompareClick}>
                     Compare {selectedItems.length} Options &rarr;
                    </button>
                  {/* add to basket button */}
                  <button className="basket-btn" onClick={handleAddToBasket}>
                    Add to Basket &#128722;
                  </button>
                </> 
              )} 
              
            </div>

          </header>

          <ItemList 
            items={allItems} 
            selectedItems={selectedItems} 
            onToggle={handleToggle} 
          />
        </div>
      ) : (
        <div className="comparison-wrapper">
          <button className="back-btn" onClick={() => setView('selection')}>
            &larr; Back to Selection
          </button>
          
          <ComparisonTable 
            items={selectedItems} 
            onSelectWinner={handleOrder} 
          />
        </div>
      )}
      

      {/* popup component */}
       <Snackbar
        open={notification.open} 
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message} 
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FoodComparisonPage;