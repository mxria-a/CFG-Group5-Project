import { useState, useEffect } from 'react';
import ItemList from './ItemList';
import ComparisonTable from './ComparisonTable';
import './FoodComparisonPage.css';

const FoodComparisonPage = () => {
  const [allItems, setAllItems] = useState([]); //to hold all fetched items

  const [selectedItems, setSelectedItems] = useState([]); //to hold user-selected items for comparison

  const [view, setView] = useState('selection'); // 'selection' or 'comparison'

  const [loading, setLoading] = useState(true); // Loading state for data fetch


  //fetch items from api on component mount
  useEffect(() => {
    
    // Later we may move this to a custom hook if the app grows
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
        //(filter it out)remove item from selected list
      setSelectedItems(prev => prev.filter(i => i.itemID !== item.itemID));
      
    } else {
        //add item to selected list
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const handleSelectAll = () => {
    //a shortcut button.
    //if all are selected deselect all otherwise select all
    const isAllSelected = selectedItems.length === allItems.length;
    setSelectedItems(isAllSelected ? [] : allItems);
  };

  const handleOrder = (item) => {
    // teammates part
    // for now i am just logging the selection to confirm the UI works
    console.log("user selected:", item.itemName);
    alert(`You chose ${item.itemName}! (Order API pending)`);
  };

  if (loading) return <div className="loading-state">Loading options...</div>;

  return (
    //main container
    <div className="page-container">
      {view === 'selection' ? (
        <div className="selection-wrapper">
          <header className="page-header">
            <h2>Select items to compare</h2>
            
        {/* Action bar with select all and compare button */}
            <div className="action-bar">
              <button className="secondary-btn" onClick={handleSelectAll}>
                {selectedItems.length === allItems.length ? "Deselect All" : "Select All"}
              </button>
              
              {selectedItems.length > 0 && (
                <button className="primary-btn" onClick={() => setView('comparison')}>
                  Compare {selectedItems.length} Options &rarr;
                </button>
              )}
            </div>
          </header>
         {/* Item list for selection */}
          <ItemList 
            items={allItems} 
            selectedItems={selectedItems} 
            onToggle={handleToggle} 
          />
        </div>
      ) : (
        
        <div className="comparison-wrapper"> {/* Comparison view with back button and comparison table */}
          <button className="back-btn" onClick={() => setView('selection')}>
            &larr; Back to Selection
          </button>
          
          <ComparisonTable 
            items={selectedItems} 
            onSelectWinner={handleOrder} 
          />
        </div>
      )}
    </div>
  );
};

export default FoodComparisonPage;