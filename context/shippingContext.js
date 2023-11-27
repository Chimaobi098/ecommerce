import { createContext, useContext, useState } from "react";

const ShippingDataContext = createContext();

export const useShippingData = () => {
    return useContext(ShippingDataContext);
};

export const ShippingDataProvider = ({ children }) => {
   const [shippingData, setShippingData] = useState({
    email: '',
    PhoneNumber: 0,
    fullName: '',
    StreetAddress: '',
    Unit: 0,
    city: '',
    Postal: 0,
    state: '',
    country: '',  
   }) 

  return (
    <ShippingDataContext.Provider value={{ shippingData, setShippingData }}>
        {children}
    </ShippingDataContext.Provider>
  )

}