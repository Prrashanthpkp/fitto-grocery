import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import "./UserAccount.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faBoxOpen, faWallet,
  faRightFromBracket, faChevronRight, faArrowLeft,
  faEnvelope, faIdCard, faPhone, faLocationDot
} from "@fortawesome/free-solid-svg-icons";

// ── ORDER CARD WITH CANCEL ──
function OrderCard({ order, onRefresh }) {
  const [status, setStatus]         = useState(order.status || "PLACED");
  const [cancelling, setCancelling] = useState(false);
  const [countdown, setCountdown]   = useState(null);

  useEffect(() => {
    if (status === "PLACED") {
      let secs = 10;
      setCountdown(secs);

      const countTimer = setInterval(() => {
        secs--;
        setCountdown(secs);
        if (secs <= 0) clearInterval(countTimer);
      }, 1000);

      const deliverTimer = setTimeout(async () => {
        try {
          await API.put(`/orders/deliver/${order.id}`);
          setStatus("DELIVERED");
          setCountdown(null);
          onRefresh();
        } catch (err) {
          console.log(err);
        }
      }, 10000);

      return () => {
        clearInterval(countTimer);
        clearTimeout(deliverTimer);
      };
    }
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await API.put(`/orders/cancel/${order.id}`);
      setStatus("CANCELLED");
      setCountdown(null);
      onRefresh();
    } catch (err) {
      console.log(err);
    }
    setCancelling(false);
  };

  const statusMap = {
    PLACED:    { bg: "#fff8e1", color: "#f57f17", label: "⏳ Processing"  },
    DELIVERED: { bg: "#e8f5e9", color: "#2e7d32", label: "✅ Delivered"   },
    CANCELLED: { bg: "#ffebee", color: "#e53935", label: "❌ Cancelled"   },
  };

  const s = statusMap[status] || statusMap["PLACED"];

  return (
    <div className="order-card">
      <div className="order-top">
        <span className="order-id">Order #{order.id}</span>
        <span className="order-status-badge" style={{ background: s.bg, color: s.color }}>
          {s.label}
        </span>
      </div>

      <p className="order-method">💳 {order.paymentMethod}</p>
      <p className="order-date">
        🗓 {new Date(order.orderDate).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        })}
      </p>

      <div className="order-items">
        {order.items?.map((item, i) => (
          <span key={i} className="order-item-tag">
            {item.productName} x{item.quantity}
          </span>
        ))}
      </div>

      <div className="order-footer">
        <p className="order-amount">₹{order.totalAmount}</p>

        {status === "PLACED" && (
          <div className="order-actions">
            <span className="order-countdown">🚚 Delivering in {countdown}s</span>
            <button
              className="cancel-order-btn"
              onClick={handleCancel}
              disabled={cancelling}>
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BUDGET TRACKER ──
function BudgetTracker({ onBack, setPage }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    gender: "", age: "", weight: "", goal: "", budget: ""
  });
  const [result, setResult] = useState(null);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const calculate = () => {
    const age    = parseInt(form.age);
    const weight = parseFloat(form.weight);
    const budget = parseFloat(form.budget);

    let bmr = form.gender === "male"
      ? 10 * weight + 6.25 * 170 - 5 * age + 5
      : 10 * weight + 6.25 * 160 - 5 * age - 161;

    let calories = Math.round(bmr * 1.4);
    if (form.goal === "gain") calories += 300;
    if (form.goal === "loss") calories -= 400;

    let protein, carbs, fat;
    if (form.goal === "gain") {
      protein = Math.round(weight * 2.2);
      fat     = Math.round((calories * 0.25) / 9);
      carbs   = Math.round((calories - protein * 4 - fat * 9) / 4);
    } else if (form.goal === "loss") {
      protein = Math.round(weight * 2.0);
      fat     = Math.round((calories * 0.30) / 9);
      carbs   = Math.round((calories - protein * 4 - fat * 9) / 4);
    } else {
      protein = Math.round(weight * 1.6);
      fat     = Math.round((calories * 0.28) / 9);
      carbs   = Math.round((calories - protein * 4 - fat * 9) / 4);
    }

    const weekly         = (budget / 4).toFixed(0);
    const protein_budget = Math.round(budget * 0.40);
    const carbs_budget   = Math.round(budget * 0.30);
    const fat_budget     = Math.round(budget * 0.15);
    const suppl_budget   = Math.round(budget * 0.15);

    setResult({ calories, protein, carbs, fat, weekly, budget,
      protein_budget, carbs_budget, fat_budget, suppl_budget });
  };

  if (step === 1 && !result) return (
    <div className="details-box" style={{ animation: "fadeUp 0.4s ease both" }}>
      <button className="back-btn-account" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <h3 className="details-title">💪 Budget & Calorie Tracker</h3>
      <p className="bt-subtitle">Step 1 of 3 — Tell us about yourself</p>
      <div className="bt-step">
        <label className="bt-label">Gender</label>
        <div className="bt-gender-row">
          <div className={`bt-gender-btn ${form.gender === "male" ? "active" : ""}`}
            onClick={() => update("gender", "male")}>👨 Male</div>
          <div className={`bt-gender-btn ${form.gender === "female" ? "active" : ""}`}
            onClick={() => update("gender", "female")}>👩 Female</div>
        </div>
        <label className="bt-label">Age</label>
        <input className="bt-input" type="number" placeholder="e.g. 25"
          value={form.age} onChange={e => update("age", e.target.value)} />
        <label className="bt-label">Body Weight (kg)</label>
        <input className="bt-input" type="number" placeholder="e.g. 70"
          value={form.weight} onChange={e => update("weight", e.target.value)} />
      </div>
      <button className="bt-next-btn"
        disabled={!form.gender || !form.age || !form.weight}
        onClick={() => setStep(2)}>
        Next →
      </button>
    </div>
  );

  if (step === 2 && !result) return (
    <div className="details-box" style={{ animation: "fadeUp 0.4s ease both" }}>
      <button className="back-btn-account" onClick={() => setStep(1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <h3 className="details-title">🎯 Your Fitness Goal</h3>
      <p className="bt-subtitle">Step 2 of 3 — What's your goal?</p>
      <div className="bt-goal-cards">
        <div className={`bt-goal-card ${form.goal === "gain" ? "active" : ""}`}
          onClick={() => update("goal", "gain")}>
          <span className="bt-goal-icon">💪</span>
          <p className="bt-goal-title">Muscle Gain</p>
          <p className="bt-goal-desc">Build strength & size</p>
        </div>
        <div className={`bt-goal-card ${form.goal === "loss" ? "active" : ""}`}
          onClick={() => update("goal", "loss")}>
          <span className="bt-goal-icon">🔥</span>
          <p className="bt-goal-title">Fat Loss</p>
          <p className="bt-goal-desc">Burn fat, stay lean</p>
        </div>
        <div className={`bt-goal-card ${form.goal === "maintain" ? "active" : ""}`}
          onClick={() => update("goal", "maintain")}>
          <span className="bt-goal-icon">⚖️</span>
          <p className="bt-goal-title">Maintain</p>
          <p className="bt-goal-desc">Stay at current weight</p>
        </div>
      </div>
      <button className="bt-next-btn"
        disabled={!form.goal}
        onClick={() => setStep(3)}>
        Next →
      </button>
    </div>
  );

  if (step === 3 && !result) return (
    <div className="details-box" style={{ animation: "fadeUp 0.4s ease both" }}>
      <button className="back-btn-account" onClick={() => setStep(2)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <h3 className="details-title">💰 Monthly Budget</h3>
      <p className="bt-subtitle">Step 3 of 3 — Set your grocery budget</p>
      <div className="bt-step">
        <label className="bt-label">Monthly Grocery Budget (₹)</label>
        <input className="bt-input" type="number" placeholder="e.g. 5000"
          value={form.budget} onChange={e => update("budget", e.target.value)} />
        <div className="bt-budget-hints">
          {[2000, 3500, 5000, 8000].map(amt => (
            <span key={amt} className="bt-hint-chip"
              onClick={() => update("budget", String(amt))}>
              ₹{amt}
            </span>
          ))}
        </div>
      </div>
      <button className="bt-next-btn"
        disabled={!form.budget}
        onClick={calculate}>
        Show My Plan 🚀
      </button>
    </div>
  );

  if (result) {
    const macroTotal = result.protein * 4 + result.carbs * 4 + result.fat * 9;
    const proteinPct = Math.round((result.protein * 4 / macroTotal) * 100);
    const carbsPct   = Math.round((result.carbs   * 4 / macroTotal) * 100);
    const fatPct     = Math.round((result.fat     * 9 / macroTotal) * 100);

    return (
      <div className="details-box" style={{ animation: "fadeUp 0.4s ease both" }}>
        <button className="back-btn-account" onClick={() => {
          setResult(null);
          setStep(1);
          setForm({ gender: "", age: "", weight: "", goal: "", budget: "" });
        }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Redo
        </button>
        <h3 className="details-title">📊 Your Personal Plan</h3>
        <div className="bt-calorie-card">
          <div className="bt-calorie-main">
            <p className="bt-calorie-num">{result.calories}</p>
            <p className="bt-calorie-label">kcal / day</p>
          </div>
          <div className="bt-calorie-tag">
            {form.goal === "gain" ? "💪 Muscle Gain"
              : form.goal === "loss" ? "🔥 Fat Loss" : "⚖️ Maintain"}
          </div>
        </div>
        <p className="bt-section-title">Daily Macros</p>
        <div className="bt-macros">
          <div className="bt-macro-row">
            <span className="bt-macro-name">🥩 Protein</span>
            <div className="bt-bar-bg">
              <div className="bt-bar protein-bar"
                style={{ width: `${proteinPct}%`, animation: "growBar 1s ease 0.2s both" }} />
            </div>
            <span className="bt-macro-val">{result.protein}g</span>
          </div>
          <div className="bt-macro-row">
            <span className="bt-macro-name">🌾 Carbs</span>
            <div className="bt-bar-bg">
              <div className="bt-bar carbs-bar"
                style={{ width: `${carbsPct}%`, animation: "growBar 1s ease 0.4s both" }} />
            </div>
            <span className="bt-macro-val">{result.carbs}g</span>
          </div>
          <div className="bt-macro-row">
            <span className="bt-macro-name">🥑 Fat</span>
            <div className="bt-bar-bg">
              <div className="bt-bar fat-bar"
                style={{ width: `${fatPct}%`, animation: "growBar 1s ease 0.6s both" }} />
            </div>
            <span className="bt-macro-val">{result.fat}g</span>
          </div>
        </div>
        <p className="bt-section-title">Monthly Budget — ₹{result.budget}</p>
        <div className="bt-budget-grid">
          <div className="bt-budget-card protein-bg">
            <p className="bt-budget-cat">🥩 Proteins</p>
            <p className="bt-budget-amt">₹{result.protein_budget}</p>
            <p className="bt-budget-pct">40%</p>
          </div>
          <div className="bt-budget-card carbs-bg">
            <p className="bt-budget-cat">🌾 Carbs</p>
            <p className="bt-budget-amt">₹{result.carbs_budget}</p>
            <p className="bt-budget-pct">30%</p>
          </div>
          <div className="bt-budget-card fat-bg">
            <p className="bt-budget-cat">🥑 Fats</p>
            <p className="bt-budget-amt">₹{result.fat_budget}</p>
            <p className="bt-budget-pct">15%</p>
          </div>
          <div className="bt-budget-card suppl-bg">
            <p className="bt-budget-cat">💊 Supplements</p>
            <p className="bt-budget-amt">₹{result.suppl_budget}</p>
            <p className="bt-budget-pct">15%</p>
          </div>
        </div>
        <div className="bt-weekly-tip">
          📅 Weekly grocery budget: <strong>₹{result.weekly}</strong>
        </div>
        <button className="shop-now-btn"
          style={{ marginTop: "16px", width: "100%" }}
          onClick={() => setPage("products")}>
          Start Shopping 🛒
        </button>
      </div>
    );
  }
}

// ── MAIN COMPONENT ──
function UserAccount({ setPage }) {
  const [view, setView]               = useState("main");
  const [user, setUser]               = useState(null);
  const [orders, setOrders]           = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (view === "orders" && user) fetchOrders();
  }, [view, user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await API.get(`/orders/${user?.id}`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoadingOrders(false);
  };

  return (
    <div className="account-page">
      <Navbar setPage={setPage} />

      <div className="account-container">

        {/* MAIN MENU */}
        {view === "main" && (
          <div className="account-main" style={{ animation: "fadeUp 0.4s ease both" }}>
            <div className="profile-card">
              <div className="profile-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="profile-text">
                <h2>{user?.name || "User"}</h2>
                <p>{user?.email || ""}</p>
              </div>
            </div>

            <div className="account-options">
              <div className="option-card" onClick={() => setView("account")}>
                <div className="option-left">
                  <div className="option-icon green"><FontAwesomeIcon icon={faIdCard} /></div>
                  <span>Your Account</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="option-arrow" />
              </div>

              <div className="option-card" onClick={() => setView("orders")}>
                <div className="option-left">
                  <div className="option-icon yellow"><FontAwesomeIcon icon={faBoxOpen} /></div>
                  <span>Your Orders</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="option-arrow" />
              </div>

              <div className="option-card" onClick={() => setView("budget")}>
                <div className="option-left">
                  <div className="option-icon blue"><FontAwesomeIcon icon={faWallet} /></div>
                  <span>Budget Tracker</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="option-arrow" />
              </div>

              <div className="option-card logout-card" onClick={() => {
                localStorage.removeItem("user");
                setPage("login");
              }}>
                <div className="option-left">
                  <div className="option-icon red"><FontAwesomeIcon icon={faRightFromBracket} /></div>
                  <span>Logout</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="option-arrow" />
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT INFO */}
        {view === "account" && (
          <div className="details-box" style={{ animation: "fadeUp 0.4s ease both" }}>
            <button className="back-btn-account" onClick={() => setView("main")}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <h3 className="details-title">Account Info</h3>
            <div className="info-row">
              <div className="info-icon"><FontAwesomeIcon icon={faUser} /></div>
              <div>
                <p className="info-label">Full Name</p>
                <p className="info-value">{user?.name}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><FontAwesomeIcon icon={faEnvelope} /></div>
              <div>
                <p className="info-label">Email Address</p>
                <p className="info-value">{user?.email}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><FontAwesomeIcon icon={faPhone} /></div>
              <div>
                <p className="info-label">Phone Number</p>
                <p className="info-value">{user?.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><FontAwesomeIcon icon={faLocationDot} /></div>
              <div>
                <p className="info-label">Delivery Address</p>
                <p className="info-value">{user?.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {view === "orders" && (
          <div className="details-box" style={{ animation: "fadeUp 0.4s ease both" }}>
            <button className="back-btn-account" onClick={() => setView("main")}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <h3 className="details-title">Your Orders</h3>

            {loadingOrders ? (
              <div className="orders-loading">
                <div className="loading-spinner" />
                <p>Fetching your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p className="no-orders-emoji">🛒</p>
                <p className="no-orders-title">No orders yet!</p>
                <p className="no-orders-sub">
                  Your cart is lonely — let's fill it with fresh & healthy goodness!
                </p>
                <button className="shop-now-btn" onClick={() => setPage("products")}>
                  Shop Now 🥦
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onRefresh={fetchOrders}
                />
              ))
            )}
          </div>
        )}

        {/* BUDGET */}
        {view === "budget" && (
          <BudgetTracker onBack={() => setView("main")} setPage={setPage} />
        )}

      </div>

      <Footer />
    </div>
  );
}

export default UserAccount;