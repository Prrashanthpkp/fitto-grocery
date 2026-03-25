import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-line shimmer" style={{ width: "70%", marginTop: "12px" }} />
      <div className="skeleton-line shimmer" style={{ width: "40%" }} />
      <div className="skeleton-btn shimmer" />
    </div>
  );
}

export default SkeletonCard;