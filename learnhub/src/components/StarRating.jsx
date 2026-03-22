export default function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span style={{ color: "var(--gold)", fontSize: 12, fontWeight: 600 }}>
      {"★".repeat(full)}{"☆".repeat(empty)} {rating}
    </span>
  );
}
