import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState({});
  const [foodList, setFoodList] = useState([]);

  // fetch food list on mount
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch("https://cfg-group5-backend.onrender.com/comparison-table-items");
        if (!response.ok) throw new Error("Failed to fetch food");
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };
    fetchFood();
  }, []);

  // ADD TO BASKET
  const addToBasket = (itemId) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  // REMOVE FROM BASKET
  const removeFromBasket = (itemId) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  // GET TOTAL BASKET AMOUNT
  const getTotalBasketAmount = () => {
    let totalAmount = 0;
    for (const itemId in basketItems) {
      if (basketItems[itemId] > 0) {
        // Find the product in the foodList
        
        const itemInfo = foodList.find((product) => product.itemID === Number(itemId));
        
        if (itemInfo) {
          totalAmount += itemInfo.price * basketItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  console.log("Basket state:", basketItems);

  // pass down the state and functions via context
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