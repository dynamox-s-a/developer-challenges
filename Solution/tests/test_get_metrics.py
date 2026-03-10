import uuid
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, patch

from app.infra.time_series import TimeSeries

# ── helpers ──────────────────────────────────────────────────────────────────

BASE_TS = datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
METRICS_SERIES_URL = "/api/v1/signal/metrics"

# build a fake TimeSeries that will be returned by the mocked repository
def make_fake_series(points_count: int = 100, source: str = "generic_source") -> TimeSeries:
    return TimeSeries(
        id=uuid.uuid4(),
        name="Test Series",
        source=source,
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

class TestGetMetrics:
    @patch("app.services.signal_service.SeriesRepository")
    def test_get_metrics_found(self, mock_repo, client):
        """
        Cenário: O usuário faz uma requisição GET para obter as métricas de uma série existente.
        """

        # Configura mocks do Repository
        mock_repo.get_series_by_id = AsyncMock(spec=TimeSeries)

        fake_series = make_fake_series(230, "voltageMeterChinese_001")

        mock_repo.get_series_by_id.return_value = fake_series

        response = client.get(f"{METRICS_SERIES_URL}/{fake_series.id}")

        assert response.status_code == 200
        assert response.json() == {
            "id": str(fake_series.id),
            "name": fake_series.name,
            "source": fake_series.source,
            "unit": fake_series.unit,
            "points_count": fake_series.points_count,
            "start_ts": fake_series.start_ts.isoformat().replace("+00:00", "Z"),
            "end_ts": fake_series.end_ts.isoformat().replace("+00:00", "Z"),
            "created_at": fake_series.created_at.isoformat().replace("+00:00", "Z"),
            "min_value": fake_series.min_value,
            "max_value": fake_series.max_value,
            "average": fake_series.average,
            "min_value_aceptable_violated_count": fake_series.min_value_aceptable_violated_count,
            "max_value_aceptable_violated_count": fake_series.max_value_aceptable_violated_count,
        }
