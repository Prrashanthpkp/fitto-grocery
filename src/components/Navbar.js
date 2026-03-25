import { useEffect, useState } from "react";
import API from "../services/api";
import "./Navbar.css";
import logo from "../assests/grocery.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Navbar({ setPage, onSearch }) {
  const [count, setCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user ? user.id : null;

  useEffect(() => {
    fetchCartCount();
    const handleUpdate = () => fetchCartCount();
    window.addEventListener("storage", handleUpdate);
    return () => window.removeEventListener("storage", handleUpdate);
  }, [userId]);

  const fetchCartCount = async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/cart/${userId}`);
      setCount(res.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navbar">

      {/* LEFT — LOGO */}
      <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={() => setPage("products")}
      />

      {/* CENTER — SEARCH */}
      <div className="search-wrapper">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        <input
          placeholder="Search fresh products..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* RIGHT — USER + CART */}
      <div className="nav-right">

        {/* USER */}
        <div className="nav-user" onClick={() => setPage("account")}>
          <FontAwesomeIcon icon={faUser} className="nav-icon" />
          <span className="nav-username">{user?.name}</span>
        </div>

        {/* CART */}
        <div className="nav-cart" onClick={() => setPage("cart")}>
          <FontAwesomeIcon icon={faCartShopping} className="nav-icon" />
          {count > 0 && (
            <span className="cart-badge">{count}</span>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;