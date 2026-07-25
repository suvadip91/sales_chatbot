from fastapi.testclient import TestClient

from main import app, conversation_history


def test_reset_clears_requested_customer_history():
    client = TestClient(app)
    conversation_history.clear()
    conversation_history["demo"] = [{"role": "user", "content": "hello"}]

    response = client.post("/reset", json={"customer_id": "demo"})

    assert response.status_code == 200
    assert response.json()["status"] == "history cleared"

    history_response = client.get("/history", params={"customer_id": "demo"})
    assert history_response.json()["conversation_history"] == []
