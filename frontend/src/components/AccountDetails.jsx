import React, { useState, useEffect } from "react";

const AccountDetails = () => {
  const [customer, setCustomer] = useState({});
  const customerId = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error(err));
  }, [customerId]);

  return (
    <>
      <div className="section-heading">
      <h2>Personal Details</h2>
      </div>
      <div className="account-details">
        <label>
          First Name: <input value={customer.firstName} readOnly />
        </label>
        <label>
          Last Name: <input value={customer.lastName} readOnly />
        </label>
        <label>
          Email Address: <input value={customer.emailAddress} readOnly />
        </label>
        <label>
          Phone Number: <input value={customer.phoneNumber || "N/A"} readOnly />
        </label>
      </div>
    </>
  );
};

export default AccountDetails;
