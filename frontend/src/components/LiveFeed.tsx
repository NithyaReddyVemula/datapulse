import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

export function LiveFeed({ transactions }: Props) {
  return (
    <div style={{ background: "#0f060f", border: "1px solid #4a134066",
      borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #2a0f2a",
        fontSize: "0.75rem", color: "#f9a8d4", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Live Transaction Feed
      </div>
      <div style={{ height: 400, overflowY: "auto" }}>
        {transactions.map((tx) => (
          <div key={tx.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 16px", borderBottom: "1px solid #1a0a1a",
            background: tx.is_anomaly ? "#1a0808" : "transparent",
            borderLeft: tx.is_anomaly ? "3px solid #f87171" : "3px solid transparent",
          }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: tx.is_anomaly ? "#f87171" : "#e0d0e8",
                fontWeight: tx.is_anomaly ? 700 : 400 }}>
                {tx.merchant}
                {tx.is_anomaly && (
                  <span style={{ marginLeft: 8, fontSize: "0.6rem", background: "#f8717122",
                    border: "1px solid #f8717155", color: "#f87171", padding: "1px 6px",
                    borderRadius: 4, fontWeight: 700 }}>
                    {tx.anomaly_method?.toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: 2 }}>
                {tx.category} · {new Date(tx.ts).toLocaleTimeString()}
              </div>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700,
              color: tx.is_anomaly ? "#f87171" : "#e0d0e8" }}>
              ${tx.amount.toFixed(2)}
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b",
            fontSize: "0.85rem" }}>
            Connecting to transaction stream...
          </div>
        )}
      </div>
    </div>
  );
}
