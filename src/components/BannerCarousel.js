import { useState, useEffect } from "react";
import "./BannerCarousel.css";

const banners = [
    {
        id: 1,
        tag: "🚚 FREE DELIVERY",
        title: "Fresh Groceries\nAt Your Door",
        subtitle: "Order above ₹500 and get free delivery!",
        emoji: "🛒",
        gradient: "linear-gradient(135deg, #1b5e20cc, #2e7d32cc)",
        accent: "#ffd600",
    },
    {
        id: 2,
        tag: "💪 FITNESS SPECIAL",
        title: "High Protein\nPicks For You",
        subtitle: "Chicken, Eggs, Salmon & more — fuel your gains!",
        emoji: "🥩",
        gradient: "linear-gradient(135deg, #0d47a1cc, #1565c0cc)",
        accent: "#69f0ae",
    },
    {
        id: 3,
        tag: "⚡ LIMITED OFFER",
        title: "20% Off On\nSupplements",
        subtitle: "Whey, BCAA, Creatine — shop before it's gone!",
        emoji: "💊",
        gradient: "linear-gradient(135deg, #4a148ccc, #6a1b9acc)",
        accent: "#ffd600",
    },
    {
        id: 4,
        tag: "🌿 ORGANIC",
        title: "100% Fresh\nOrganic Veggies",
        subtitle: "Farm to table — no preservatives, just pure goodness!",
        emoji: "🥦",
        gradient: "linear-gradient(135deg, #e65100cc, #f57c00cc)",
        accent: "#ccff90",
    },
    {
        id: 5,
        tag: "🔥 FAT LOSS",
        title: "Goal-Based\nGrocery Plans",
        subtitle: "Eat smart — curated picks for your fitness goal!",
        emoji: "🎯",
        gradient: "linear-gradient(135deg, #b71c1ccc, #c62828cc)",
        accent: "#80d8ff",
    },
];

function BannerCarousel() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimating(true);
            setCurrent(prev => (prev + 1) % banners.length);
            setTimeout(() => setAnimating(false), 500);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const goTo = (index) => {
        if (animating) return;
        setAnimating(true);
        setCurrent(index);
        setTimeout(() => setAnimating(false), 500);
    };

    const goNext = () => goTo((current + 1) % banners.length);
    const goPrev = () => goTo((current - 1 + banners.length) % banners.length);
    const banner = banners[current];

    return (
        <div className="carousel-wrapper">
            <div
                className={`carousel-banner ${animating ? "animating" : ""}`}
                style={{ background: banner.gradient }}
            >
                {/* GLASSMORPHISM CARD */}
                <div className="glass-card">

                    <span className="banner-tag" style={{ color: banner.accent }}>
                        {banner.tag}
                    </span>

                    <h2 className="banner-title">
                        {banner.title.split("\n").map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
                    </h2>

                    <p className="banner-subtitle">{banner.subtitle}</p>

                    <button className="banner-btn" style={{ background: banner.accent }}>
                        Shop Now →
                    </button>

                </div>

                {/* BIG EMOJI */}
                <div className="banner-emoji">{banner.emoji}</div>

                {/* DECORATIVE CIRCLES */}
                <div className="deco-circle c1" />
                <div className="deco-circle c2" />
                <div className="deco-circle c3" />

                {/* ARROWS */}
                <button className="carousel-arrow left" onClick={goPrev}>‹</button>
                <button className="carousel-arrow right" onClick={goNext}>›</button>

            </div>

            {/* DOTS */}
            <div className="carousel-dots">
                {banners.map((_, i) => (
                    <div
                        key={i}
                        className={`carousel-dot ${i === current ? "active" : ""}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

        </div>
    );
}

export default BannerCarousel;