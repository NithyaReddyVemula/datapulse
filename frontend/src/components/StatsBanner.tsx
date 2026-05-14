interface Props {
  total: number;
  anomalies: number;
  connected: boolean;
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.8rem", fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase",
        letterSpacing: "0.08em", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function StatsBanner({ total, anomalies, connected }: Props) {
  const rate = total > 0 ? ((anomalies / total) * 100).toFixed(2) : "0.00";

  return (
    <div style={{ background: "#0f060f", border: "1px solid #4a134066",
      borderRadius: 12, padding: "20px 32px",
      display: "flex", gap: 48, alignItems: "center", justifyContent: "center",
      flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: connected ? "#6ee7b7" : "#f87171",
          boxShadow: connected ? "0 0 8px #6ee7b7" : "0 0 8px #f87171",
        }} />
        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
          {connected ? "LIVE" : "RECONNECTING..."}
        </span>
      </div>
      <Stat label="Total Transactions" value={total.toLocaleString()} color="#f9a8d4" />
      <Stat label="Anomalies" value={anomalies} color="#f87171" />
      <Stat label="Anomaly Rate" value={`${rate}%`}
        color={Number(rate) < 3 ? "#6ee7b7" : "#f9a8d4"} />
    </div>
  );
}
