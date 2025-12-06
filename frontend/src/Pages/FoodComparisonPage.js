import { useState, useEffect } from 'react';
import ItemList from '../Components/ItemList';
import ComparisonTable from '../Components/ComparisonTable';
import './FoodComparisonPage.css';
import { Snackbar, Alert } from '@mui/material';

const FoodComparisonPage = ({ searchQuery, postcode, onBackToSearch }) => {
  const [allItems, setAllItems] = useState([]); 
  const [selectedItems, setSelectedItems] = useState([]); 
  const [view, setView] = useState('selection'); 
  const [loading, setLoading] = useState(true); 

  const [notification, setNotification] = useState({
    open: false, message: '', severity: 'success'
  });

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/comparison-table-items')
      .then(res => res.json())
      .then(data => {
        if (searchQuery) {
           const lowerCaseQuery = searchQuery.toLowerCase();
           const filteredData = data.filter(item => 
             item.itemName.toLowerCase().includes(lowerCaseQuery) ||
             item.restaurantName.toLowerCase().includes(lowerCaseQuery)
           );
           setAllItems(filteredData);
        } else {
           setAllItems(data);
        }
        setLoading(false);
      })
      .catch(err => { console.error("Error:", err); setLoading(false); });
  }, [searchQuery]);

  const handleToggle = (item) => {
    const isAlreadySelected = selectedItems.some(i => i.itemID === item.itemID);
    if (isAlreadySelected) {
      setSelectedItems(prev => prev.filter(i => i.itemID !== item.itemID));
    } else {
      if (selectedItems.length >= 3) {
        setNotification({ open: true, message: "You can only compare up to 3 items.", severity: 'error' });
        return;
      }
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const handleCompareClick = () => {
    if (selectedItems.length < 2) {
      setNotification({ open: true, message: "Please select at least 2 items.", severity: 'warning' });
      return; 
    }
    setView('comparison');
  };

  // Helper to check selection status
  const areAllItemsSelected = () => {
    if (allItems.length === 0) return false;
    return selectedItems.length === allItems.length;
  };

  const handleSelectAll = () => {
    if (areAllItemsSelected()) {
      setSelectedItems([]);
    } else {
      // If user clicks Select All, take only first 3 items (due to limit)
      // Or select everything if you removed the limit.
      // For now, selecting top 3 is safer UX choice
      setSelectedItems(allItems.slice(0, 3)); 
      if (allItems.length > 3) {
          setNotification({ open: true, message: "Selected top 3 items (Limit reached)", severity: 'info' });
      }
    }
  };

  const handleOrder = (item) => { console.log("Ordering item:", item); };
  
  const handleAddToBasket = () => {
    setNotification({ open: true, message: "Items added to cart!", severity: 'success' });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) return <div className="loading-state">Loading options...</div>;

  return (
    <div className="page-container">
      
      {view === 'selection' ? (
        <div className="selection-wrapper">
          
          <button 
             onClick={onBackToSearch} 
             className="back-btn"
             style={{ marginBottom: '15px' }}
           >
             &larr; Search Again
           </button>

          {/* header layout (Title Left, Link Right) */}
          <div className="header-row-flex">
            {/* Title */}
            <h2>{searchQuery ? `Results for "${searchQuery}"` : "All Items"}</h2>
            
            {/* Select All Button (Top Right) */}
            <button className="select-all-link" onClick={handleSelectAll}>
              {areAllItemsSelected() && allItems.length > 0 ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* list contents */}
          <ItemList 
            items={allItems} 
            selectedItems={selectedItems} 
            onToggle={handleToggle} 
          />

          {/* floating bottom bar (Only visible when items selected) */}
          {selectedItems.length > 0 && (
            <div className="action-bar-floating">
               <span className="selection-count">{selectedItems.length} selected</span>
               
               <div className="action-buttons">
                  <button className="primary-btn" onClick={handleCompareClick}>
                      Compare Options &rarr;
                  </button>
                  <button className="basket-btn" onClick={handleAddToBasket}>
                    Add to Basket &#128722;
                  </button>
               </div>
            </div>
          )}

        </div>
      ) : (
        /* comparison view */
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

      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message} 
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FoodComparisonPage;