import "./FitnessBanner.css";

const tips = [
  "💪 Protein helps muscle recovery after workouts",
  "🥦 Eat greens daily for better immunity",
  "🏃 30 mins of cardio burns up to 300 calories",
  "🥑 Healthy fats support brain function",
  "💧 Drink 8 glasses of water every day",
  "🐟 Omega-3 reduces inflammation naturally",
  "🌿 Organic food = fewer toxins in your body",
  "🍳 Eggs are the most complete protein source",
  "🧘 Sleep 7-8 hrs for optimal muscle growth",
  "🥗 Eat a rainbow of veggies for full nutrition",
];

function FitnessBanner() {
  return (
    <div className="fitness-banner">
      <div className="ticker-track">
        {[...tips, ...tips].map((tip, i) => (
          <span key={i} className="ticker-item">
            {tip}
            <span className="ticker-dot">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default FitnessBanner;