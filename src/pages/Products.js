import { useEffect, useState } from "react";
import API from "../services/api";
import "./Products.css";
import Navbar from "../components/Navbar";
import ProductDetail from "./ProductDetail";
import Footer from "../components/Footer";
import FitnessBanner from "../components/FitnessBanner";
import SkeletonCard from "../components/SkeletonCard";
import BannerCarousel from "../components/BannerCarousel";

function Products({ setPage }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    useEffect(() => {
        fetchProducts();
        fetchCartQuantities();
    }, []);

    useEffect(() => {
        const handleUpdate = () => {
            fetchCartQuantities();
        };

        window.addEventListener("storage", handleUpdate);

        return () => window.removeEventListener("storage", handleUpdate);
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await API.get("/products");
        setProducts(res.data);

        // ← ADD THIS
        await new Promise(resolve => setTimeout(resolve, 800));

        setLoading(false);
    };

    const addToCart = async (product) => {
        await API.post(`/cart/add/${userId}`, {
            productId: product.id,
            quantity: 1,
            price: product.price,
        });

        setQuantities((prev) => ({
            ...prev,
            [product.id]: 1,
        }));

        localStorage.setItem("cartUpdated", Date.now());
        window.dispatchEvent(new Event("storage"));
    };

    const increaseQty = async (product) => {
        const newQty = (quantities[product.id] || 0) + 1;

        await API.post(`/cart/add/${userId}`, {
            productId: product.id,
            quantity: 1,
            price: product.price,
        });

        setQuantities((prev) => ({
            ...prev,
            [product.id]: newQty,
        }));

        localStorage.setItem("cartUpdated", Date.now());
        window.dispatchEvent(new Event("storage"));
    };

    const decreaseQty = async (product) => {
        const currentQty = quantities[product.id] || 0;

        if (currentQty <= 1) {
            // REMOVE ALL items of this product
            await API.delete(`/cart/remove/product/${userId}/${product.id}`);

            setQuantities((prev) => ({
                ...prev,
                [product.id]: 0,
            }));

        } else {
            // REMOVE ONE ITEM (simulate by deleting all and re-adding remaining)
            await API.delete(`/cart/remove/product/${userId}/${product.id}`);

            const newQty = currentQty - 1;

            for (let i = 0; i < newQty; i++) {
                await API.post(`/cart/add/${userId}`, {
                    productId: product.id,
                    quantity: 1,
                    price: product.price,
                });
            }

            setQuantities((prev) => ({
                ...prev,
                [product.id]: newQty,
            }));
        }

        localStorage.setItem("cartUpdated", Date.now());
        window.dispatchEvent(new Event("storage"));
    };

    const fetchCartQuantities = async () => {
        if (!userId) return;
        const res = await API.get(`/cart/${userId}`);

        const qtyMap = {};

        res.data.forEach(item => {
            if (!qtyMap[item.productId]) {
                qtyMap[item.productId] = 0;
            }
            qtyMap[item.productId] += 1;
        });

        setQuantities(qtyMap);
    };

    // GROUP BY CATEGORY

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});

    if (selectedProduct) {
        return (
            <ProductDetail
                product={selectedProduct}
                goBack={() => setSelectedProduct(null)}
                setPage={setPage}
            />
        );
    }

    return (
        <div className="main-container">
            <Navbar setPage={setPage} onSearch={setSearchTerm} />
            <FitnessBanner />
            <BannerCarousel /> 

            {loading ? (
                // SKELETON LOADING
                <div style={{ padding: "20px" }}>
                    {[1, 2].map(section => (
                        <div key={section} className="category-section">

                            {/* SKELETON CATEGORY HEADER */}
                            <div className="shimmer" style={{
                                width: "140px", height: "32px",
                                borderRadius: "0 20px 20px 0",
                                marginBottom: "20px"
                            }} />

                            {/* SKELETON CARDS */}
                            <div className="product-grid">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            ) : (
                // REAL PRODUCTS
                Object.keys(groupedProducts).map((category) => (
                    <div key={category} className="category-section">
                        <h2>{category}</h2>
                        <div className="product-grid">
                            {groupedProducts[category].map((p) => (
                                <div key={p.id} className="card" onClick={() => setSelectedProduct(p)}>
                                    <div className="image-box">
                                        <img src={p.imageUrl} alt={p.name} className="product-img" />
                                    </div>
                                    <h3>{p.name}</h3>
                                    <p>₹{p.price}</p>
                                    <div className="hover-info">
                                        <p>Calories: {p.calories}</p>
                                        <p>Protein: {p.protein}g 💪</p>
                                    </div>
                                    {quantities[p.id] > 0 ? (
                                        <div className="qty-box">
                                            <button onClick={(e) => { e.stopPropagation(); decreaseQty(p); }}>-</button>
                                            <span>{quantities[p.id]}</span>
                                            <button onClick={(e) => { e.stopPropagation(); increaseQty(p); }}>+</button>
                                        </div>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}>
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            <Footer />
        </div>
    );
}

export default Products;