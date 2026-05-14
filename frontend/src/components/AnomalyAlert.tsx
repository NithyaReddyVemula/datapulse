import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../types";

interface Props {
  anomaly: Transaction | null;
}

export function AnomalyAlert({ anomaly }: Props) {
  const [visible, setVisible] = useState(false);
  const prevRef = useRef<Transaction | null>(null);

  useEffect(() => {
    if (anomaly && anomaly !== prevRef.current) {
      prevRef.current = anomaly;
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [anomaly]);

  if (!visible || !anomaly) return null;

  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 1000,
      background: "#1a0a0a", border: "2px solid #f87171",
      borderRadius: 12, padding: "16px 20px", maxWidth: 340,
      boxShadow: "0 0 30px #f8717166, 0 4px 20px rgba(0,0,0,0.8)",
    }}>
      <div style={{ fontSize: "0.7rem", color: "#f87171", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
        ⚠ ANOMALY DETECTED
      </div>
      <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fdf2f8" }}>
        ${anomaly.amount.toFixed(2)}
      </div>
      <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 4 }}>
        {anomaly.merchant} · {anomaly.anomaly_method?.toUpperCase()} method
      </div>
      {anomaly.z_score && (
        <div style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 4 }}>
          Z-score: {anomaly.z_score.toFixed(2)}σ
        </div>
      )}
    </div>
  );
}
