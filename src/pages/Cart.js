import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import "./Cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import PaymentStatus from "../components/PaymentStatus";

function Cart({ setPage }) {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    if (!userId) return;
    const res = await API.get(`/cart/${userId}`);
    setItems(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const increase = async (productId, price) => {
    await API.post(`/cart/add/${userId}`, { productId, quantity: 1, price });
    fetchCart();
    localStorage.setItem("cartUpdated", Date.now());
    window.dispatchEvent(new Event("storage"));
  };

  const decrease = async (productId, price, currentQty) => {
    if (currentQty <= 1) {
      await API.delete(`/cart/remove/product/${userId}/${productId}`);
    } else {
      await API.delete(`/cart/remove/product/${userId}/${productId}`);
      for (let i = 0; i < currentQty - 1; i++) {
        await API.post(`/cart/add/${userId}`, { productId, quantity: 1, price });
      }
    }
    fetchCart();
    localStorage.setItem("cartUpdated", Date.now());
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = async (productId) => {
    await API.delete(`/cart/remove/product/${userId}/${productId}`);
    fetchCart();
    localStorage.setItem("cartUpdated", Date.now());
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = async (paymentMethod) => {
    if (paymentMethod === "UPI") {
      try {
        const orderRes = await API.post(`/payment/create-order/${userId}`);
        const order = typeof orderRes.data === "string"
          ? JSON.parse(orderRes.data)
          : orderRes.data;

        const options = {
          key: "rzp_test_SJaIubTFlNBweC",
          amount: order.amount,
          currency: order.currency,
          name: "Fitto Grocery",
          description: "Fresh & Healthy Groceries",
          order_id: order.id,
          handler: async function (response) {
            try {
              await API.post(`/orders/place/${userId}?paymentMethod=UPI`);
              setShowPayment(false);
              fetchCart();
              localStorage.setItem("cartUpdated", Date.now());
              window.dispatchEvent(new Event("storage"));
              setPaymentStatus({
                type: "success",
                message: "Razorpay payment successful! 🎉 Your order is placed!"
              });
            } catch (err) {
              console.log(err);
            }
          },
          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "customer@email.com",
          },
          theme: { color: "#2e7d32" },
          modal: {
            ondismiss: function () {
              setShowPayment(false);
              setPaymentStatus({
                type: "error",
                message: "Payment cancelled. Please try again!"
              });
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setShowPayment(false);

      } catch (err) {
        console.log(err);
        setShowPayment(false);
        setPaymentStatus({
          type: "error",
          message: "Could not initiate payment. Please try again!"
        });
      }

    } else {
      // CASH ON DELIVERY
      try {
        await API.post(`/orders/place/${userId}?paymentMethod=Cash on Delivery`);
        setShowPayment(false);
        fetchCart();
        localStorage.setItem("cartUpdated", Date.now());
        window.dispatchEvent(new Event("storage"));
        setPaymentStatus({
          type: "success",
          message: "Order placed! Pay cash on delivery 🚚"
        });
      } catch (err) {
        console.log(err);
        setShowPayment(false);
        setPaymentStatus({
          type: "error",
          message: "Something went wrong. Please try again!"
        });
      }
    }
  };
  // GROUP ITEMS
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.productId]) {
      grouped[item.productId] = { productId: item.productId, price: item.price, quantity: 0 };
    }
    grouped[item.productId].quantity += 1;
  });
  const cartList = Object.values(grouped);
  const total = cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page">
      <Navbar setPage={setPage} />

      <div className="cart-wrapper">

        {/* LEFT — CART ITEMS */}
        <div className="cart-left">

          <div className="cart-header">
            <button className="cart-back-btn" onClick={() => setPage("products")}>
              <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
            </button>
            <h2>
              <FontAwesomeIcon icon={faCartShopping} /> Your Cart
              {totalItems > 0 && <span className="cart-count-badge">{totalItems} items</span>}
            </h2>
          </div>

          {cartList.length === 0 ? (
            <div className="empty-cart">
              <p className="empty-cart-emoji">🛒</p>
              <p className="empty-cart-title">Your cart is empty!</p>
              <p className="empty-cart-sub">Looks like you haven't added anything yet. Let's fix that!</p>
              <button className="start-shopping-btn" onClick={() => setPage("products")}>
                Start Shopping 🥦
              </button>
            </div>
          ) : (
            <div className="cart-items-box">
              {cartList.map((item) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="cart-item">

                    <div className="cart-img">
                      <img src={product?.imageUrl} alt={product?.name} />
                    </div>

                    <div className="cart-info">
                      <h3>{product?.name}</h3>
                      <p className="cart-unit-price">₹{item.price} per unit</p>
                    </div>

                    <div className="cart-right-section">
                      <div className="cart-actions">
                        <button onClick={() => decrease(item.productId, item.price, item.quantity)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increase(item.productId, item.price)}>+</button>
                      </div>
                      <p className="cart-item-total">₹{item.price * item.quantity}</p>
                      <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        {cartList.length > 0 && (
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              {cartList.map((item) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="summary-row">
                    <span>{product?.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button className="checkout-btn" onClick={() => setShowPayment(true)}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="payment-overlay" onClick={() => setShowPayment(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>

            <h3>Choose Payment Method</h3>
            <p className="payment-total">Total: ₹{total}</p>

            <div className="payment-options">
              <div className="payment-option" onClick={() => handleCheckout("UPI")}>
                <span className="payment-icon">📱</span>
                <div>
                  <p className="payment-name">UPI Payment</p>
                  <p className="payment-desc">Pay instantly via UPI</p>
                </div>
              </div>

              <div className="payment-option" onClick={() => handleCheckout("Cash on Delivery")}>
                <span className="payment-icon">💵</span>
                <div>
                  <p className="payment-name">Cash on Delivery</p>
                  <p className="payment-desc">Pay when you receive</p>
                </div>
              </div>
            </div>

            <button className="payment-cancel" onClick={() => setShowPayment(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT STATUS ANIMATION */}
      {paymentStatus && (
        <PaymentStatus
          type={paymentStatus.type}
          message={paymentStatus.message}
          onClose={() => {
            setPaymentStatus(null);
            if (paymentStatus.type === "success") setPage("account");
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Cart;