import uuid
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, patch

from app.infra.time_series import TimeSeries, TimeSeriesPoint
from app.repositories.signal_repository import SERIES_PAGE_SIZE

# ── helpers ──────────────────────────────────────────────────────────────────

BASE_TS = datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
SERIES_URL = "/api/v1/signal/series"
TOTAL_POINTS = 452

def make_payload() -> dict:
    return {
        "name": "Paginated Series",
        "source": "generic_source",
        "unit": "V",
        "points": [
            {"ts": (BASE_TS + timedelta(seconds=i)).isoformat(), "value": float(i + 1)}
            for i in range(TOTAL_POINTS)
        ],
    }

def make_fake_series(series_id: uuid.UUID) -> TimeSeries:
    return TimeSeries(
        id=series_id,
        name="Paginated Series",
        source="generic_source",
        unit="V",
        created_at=datetime.now(timezone.utc),
        start_ts=BASE_TS,
        end_ts=BASE_TS + timedelta(seconds=TOTAL_POINTS - 1),
        points_count=TOTAL_POINTS,
        min_value=1.0,
        max_value=float(TOTAL_POINTS),
        average=round((1.0 + float(TOTAL_POINTS)) / 2, 1),
        min_value_aceptable_violated_count=0,
        max_value_aceptable_violated_count=0,
    )

def make_points(series_id: uuid.UUID, start: int, count: int) -> list[TimeSeriesPoint]:
    """Cria `count` TimeSeriesPoints a partir do índice `start`."""
    return [
        TimeSeriesPoint(
            series_id=series_id,
            ts=BASE_TS + timedelta(seconds=start + i),
            value=float(start + i + 1),
        )
        for i in range(count)
    ]

# ── testes ────────────────────────────────────────────────────────────────────

class TestGetSeriesPaginated:
    @patch("app.services.signal_service.SeriesRepository")
    def test_paginate_all_points(self, mock_repo, client):
        """
        Cenário: O usuário cria uma série com 452 pontos e percorre todas as
        páginas até esgotar os pontos.

        Com PAGE_SIZE=150 e 452 pontos, esperam-se 4 páginas:
          página 1 → 150 pontos, has_more=True,  next_offset=150
          página 2 → 150 pontos, has_more=True,  next_offset=300
          página 3 → 150 pontos, has_more=True,  next_offset=450
          página 4 →   2 pontos, has_more=False, next_offset=None
        """
        series_id = uuid.uuid4()
        fake_series = make_fake_series(series_id)

        # ── 1. POST: cria a série ─────────────────────────────────────────────
        mock_repo.create_series = AsyncMock(return_value=fake_series)

        post_response = client.post(SERIES_URL, json=make_payload())

        assert post_response.status_code == 201
        assert post_response.json()["points_count"] == TOTAL_POINTS

        # ── 2-5. GET paginado: o repositório devolve PAGE_SIZE+1 rows por
        #         chamada para que o serviço consiga detetar has_more.
        #
        #   offset=  0 → devolve 151 rows → has_more=True,  próxima página em 150
        #   offset=150 → devolve 151 rows → has_more=True,  próxima página em 300
        #   offset=300 → devolve 151 rows → has_more=True,  próxima página em 450
        #   offset=450 → devolve   2 rows → has_more=False, fim
        #   mockado para 4 chamadas
        mock_repo.get_full_series_paginated = AsyncMock(side_effect=[
            make_points(series_id, start=0,   count=SERIES_PAGE_SIZE + 1),  # 151
            make_points(series_id, start=150, count=SERIES_PAGE_SIZE + 1),  # 151
            make_points(series_id, start=300, count=SERIES_PAGE_SIZE + 1),  # 151
            make_points(series_id, start=450, count=2),                     #   2
        ])

        paginated_url = f"{SERIES_URL}/{series_id}/data"
        total_received = 0

        # ── página 1 (sem offset) ─────────────────────────────────────────────
        r1 = client.get(paginated_url)
        assert r1.status_code == 200
        assert len(r1.json()["data"]) == SERIES_PAGE_SIZE
        assert r1.json()["has_more"] is True
        assert r1.json()["next_offset"] == 150
        total_received += len(r1.json()["data"])

        # ── página 2 ──────────────────────────────────────────────────────────
        r2 = client.get(paginated_url, params={"offset": r1.json()["next_offset"]})
        assert r2.status_code == 200
        assert len(r2.json()["data"]) == SERIES_PAGE_SIZE
        assert r2.json()["has_more"] is True
        assert r2.json()["next_offset"] == 300
        total_received += len(r2.json()["data"])

        # ── página 3 ──────────────────────────────────────────────────────────
        r3 = client.get(paginated_url, params={"offset": r2.json()["next_offset"]})
        assert r3.status_code == 200
        assert len(r3.json()["data"]) == SERIES_PAGE_SIZE
        assert r3.json()["has_more"] is True
        assert r3.json()["next_offset"] == 450
        total_received += len(r3.json()["data"])

        # ── página 4 (última) ─────────────────────────────────────────────────
        r4 = client.get(paginated_url, params={"offset": r3.json()["next_offset"]})
        assert r4.status_code == 200
        assert len(r4.json()["data"]) == TOTAL_POINTS - (SERIES_PAGE_SIZE * 3)  # 2
        assert r4.json()["has_more"] is False
        assert r4.json()["next_offset"] is None
        total_received += len(r4.json()["data"])

        # ── total acumulado deve ser igual ao total enviado no POST ───────────
        assert total_received == TOTAL_POINTS
