import { useTransactionStream } from "../hooks/useTransactionStream";
import { AnomalyAlert } from "./AnomalyAlert";
import { RiskGauge } from "./RiskGauge";
import { StatsBanner } from "./StatsBanner";
import { LiveFeed } from "./LiveFeed";

export function Dashboard() {
  const { transactions, connected, anomalyCount, totalCount, latestAnomaly } =
    useTransactionStream();

  const anomalyRate = totalCount > 0 ? (anomalyCount / totalCount) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#080308", color: "#e0d0e8",
      fontFamily: "system-ui, sans-serif", padding: "32px 40px" }}>

      <AnomalyAlert anomaly={latestAnomaly} />

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: "0.72rem", color: "#be185d", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>
          Real-Time Risk Monitoring
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fdf2f8", margin: 0 }}>
          DataPulse
        </h1>
        <p style={{ color: "#94a3b8", marginTop: 4, fontSize: "0.88rem" }}>
          Financial Transaction Anomaly Detection · Live Stream
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <StatsBanner total={totalCount} anomalies={anomalyCount} connected={connected} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RiskGauge anomalyRate={anomalyRate} />
          {latestAnomaly && (
            <div style={{ background: "#1a0808", border: "1px solid #f8717155",
              borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: "0.65rem", color: "#f87171", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Last Anomaly
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f87171" }}>
                ${latestAnomaly.amount.toFixed(2)}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>
                {latestAnomaly.merchant}
              </div>
              {latestAnomaly.z_score && (
                <div style={{ fontSize: "0.7rem", color: "#f9a8d4", marginTop: 4 }}>
                  Z: {latestAnomaly.z_score.toFixed(2)}σ
                </div>
              )}
            </div>
          )}
        </div>
        <LiveFeed transactions={transactions} />
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f060f; }
        ::-webkit-scrollbar-thumb { background: #4a1340; border-radius: 2px; }
      `}</style>
    </div>
  );
}
