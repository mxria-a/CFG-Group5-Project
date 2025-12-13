import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState({});
  const [foodList, setFoodList] = useState([]);

  // 1. FETCH FOOD LIST FROM YOUR BACKEND
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch("http://localhost:3001/comparison-table-items");
        if (!response.ok) throw new Error("Failed to fetch food");
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };
    fetchFood();
  }, []);

  // 2. ADD TO BASKET
  const addToBasket = (itemId) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  // 3. REMOVE FROM BASKET
  const removeFromBasket = (itemId) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  // 4. CALCULATE TOTAL (Fixed to use itemID)
  const getTotalBasketAmount = () => {
    let totalAmount = 0;
    for (const itemId in basketItems) {
      if (basketItems[itemId] > 0) {
        // Find the product in the foodList
        // We use Number(itemId) because object keys are strings, but SQL IDs are numbers
        const itemInfo = foodList.find((product) => product.itemID === Number(itemId));
        
        if (itemInfo) {
          totalAmount += itemInfo.price * basketItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  console.log("Basket state:", basketItems);

  // 5. PASS EVERYTHING TO THE REST OF THE APP
  const contextValue = {
    foodList,
    basketItems,
    addToBasket,
    removeFromBasket,
    getTotalBasketAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;