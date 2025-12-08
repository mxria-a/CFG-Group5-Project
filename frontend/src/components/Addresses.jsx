import React, { useState } from "react";

const Addresses = () => {
  const [homeAddress, setHomeAddress] = useState("123 London Road, SW12 3JW");
  const [workAddress, setWorkAddress] = useState("456 London Road, EN3 2SW");

  return (
    <>
      <div className="section-heading">
        <h2>Addresses</h2>
      </div>
      <div className="addresses">
        <label>
          Home:
          <input
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
          />
        </label>
        <label>
          Work:
          <input
            value={workAddress}
            onChange={(e) => setWorkAddress(e.target.value)}
          />
        </label>
      </div>
    </>
  );
};

export default Addresses;
