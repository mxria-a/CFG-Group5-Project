import React, { useState } from "react";

const AccountDetails = () => {
  const [name, setName] = useState("Jane");
  const [email, setEmail] = useState("janesmith@gmail.com");
  const [phone, setPhone] = useState("07932573211");

  return (
    <>
      <div className="section-heading">
      <h2>Personal Details</h2>
      </div>
      <div className="account-details">
        <label>
          Name: <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Phone:
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
      </div>
    </>
  );
};

export default AccountDetails;
