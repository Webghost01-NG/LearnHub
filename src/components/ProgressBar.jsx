export default function ProgressBar({ percent, height = 6, showLabel = false }) {
  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          <span style={{ color: "var(--text2)" }}>Progress</span>
          <span style={{ color: "var(--green)", fontWeight: 600 }}>{percent}%</span>
        </div>
      )}
      <div className="progress-bar" style={{ height }}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
