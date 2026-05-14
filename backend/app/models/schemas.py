from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Numeric, String, Integer
from app.models.database import Base


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = {"schema": "datapulse"}

    id = Column(Integer, primary_key=True)
    amount = Column(Numeric(12, 2), nullable=False)
    merchant = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    is_anomaly = Column(Boolean, default=False)
    anomaly_method = Column(String(10))
    z_score = Column(Numeric(8, 4))
    iqr_flagged = Column(Boolean, default=False)
    ts = Column(DateTime, default=datetime.utcnow)
