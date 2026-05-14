import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200


def test_stats_returns_200():
    r = client.get("/api/stats")
    assert r.status_code == 200


def test_stats_shape():
    r = client.get("/api/stats")
    data = r.json()
    assert "total_transactions" in data
    assert "total_anomalies" in data
    assert "anomaly_rate" in data
    assert "recent_transactions" in data
    assert isinstance(data["recent_transactions"], list)
