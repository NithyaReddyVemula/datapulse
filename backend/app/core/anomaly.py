from collections import deque
from dataclasses import dataclass
from typing import Optional
import statistics


@dataclass
class TransactionInput:
    amount: float
    category: str


@dataclass
class AnomalyResult:
    is_anomaly: bool
    anomaly_method: Optional[str]  # 'zscore', 'iqr', 'both', or None
    z_score: Optional[float]
    iqr_flagged: bool


class AnomalyDetector:
    """Dual-method anomaly detection: Z-score and IQR.

    Only flags as anomaly (is_anomaly=True) when BOTH methods agree.
    Requires at least 30 samples to start flagging (warm-up period).
    """

    WINDOW = 1000
    Z_THRESHOLD = 3.0
    IQR_MULTIPLIER = 1.5
    MIN_SAMPLES = 30

    def __init__(self):
        self._window: deque[float] = deque(maxlen=self.WINDOW)

    def update(self, tx: TransactionInput) -> None:
        self._window.append(tx.amount)

    def check(self, tx: TransactionInput) -> AnomalyResult:
        if len(self._window) < self.MIN_SAMPLES:
            return AnomalyResult(is_anomaly=False, anomaly_method=None,
                                 z_score=None, iqr_flagged=False)

        amounts = list(self._window)
        mean = statistics.mean(amounts)
        stdev = statistics.stdev(amounts)

        z_score = None
        z_flagged = False
        if stdev > 0:
            z_score = (tx.amount - mean) / stdev
            z_flagged = abs(z_score) > self.Z_THRESHOLD
        elif tx.amount != mean:
            # Constant distribution — any deviation is infinitely anomalous
            z_flagged = True

        sorted_amounts = sorted(amounts)
        n = len(sorted_amounts)
        q1 = sorted_amounts[n // 4]
        q3 = sorted_amounts[(3 * n) // 4]
        iqr = q3 - q1
        lower = q1 - self.IQR_MULTIPLIER * iqr
        upper = q3 + self.IQR_MULTIPLIER * iqr
        iqr_flagged = tx.amount < lower or tx.amount > upper

        is_anomaly = z_flagged and iqr_flagged
        method = None
        if is_anomaly:
            method = "both"
        elif z_flagged:
            method = "zscore"
        elif iqr_flagged:
            method = "iqr"

        return AnomalyResult(
            is_anomaly=is_anomaly,
            anomaly_method=method,
            z_score=round(z_score, 4) if z_score is not None else None,
            iqr_flagged=iqr_flagged,
        )
