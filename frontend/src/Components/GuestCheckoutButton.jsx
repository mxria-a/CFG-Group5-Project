const GuestCheckoutButton = ({ onClick }) => {
  return (
    <button className="pk-btn pk-btn-primary" onClick={onClick}>
      Continue as guest
    </button>
  );
};

export default GuestCheckoutButton;
