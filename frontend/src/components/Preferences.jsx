import React, { useState } from "react";

const Preferences = () => {
  const [allergies, setAllergies] = useState("Peanuts");

  return (
    <>
      <div className="section-heading">
        <h2>Preferences</h2>
      </div>
      <div className="preferences">
        <label>
          Allergies/Dietary:
          <select
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          >
            <option value="None">None</option>
            <option value="Dairy">Dairy</option>
            <option value="Gluten">Gluten</option>
            <option value="Nuts">Nuts</option>
            <option value="Shellfish">Shellfish</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Halal">Halal</option>
          </select>
        </label>
      </div>
    </>
  );
};

export default Preferences;
