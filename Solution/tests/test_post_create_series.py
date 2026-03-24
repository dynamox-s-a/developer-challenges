import uuid
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, patch

import pytest

from app.infra.time_series import TimeSeries

# ── helpers ──────────────────────────────────────────────────────────────────

BASE_TS = datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
SERIES_URL = "/api/v1/signal/series"

def make_payload(n: int = 100, source: str = "generic_source") -> dict:
    return {
        "name": "Test Series",
        "source": source,
        "unit": "V",
        "points": [
            {
                "ts": (BASE_TS + timedelta(seconds=i)).isoformat(),
                "value": float(i + 1),
            }
            for i in range(n)
        ],
    }

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

class TestPostSeries:
    @patch("app.services.signal_service.SeriesRepository")
    def test_post_series(self, mock_repo, client):
        """
        Cenário: O usuário faz uma requisição POST para criar uma nova série de sinais.
        """
        fake = make_fake_series(100, "generic_source")
        mock_repo.create_series = AsyncMock(return_value=fake)

        response = client.post(SERIES_URL, json=make_payload(100))

        assert response.status_code == 201
        assert response.json() == {
            "id": str(fake.id),
            "name": fake.name,
            "source": fake.source,
            "unit": fake.unit,
            "points_count": fake.points_count,
            "start_ts": fake.start_ts.isoformat().replace("+00:00", "Z"),
            "end_ts": fake.end_ts.isoformat().replace("+00:00", "Z"),
            "created_at": fake.created_at.isoformat().replace("+00:00", "Z"),
            "min_value": fake.min_value,
            "max_value": fake.max_value,
            "average": fake.average,
            "min_value_aceptable_violated_count": fake.min_value_aceptable_violated_count,
            "max_value_aceptable_violated_count": fake.max_value_aceptable_violated_count,
        }

    @pytest.mark.parametrize("points_count", [1, 50, 100, 200])
    @patch("app.services.signal_service.SeriesRepository")
    def test_post_series_points_count(self, mock_repo, client, points_count):
        """
        Cenário: O número de pontos retornado na resposta reflete o payload enviado.
        """
        fake = make_fake_series(points_count)
        mock_repo.create_series = AsyncMock(return_value=fake)

        response = client.post(SERIES_URL, json=make_payload(points_count))

        assert response.status_code == 201
        assert response.json()["points_count"] == fake.points_count
        assert response.json()["name"] == fake.name
        assert response.json()["source"] == fake.source
        assert response.json()["unit"] == fake.unit
        assert response.json()["start_ts"] == fake.start_ts.isoformat().replace("+00:00", "Z")
        assert response.json()["end_ts"] == fake.end_ts.isoformat().replace("+00:00", "Z")
        assert response.json()["created_at"] == fake.created_at.isoformat().replace("+00:00", "Z")
        assert response.json()["min_value"] == fake.min_value
        assert response.json()["max_value"] == fake.max_value
        assert response.json()["average"] == fake.average
        assert response.json()["min_value_aceptable_violated_count"] == fake.min_value_aceptable_violated_count
        assert response.json()["max_value_aceptable_violated_count"] == fake.max_value_aceptable_violated_count

    def test_post_series_invalid_payload(self, client):
        """
        Cenário: O usuário faz uma requisição POST com um payload inválido.
        """

        # fakear payload e arrancar um campo obrigatório pro Pydantic atuar.
        invalid_payload = make_payload()
        invalid_payload.pop("name")
        
        response = client.post(SERIES_URL, json=invalid_payload)
        assert response.status_code == 422
        assert 'detail' in response.json()
        assert isinstance(response.json()['detail'], list)
        assert 'msg' in response.json()['detail'][0]
        assert response.json()['detail'][0]['msg'] == 'Field required'
        assert response.json()['detail'][0]['loc'] == ['body', 'name']
