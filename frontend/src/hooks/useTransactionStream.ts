import { useEffect, useRef, useState, useCallback } from "react";
import type { Transaction, StreamState } from "../types";

const WS_URL = import.meta.env.VITE_WS_URL || "wss://datapulse-api-a9d9.onrender.com/ws/transactions";
const MAX_FEED_SIZE = 100;

export function useTransactionStream(): StreamState {
  const [state, setState] = useState<StreamState>({
    transactions: [],
    connected: false,
    anomalyCount: 0,
    totalCount: 0,
    latestAnomaly: null,
  });

  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setState((s) => ({ ...s, connected: true }));

    ws.onmessage = (event) => {
      const tx: Transaction = JSON.parse(event.data);
      setState((s) => {
        const transactions = [tx, ...s.transactions].slice(0, MAX_FEED_SIZE);
        return {
          ...s,
          transactions,
          totalCount: s.totalCount + 1,
          anomalyCount: s.anomalyCount + (tx.is_anomaly ? 1 : 0),
          latestAnomaly: tx.is_anomaly ? tx : s.latestAnomaly,
        };
      });
    };

    ws.onclose = () => {
      setState((s) => ({ ...s, connected: false }));
      setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  return state;
}
