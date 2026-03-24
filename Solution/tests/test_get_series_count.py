import uuid
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, patch

from app.infra.time_series import TimeSeries

# ── helpers ──────────────────────────────────────────────────────────────────

BASE_TS = datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
SERIES_URL = "/api/v1/signal/series"
COUNT_URL = "/api/v1/signal/series/count"

def make_payload(series_id: uuid.UUID, n: int = 100) -> dict:
    return {
        "name": "Count Series",
        "source": "generic_source",
        "unit": "V",
        "points": [
            {"ts": (BASE_TS + timedelta(seconds=i)).isoformat(), "value": float(i + 1)}
            for i in range(n)
        ],
    }

def make_fake_series(series_id: uuid.UUID, points_count: int = 100) -> TimeSeries:
    return TimeSeries(
        id=series_id,
        name="Count Series",
        source="generic_source",
        unit="V",
        created_at=datetime.now(timezone.utc),
        start_ts=BASE_TS,
        end_ts=BASE_TS + timedelta(seconds=points_count - 1),
        points_count=points_count,
        min_value=1.0,
        max_value=float(points_count),
        average=round((1.0 + float(points_count)) / 2, 1),
        min_value_aceptable_violated_count=0,
        max_value_aceptable_violated_count=0,
    )

# ── testes ────────────────────────────────────────────────────────────────────

class TestGetSeriesCount:
    @patch("app.services.signal_service.SeriesRepository")
    def test_post_then_get_count(self, mock_repo, client):
        """
        Cenário: O usuário cria uma série e consulta o total de séries armazenadas.
        """
        series_id = uuid.uuid4()
        fake_series = make_fake_series(series_id, points_count=75)

        # ── 1. POST: cria a série ─────────────────────────────────────────────
        mock_repo.create_series = AsyncMock(return_value=fake_series)

        post_response = client.post(SERIES_URL, json=make_payload(series_id, n=75))

        assert post_response.status_code == 201
        assert post_response.json()["id"] == str(series_id)

        # ── 2. GET /count: deve retornar 1 série armazenada ───────────────────
        mock_repo.get_series_count = AsyncMock(return_value=1)

        count_response = client.get(COUNT_URL)

        assert count_response.status_code == 200
        assert count_response.json() == {"count": 1}
