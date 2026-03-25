import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag, faUsers, faBoxOpen,
  faIndianRupeeSign, faChartBar, faList,
  faWarehouse, faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

function AdminDashboard({ setPage }) {
  const [activeTab, setActiveTab]     = useState("dashboard");
  const [summary, setSummary]         = useState({});
  const [orders, setOrders]           = useState([]);
  const [products, setProducts]       = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [weeklyOrders, setWeeklyOrders] = useState([]);
  const [stockEdit, setStockEdit]     = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [s, o, p, tp, wo] = await Promise.all([
        API.get("/admin/stats/summary"),
        API.get("/admin/orders"),
        API.get("/admin/products"),
        API.get("/admin/stats/top-products"),
        API.get("/admin/stats/weekly-orders"),
      ]);
      setSummary(s.data);
      setOrders(o.data);
      setProducts(p.data);
      setTopProducts(tp.data);
      setWeeklyOrders(wo.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStock = async (productId, stock) => {
    await API.put(`/products/${productId}/stock?stock=${stock}`);
    fetchAll();
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-logo">⚡ Admin</div>

        <nav className="admin-nav">
          {[
            { key: "dashboard", icon: faChartBar,  label: "Dashboard"  },
            { key: "orders",    icon: faList,       label: "Orders"     },
            { key: "products",  icon: faWarehouse,  label: "Stock"      },
            { key: "users",     icon: faUsers,      label: "Users"      },
          ].map(item => (
            <div key={item.key}
              className={`admin-nav-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => setActiveTab(item.key)}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="admin-nav-item logout-nav" onClick={() => {
          localStorage.removeItem("user");
          setPage("login");
        }}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Logout</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="admin-content" style={{ animation: "fadeUp 0.4s ease both" }}>
            <h2 className="admin-title">Dashboard Overview</h2>

            {/* STAT CARDS */}
            <div className="stat-cards">
              <div className="stat-card green">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="stat-icon" />
                <div>
                  <p className="stat-val">₹{summary.totalRevenue?.toFixed(0)}</p>
                  <p className="stat-label">Total Revenue</p>
                </div>
              </div>
              <div className="stat-card yellow">
                <FontAwesomeIcon icon={faShoppingBag} className="stat-icon" />
                <div>
                  <p className="stat-val">{summary.totalOrders}</p>
                  <p className="stat-label">Total Orders</p>
                </div>
              </div>
              <div className="stat-card blue">
                <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                <div>
                  <p className="stat-val">{summary.totalUsers}</p>
                  <p className="stat-label">Total Users</p>
                </div>
              </div>
              <div className="stat-card red">
                <FontAwesomeIcon icon={faBoxOpen} className="stat-icon" />
                <div>
                  <p className="stat-val">{summary.totalProducts}</p>
                  <p className="stat-label">Products</p>
                </div>
              </div>
            </div>

            {/* CHARTS */}
            <div className="charts-row">

              {/* BAR CHART */}
              <div className="chart-card">
                <h3>🏆 Most Ordered Products</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topProducts}
                    margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }}
                      angle={-35} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#2e7d32" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* LINE CHART */}
              <div className="chart-card">
                <h3>📈 Orders This Week</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weeklyOrders}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders"
                      stroke="#2e7d32" strokeWidth={3}
                      dot={{ r: 5, fill: "#2e7d32" }}
                      activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="admin-content" style={{ animation: "fadeUp 0.4s ease both" }}>
            <h2 className="admin-title">All Orders</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Items</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td><strong>{order.userName}</strong></td>
                      <td>{order.userEmail}</td>
                      <td>
                        <div className="order-tags">
                          {order.items?.map((item, i) => (
                            <span key={i} className="order-tag">
                              {item.productName} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`payment-badge ${order.paymentMethod === "UPI" ? "upi" : "cod"}`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td>{new Date(order.orderDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}</td>
                      <td><strong>₹{order.totalAmount}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STOCK TAB */}
        {activeTab === "products" && (
          <div className="admin-content" style={{ animation: "fadeUp 0.4s ease both" }}>
            <h2 className="admin-title">Stock Management</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <img src={p.imageUrl} alt={p.name}
                          style={{ width: 48, height: 48, objectFit:"cover", borderRadius: 8 }} />
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <input
                          type="number"
                          className="stock-input"
                          defaultValue={p.stock}
                          onChange={e => setStockEdit(prev => ({
                            ...prev, [p.id]: parseInt(e.target.value)
                          }))}
                        />
                      </td>
                      <td>
                        <span className={`stock-badge ${(stockEdit[p.id] ?? p.stock) > 0 ? "in" : "out"}`}>
                          {(stockEdit[p.id] ?? p.stock) > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <button className="stock-update-btn"
                          onClick={() => updateStock(p.id, stockEdit[p.id] ?? p.stock)}>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="admin-content" style={{ animation: "fadeUp 0.4s ease both" }}>
            <h2 className="admin-title">All Users</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((o, i, arr) =>
                      arr.findIndex(x => x.userEmail === o.userEmail) === i)
                    .map((o, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td><strong>{o.userName}</strong></td>
                        <td>{o.userEmail}</td>
                        <td><span className="role-badge user">USER</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;