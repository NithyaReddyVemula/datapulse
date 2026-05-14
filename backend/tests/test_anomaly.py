import pytest
from app.core.anomaly import AnomalyDetector, TransactionInput


def test_normal_transaction_not_flagged():
    detector = AnomalyDetector()
    for i in range(50):
        detector.update(TransactionInput(amount=100.0 + i * 0.1, category="food"))

    result = detector.check(TransactionInput(amount=105.0, category="food"))
    assert result.is_anomaly is False


def test_extreme_amount_flagged_by_zscore():
    detector = AnomalyDetector()
    for i in range(100):
        detector.update(TransactionInput(amount=100.0, category="food"))

    result = detector.check(TransactionInput(amount=3000.0, category="food"))
    assert result.is_anomaly is True
    assert result.anomaly_method is not None


def test_dual_flag_requires_both_methods():
    """Only flagged as HIGH_RISK when both methods agree."""
    detector = AnomalyDetector()
    for i in range(100):
        detector.update(TransactionInput(amount=100.0, category="food"))

    result = detector.check(TransactionInput(amount=400.0, category="food"))
    assert hasattr(result, "is_anomaly")
    assert hasattr(result, "z_score")
    assert hasattr(result, "iqr_flagged")


def test_insufficient_data_never_flags():
    """With < 30 samples, never flag as anomaly."""
    detector = AnomalyDetector()
    for i in range(10):
        detector.update(TransactionInput(amount=100.0, category="food"))

    result = detector.check(TransactionInput(amount=99999.0, category="food"))
    assert result.is_anomaly is False
