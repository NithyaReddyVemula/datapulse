from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class TransactionOut(BaseModel):
    id: int
    amount: Decimal
    merchant: str
    category: str
    is_anomaly: bool
    anomaly_method: Optional[str]
    z_score: Optional[Decimal]
    iqr_flagged: bool
    ts: datetime

    model_config = {"from_attributes": True}


class StatsOut(BaseModel):
    total_transactions: int
    total_anomalies: int
    anomaly_rate: float
    recent_transactions: list[TransactionOut]
