import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState({});
  const [foodList, setFoodList] = useState([]);

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

  // Decrements by one (existing behavior — used by a quantity "-" control)
  const removeFromBasket = (itemId) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  // Removes the item entirely regardless of quantity (used by the "x" / trash action)
  const removeItemFromBasket = (itemId) => {
    setBasketItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  // Get total basket amount
  const getTotalBasketAmount = () => {
    let totalAmount = 0;
    for (const itemId in basketItems) {
      if (basketItems[itemId] > 0) {
        const itemInfo = foodList.find((product) => product.itemID === Number(itemId));
        if (itemInfo) {
          totalAmount += itemInfo.price * basketItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  // pass down the state and functions via context
  const contextValue = {
    foodList,
    basketItems,
    addToBasket,
    removeFromBasket,
    removeItemFromBasket,
    getTotalBasketAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
