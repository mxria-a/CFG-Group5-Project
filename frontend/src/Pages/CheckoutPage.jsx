import { useEffect, useState } from 'react';
import CheckoutItem from './CheckoutItem';
import './CheckoutPage.css';
import { Snackbar, Alert } from '@mui/material';

const CheckoutPage = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch basket items
  useEffect(() => {
    fetch('http://localhost:3001/basket')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch basket');
        return res.json();
      })
      .then(data => {
        setBasketItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setNotification({
          open: true,
          message: 'Error loading basket',
          severity: 'error'
        });
        setLoading(false);
      });
  }, []);

  // Update quantity
  const handleQuantityChange = (itemID, newQty) => {
    setBasketItems(prev =>
      prev.map(item =>
        item.itemID === itemID ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remove item
  const handleRemove = (itemID) => {
    setBasketItems(prev => prev.filter(i => i.itemID !== itemID));
  };

  // Total cost
  const totalPrice = basketItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Submit order
  const handlePlaceOrder = () => {
    fetch('http://localhost:3001/submit-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basketItems)
    })
      .then(res => {
        if (!res.ok) throw new Error('Order failed');
        return res.json();
      })
      .then(() => {
        setNotification({
          open: true,
          message: 'Order placed successfully!',
          severity: 'success'
        });

        // Clear basket after successful order
        setBasketItems([]);
      })
      .catch(() => {
        setNotification({
          open: true,
          message: 'Failed to place order.',
          severity: 'error'
        });
      });
  };

  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) return <div className="loading-state">Loading your basket…</div>;

  return (
    <div className="checkout-container">
      <h2>Your Basket</h2>

      {basketItems.length === 0 ? (
        <p className="empty-msg">Your basket is empty.</p>
      ) : (
        <div className="basket-items">
          {basketItems.map(item => (
            <CheckoutItem
              key={item.itemID}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* TOTAL + BUTTON */}
      {basketItems.length > 0 && (
        <div className="checkout-summary">
          <div className="total-row">
            <span>Total:</span>
            <span>£{totalPrice.toFixed(2)}</span>
          </div>

          <button className="primary-btn place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CheckoutPage;
