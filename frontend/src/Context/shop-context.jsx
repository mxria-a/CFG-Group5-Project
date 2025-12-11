import { createContext, useState } from "react"

export const StoreContext = createContext();

export const StoreProvider = ({children})=>{
    const [basketItems, setBasketItems] = useState({});
};

const addToBasket = (itemId) => {
    if (!basketItems[itemId]) {
        setBasketItems((prev)=>({...prev,[itemId]:1}))
    }
    else {
        setBasketItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }
}

const removeFromBasket = (itemId) => {
    setBasketItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
}

const getTotalBasketAmount = () => {
    let totalAmount = 0;
    for (const item in basketItems)

    {
        if (basketItems[item]>0){
        let itemInfo = food_list.find((product)=> product._id === item);
         totalAmount += itemInfo.price* basketItems[item];

        }
        }
      return totalAmount;
};

console.log(basketItems);
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


const contextValue = {
    food_list,
    basketItems,
    setBasketItems,
    addToBasket,
    removeFromBasket,
    getTotalBasketAmount
}