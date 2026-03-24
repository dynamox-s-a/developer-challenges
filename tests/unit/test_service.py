import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timezone

from app.core.exceptions import TimeSeriesNotFoundError, TimeSeriesAlreadyExistsError
from app.models.timeseries import TimeSeries, DataPoint
from app.schemas.timeseries import TimeSeriesCreate, DataPointIn
from app.services.timeseries_service import TimeSeriesService, _compute_metrics


def mock_series(series_id="abc", name="motor-01") -> MagicMock:
    s = MagicMock(spec=TimeSeries)
    s.id = series_id
    s.name = name
    s.description = None
    s.unit = "rpm"
    now = datetime.now(timezone.utc)
    s.created_at = now
    s.updated_at = now
    return s


def mock_points(values: list[float]) -> list[MagicMock]:
    return [MagicMock(spec=DataPoint, timestamp=float(i), value=v) for i, v in enumerate(values)]


def make_service() -> tuple[TimeSeriesService, MagicMock]:
    svc = TimeSeriesService.__new__(TimeSeriesService)
    repo = MagicMock()
    svc._repo = repo
    return svc, repo


# --- store ---

@pytest.mark.asyncio
async def test_store_ok():
    svc, repo = make_service()
    repo.get_by_name = AsyncMock(return_value=None)
    repo.create = AsyncMock(return_value=mock_series())

    result = await svc.store(TimeSeriesCreate(name="motor-01", data=[DataPointIn(timestamp=0.0, value=1.0)]))
    assert result.name == "motor-01"


@pytest.mark.asyncio
async def test_store_duplicate_raises():
    svc, repo = make_service()
    repo.get_by_name = AsyncMock(return_value=mock_series())

    with pytest.raises(TimeSeriesAlreadyExistsError):
        await svc.store(TimeSeriesCreate(name="motor-01", data=[DataPointIn(timestamp=0.0, value=1.0)]))


# --- retrieve ---

@pytest.mark.asyncio
async def test_retrieve_returns_points():
    svc, repo = make_service()
    s = mock_series()
    s.data_points = mock_points([1.0, 2.0, 3.0])
    repo.get_by_id_with_data = AsyncMock(return_value=s)

    result = await svc.retrieve("abc")
    assert result.point_count == 3


@pytest.mark.asyncio
async def test_retrieve_not_found():
    svc, repo = make_service()
    repo.get_by_id_with_data = AsyncMock(return_value=None)

    with pytest.raises(TimeSeriesNotFoundError):
        await svc.retrieve("ghost")


# --- delete ---

@pytest.mark.asyncio
async def test_delete_ok():
    svc, repo = make_service()
    repo.get_by_id = AsyncMock(return_value=mock_series())
    repo.delete = AsyncMock()

    result = await svc.delete("abc")
    assert "deleted" in result.message.lower()
    repo.delete.assert_awaited_once_with("abc")


@pytest.mark.asyncio
async def test_delete_not_found():
    svc, repo = make_service()
    repo.get_by_id = AsyncMock(return_value=None)

    with pytest.raises(TimeSeriesNotFoundError):
        await svc.delete("ghost")


# --- count ---

@pytest.mark.asyncio
async def test_count():
    svc, repo = make_service()
    repo.count = AsyncMock(return_value=7)

    result = await svc.count()
    assert result.count == 7


# --- metrics ---

def test_metrics_basic():
    s = mock_series()
    points = mock_points([0.0, 1.0, 2.0, 3.0, 4.0])

    m = _compute_metrics(s, points)

    assert m.min == 0.0
    assert m.max == 4.0
    assert m.mean == pytest.approx(2.0)
    assert m.point_count == 5
    assert m.duration_seconds == pytest.approx(4.0)


def test_metrics_rms_all_ones():
    s = mock_series()
    points = mock_points([1.0, 1.0, 1.0, 1.0])
    assert _compute_metrics(s, points).rms == pytest.approx(1.0)


def test_metrics_single_point():
    s = mock_series()
    m = _compute_metrics(s, mock_points([5.0]))
    assert m.std == 0.0
    assert m.duration_seconds == 0.0
