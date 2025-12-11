import React from "react";
import AccountDetails from "../../Components/AccountDetails"
import OrderHistory from "../../Components/OrderHistory"
import Preferences from "../../Components/Preferences"
import Addresses from "../../Components/Addresses"
import "../../Pages/CustomerProfile/customerProfile.css";

const CustomerProfile = () => {
  return (
    <div className="customer-profile">
      <h1>Customer Profile</h1>
      <OrderHistory />
      <AccountDetails />
      <Preferences />
      <Addresses />
    </div>
  );
};

export default CustomerProfile;