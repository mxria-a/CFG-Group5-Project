import React, { useState, useEffect } from "react";

const Preferences = () => {
  const [allergies, setAllergies] = useState("");
  const [allergenOptions, setAllergenOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/allergens")
      .then((res) => res.json())
      .then((data) => {
        setAllergenOptions(data);
      })
      .catch((err) => console.error(err));
  }, []);

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
            <option value="">Select</option>
            {allergenOptions.map((allergen) => (
              <option key={allergen.allergenID} value={allergen.allergenName}>
                {allergen.allergenName}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
};

export default Preferences;
