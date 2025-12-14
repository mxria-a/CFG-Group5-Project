import { useState } from "react";
import GuestCheckoutButton from "./GuestCheckoutButton";
import GuestCheckoutForm from "./GuestCheckoutForm";

const GuestCheckout = ({ handleCustomerInfo }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="guest-checkout">
      {!showForm && <GuestCheckoutButton onClick={() => setShowForm(true)} />}
      {showForm && (
        <GuestCheckoutForm handleCustomerInfo={handleCustomerInfo} />
      )}
    </div>
  );
};

export default GuestCheckout;
