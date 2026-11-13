import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState({});
  const [demoCustomLines, setDemoCustomLines] = useState({});
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
  const addToBasket = (itemId, quantity = 1) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + Math.max(1, Number(quantity) || 1),
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

  // The demo line items stay separate from the ordinary backend-compatible basket.
  // Checkout cannot submit these until supported restaurant options and prices exist.
  const addDemoCustomLine = (item, { removed = [], extras = [], quantity = 1 }) => {
    const count = Math.max(1, Math.min(10, Number(quantity) || 1));
    const basePrice = Number(item.price);
    if (!Number.isFinite(basePrice)) return;
    const safeExtras = extras.map((option) => ({
      id: String(option.id), name: String(option.name), price: Number(option.price) || 0,
    }));
    const unitPrice = basePrice + safeExtras.reduce((sum, option) => sum + option.price, 0);
    const sortedRemovals = [...removed].map(String).sort();
    const key = JSON.stringify([item.itemID, sortedRemovals, safeExtras.map((option) => option.id).sort()]);
    setDemoCustomLines((prev) => ({
      ...prev,
      [key]: {
        key, itemID: item.itemID, itemName: item.itemName,
        restaurantName: item.restaurantName || "Restaurant", image: item.image,
        removed: sortedRemovals, extras: safeExtras, unitPrice,
        quantity: (prev[key]?.quantity || 0) + count,
      },
    }));
  };
  const changeDemoCustomQuantity = (key, change) => setDemoCustomLines((prev) => {
    if (!prev[key]) return prev;
    const quantity = prev[key].quantity + change;
    if (quantity <= 0) {
      const next = { ...prev }; delete next[key]; return next;
    }
    return { ...prev, [key]: { ...prev[key], quantity } };
  });
  const removeDemoCustomLine = (key) => setDemoCustomLines((prev) => {
    const next = { ...prev }; delete next[key]; return next;
  });

  // Used after a successful order is placed
  const clearBasket = () => {
    setBasketItems({});
    setDemoCustomLines({});
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
    return totalAmount + Object.values(demoCustomLines).reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  };

  // pass down the state and functions via context
  const contextValue = {
    foodList,
    basketItems,
    demoCustomLines,
    addToBasket,
    addDemoCustomLine,
    changeDemoCustomQuantity,
    removeDemoCustomLine,
    removeFromBasket,
    removeItemFromBasket,
    clearBasket,
    getTotalBasketAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
