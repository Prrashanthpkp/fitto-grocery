import { useState } from "react";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import UserAccount from "./pages/UserAccount";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [page, setPage] = useState(() => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return "login";
  if (user.role === "ADMIN") return "admin";
  return "products";
});

  if (page === "login" || page === "register") {
    return <Auth page={page} setPage={setPage} />;
  }
  if (page === "admin") {
    return <AdminDashboard setPage={setPage} />;
  }

  if (page === "products") {
    return <Products setPage={setPage} />;
  }

  if (page === "cart") {
    return <Cart setPage={setPage} />;
  }

  if (page === "account") {
    return <UserAccount setPage={setPage} />;
  }
}

export default App;