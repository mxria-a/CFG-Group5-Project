import { createContext, useState } from "react"

export const StoreContext = createContext();

export const StoreProvider = ({children})=>{
    const [basketItems, setBasketItems] = useState({});


const addToBasket = (itemId) => {
     setBasketItems((prev)=>({...prev,[itemId]: (prev[itemId] || 0)+1,}));
   
};

const removeFromBasket = (itemId) => {
    setBasketItems((prev)=>({...prev,[itemId]: Math.max ((prev[itemId] || 0)-1,0),}));
};

const getTotalBasketAmount = (food_list) => {
    let totalAmount = 0;
    for (const itemId in basketItems) {
        const quantity = basketItems[itemId];
        if (quantity > 0) {
            const itemInfo = food_list.find(
                (product) => product._id === itemId
            );
            if (itemInfo) {
                totalAmount += itemInfo.price * quantity; 
            }
        }
    }

    
        

        
        
      return totalAmount;
};

console.log("basket:", basketItems);

   return (

    <StoreContext.Provider 
    value={{
        basketItems,
        addToBasket,
        removeFromBasket,
        getTotalBasketAmount,
    }}>
        {children}
        </StoreContext.Provider>
);

};

