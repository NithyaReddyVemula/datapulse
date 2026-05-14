from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.database import get_db
from app.models.schemas import Transaction
from app.models.pydantic_models import StatsOut, TransactionOut

router = APIRouter()


@router.get("/stats", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Transaction.id)).scalar() or 0
    anomalies = db.query(func.count(Transaction.id))\
        .filter(Transaction.is_anomaly == True).scalar() or 0
    rate = round((anomalies / total * 100), 2) if total > 0 else 0.0

    recent = db.query(Transaction)\
        .order_by(Transaction.ts.desc())\
        .limit(20).all()

    return StatsOut(
        total_transactions=total,
        total_anomalies=anomalies,
        anomaly_rate=rate,
        recent_transactions=[TransactionOut.model_validate(t) for t in recent],
    )
