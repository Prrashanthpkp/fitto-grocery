import Navbar from "../components/Navbar";
import "./ProductDetail.css";
import { useState, useEffect } from "react";
import API from "../services/api";
import Footer from "../components/Footer";

function MacroCircle({ label, value, unit, max, color }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div className="macro-circle">
      <svg width="90" height="90" viewBox="0 0 90 90">
        {/* Background ring */}
        <circle cx="45" cy="45" r={radius} fill="none"
          stroke="#e8f5e9" strokeWidth="8" />
        {/* Progress ring */}
        <circle cx="45" cy="45" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        {/* Value text */}
        <text x="45" y="41" textAnchor="middle"
          fontSize="13" fontWeight="700" fill="#1b1b1b">
          {value}
        </text>
        <text x="45" y="56" textAnchor="middle"
          fontSize="9" fill="#888">
          {unit}
        </text>
      </svg>
      <p className="macro-label">{label}</p>
    </div>
  );
}

function ProductDetail({ product, goBack, setPage }) {
  const [qty, setQty] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => { fetchQty(); }, []);

  const fetchQty = async () => {
    const res = await API.get(`/cart/${userId}`);
    let count = 0;
    res.data.forEach(item => {
      if (item.productId === product.id) count++;
    });
    setQty(count);
  };

  useEffect(() => {
    const handleUpdate = () => fetchQty();
    window.addEventListener("storage", handleUpdate);
    return () => window.removeEventListener("storage", handleUpdate);
  }, []);

  const addToCart = async () => {
    await API.post(`/cart/add/${userId}`, {
      productId: product.id, quantity: 1, price: product.price,
    });
    setQty(1);
    localStorage.setItem("cartUpdated", Date.now());
    window.dispatchEvent(new Event("storage"));
  };

  const increase = async () => {
    await API.post(`/cart/add/${userId}`, {
      productId: product.id, quantity: 1, price: product.price,
    });
    setQty(qty + 1);
    localStorage.setItem("cartUpdated", Date.now());
    window.dispatchEvent(new Event("storage"));
  };

  const decrease = async () => {
    if (qty <= 1) {
      await API.delete(`/cart/remove/product/${userId}/${product.id}`);
      setQty(0);
    } else {
      await API.delete(`/cart/remove/product/${userId}/${product.id}`);
      for (let i = 0; i < qty - 1; i++) {
        await API.post(`/cart/add/${userId}`, {
          productId: product.id, quantity: 1, price: product.price,
        });
      }
      setQty(qty - 1);
    }
    localStorage.setItem("cartUpdated", Date.now());
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div>
      <Navbar setPage={setPage} />

      <div className="detail-container">

        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>

        <div className="detail-card">

          {/* LEFT — IMAGE */}
          <div className="detail-image-box">
            <img src={product.imageUrl} alt={product.name} className="detail-image" />
          </div>

          {/* RIGHT — INFO */}
          <div className="detail-info">

            <h2 className="detail-name">{product.name}</h2>
            <h3 className="detail-price">₹{product.price}</h3>

            <div className="detail-divider" />

            {/* MACRO CIRCLES */}
            <p className="macro-title">Nutrition per 100g</p>
            <div className="macro-row">
              <MacroCircle label="Calories" value={product.calories} unit="kcal" max={700} color="#f57c00" />
              <MacroCircle label="Protein"  value={product.protein}  unit="g"    max={50}  color="#2e7d32" />
              <MacroCircle label="Carbs"    value={product.carbs}    unit="g"    max={100} color="#fdd835" />
              <MacroCircle label="Fat"      value={product.fat}      unit="g"    max={50}  color="#e53935" />
            </div>

            <div className="detail-divider" />

            {/* CART ACTIONS */}
            {qty > 0 ? (
              <div className="qty-box">
                <button onClick={decrease}>−</button>
                <span>{qty}</span>
                <button onClick={increase}>+</button>
              </div>
            ) : (
              <button className="add-btn" onClick={addToCart}>
                Add to Cart
              </button>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;