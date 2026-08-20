import React, { useState, useEffect } from "react";
import EditToggleButton from "./EditToggleButton";

const Preferences = () => {
  const [allergies, setAllergies] = useState("");
  const [allergenOptions, setAllergenOptions] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("https://cfg-group5-backend.onrender.com/allergens")
      .then((res) => res.json())
      .then((data) => {
        setAllergenOptions(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleEdit = () => setEditing((prev) => !prev);

  return (
    <>
      <div className="card-header-row">
        <div className="section-heading">
          <h2>Preferences</h2>
        </div>
        <EditToggleButton editing={editing} onClick={toggleEdit} />
      </div>
      <div className={`preferences${editing ? " editing" : ""}`}>
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
