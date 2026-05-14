export interface Transaction {
  id: number;
  amount: number;
  merchant: string;
  category: string;
  is_anomaly: boolean;
  anomaly_method: string | null;
  z_score: number | null;
  iqr_flagged: boolean;
  ts: string;
}

export interface StreamState {
  transactions: Transaction[];
  connected: boolean;
  anomalyCount: number;
  totalCount: number;
  latestAnomaly: Transaction | null;
}
