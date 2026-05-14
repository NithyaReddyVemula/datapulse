import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.database import SessionLocal
from app.models.schemas import Transaction
from app.core.anomaly import AnomalyDetector, TransactionInput
from app.core.simulator import transaction_stream

router = APIRouter()

_detector = AnomalyDetector()


@router.websocket("/ws/transactions")
async def websocket_transactions(websocket: WebSocket):
    await websocket.accept()
    db = SessionLocal()
    try:
        async for tx_data in transaction_stream():
            tx_input = TransactionInput(
                amount=tx_data["amount"],
                category=tx_data["category"],
            )
            result = _detector.check(tx_input)
            _detector.update(tx_input)

            tx = Transaction(
                amount=tx_data["amount"],
                merchant=tx_data["merchant"],
                category=tx_data["category"],
                is_anomaly=result.is_anomaly,
                anomaly_method=result.anomaly_method,
                z_score=result.z_score,
                iqr_flagged=result.iqr_flagged,
            )
            db.add(tx)
            db.commit()
            db.refresh(tx)

            payload = {
                "id": tx.id,
                "amount": float(tx.amount),
                "merchant": tx.merchant,
                "category": tx.category,
                "is_anomaly": tx.is_anomaly,
                "anomaly_method": tx.anomaly_method,
                "z_score": float(tx.z_score) if tx.z_score else None,
                "iqr_flagged": tx.iqr_flagged,
                "ts": tx.ts.isoformat(),
            }
            await websocket.send_text(json.dumps(payload))

    except WebSocketDisconnect:
        pass
    finally:
        db.close()
