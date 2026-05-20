from unittest.mock import MagicMock
from types import SimpleNamespace
from datetime import datetime, timezone
from app.service.raw_data_service import RawDataService
from app.core.exceptions import NotFoundException
import pytest


@pytest.mark.unit
def test_delete_by_device_success():
    device_repo = MagicMock()
    raw_repo = MagicMock()

    device_repo.get_by_deviceid.return_value = SimpleNamespace(id=1)
    raw_repo.delete_by_device_id.return_value = 3

    service = RawDataService(db=None)
    service.device_repo = device_repo
    service.raw_repo = raw_repo

    result = service.delete_by_device(1)

    assert result["success"] is True
    assert result["deleted_records"] == 3

    raw_repo.delete_by_device_id.assert_called_once_with(1)


@pytest.mark.unit
def test_delete_by_device_not_found():
    device_repo = MagicMock()
    raw_repo = MagicMock()

    device_repo.get_by_deviceid.return_value = None

    service = RawDataService(db=None)
    service.device_repo = device_repo
    service.raw_repo = raw_repo

    with pytest.raises(NotFoundException) as exc:
        service.delete_by_device(999)

    assert str(exc.value) == "Device not found"


@pytest.mark.unit
def test_get_device_metrics_not_found():
    device_repo = MagicMock()
    raw_repo = MagicMock()

    device_repo.get_by_deviceid.return_value = SimpleNamespace(id=1)
    raw_repo.get_time_series_stats.return_value = None

    service = RawDataService(db=None)
    service.device_repo = device_repo
    service.raw_repo = raw_repo

    with pytest.raises(NotFoundException) as exc:
        service.get_device_metrics(1)

    assert str(exc.value) == "Nenhum dado de série temporal encontrado para este dispositivo."


@pytest.mark.unit
def test_get_device_metrics_success():
    device_repo = MagicMock()
    raw_repo = MagicMock()

    device_repo.get_by_deviceid.return_value = SimpleNamespace(id=1)
    raw_repo.get_time_series_stats.return_value = {
        "general": SimpleNamespace(
            total_records=100,
            avg_value=20.0,
            first_timestamp=datetime(2026, 5, 18, 10, 0, tzinfo=timezone.utc),
            last_timestamp=datetime(2026, 5, 18, 11, 0, tzinfo=timezone.utc)
        ),
        "max_record": SimpleNamespace(
            value=30.0,
            timestamp=datetime(2026, 5, 18, 11, 0, tzinfo=timezone.utc)
        ),
        "min_record": SimpleNamespace(
            value=10.0,
            timestamp=datetime(2026, 5, 18, 10, 0, tzinfo=timezone.utc)
        )
    }

    service = RawDataService(db=None)
    service.device_repo = device_repo
    service.raw_repo = raw_repo

    result = service.get_device_metrics(1)

    assert result["metrics"]["min"]["value"] == 10.0
    assert result["metrics"]["max"]["value"] == 30.0
    assert result["metrics"]["average_value"] == 20.0
    assert result["metrics"]["total_records"] == 100
    assert result["period"]["start_time"] == datetime(2026, 5, 18, 10, 0, tzinfo=timezone.utc)
    assert result["period"]["end_time"] == datetime(2026, 5, 18, 11, 0, tzinfo=timezone.utc)


@pytest.mark.unit
def test_get_active_devices_count():
    raw_repo = MagicMock()
    raw_repo.count_devices_with_data.return_value = 5

    service = RawDataService(db=None)
    service.device_repo = MagicMock()
    service.raw_repo = raw_repo

    result = service.get_active_devices_count()

    assert result == {"active_devices_count": 5}


@pytest.mark.unit
def test_get_full_time_series_groups_by_device():
    raw_repo = MagicMock()
    raw_repo.get_all_devices_with_data.return_value = [
        SimpleNamespace(id=1, device_id=1, timestamp=datetime(2026, 5, 18, 10, 0, tzinfo=timezone.utc), value=10.0),
        SimpleNamespace(id=2, device_id=1, timestamp=datetime(2026, 5, 18, 11, 0, tzinfo=timezone.utc), value=20.0),
        SimpleNamespace(id=3, device_id=2, timestamp=datetime(2026, 5, 18, 12, 0, tzinfo=timezone.utc), value=30.0)
    ]

    service = RawDataService(db=None)
    service.device_repo = MagicMock()
    service.raw_repo = raw_repo

    result = service.get_full_time_series()

    assert len(result) == 2
    assert result[0]["device_id"] == 1
    assert result[0]["series_data"][0]["value"] == 10.0
    assert result[0]["series_data"][1]["value"] == 20.0
    assert result[1]["device_id"] == 2
    assert result[1]["series_data"][0]["value"] == 30.0


@pytest.mark.unit
def test_create_raw_data_rejects_existing_and_duplicate_timestamps():
    device_repo = MagicMock()
    raw_repo = MagicMock()

    device_repo.get_by_serial_device.return_value = SimpleNamespace(id=1)
    raw_repo.get_existing_timestamps.return_value = [
        (datetime(2026, 5, 18, 10, 0, tzinfo=timezone.utc),)
    ]
    raw_repo.bulk_create.return_value = {"status": "success", "count": 1}

    payload = SimpleNamespace(
        serial_device=" dev-123 ",
        data=[
            SimpleNamespace(timestamp=datetime(2026, 5, 18, 10, 0, tzinfo=timezone.utc), value=10.0),
            SimpleNamespace(timestamp=datetime(2026, 5, 18, 11, 0, tzinfo=timezone.utc), value=20.0),
            SimpleNamespace(timestamp=datetime(2026, 5, 18, 11, 0, tzinfo=timezone.utc), value=22.0)
        ]
    )

    service = RawDataService(db=None)
    service.device_repo = device_repo
    service.raw_repo = raw_repo

    result = service.create_raw_data(payload)

    assert result["serial_device"] == "DEV-123"
    assert result["inserted"] == 1
    assert result["rejected"] == 2
    assert {item["reason"] for item in result["details"]} == {"already_exists", "duplicate_in_payload"}
    raw_repo.bulk_create.assert_called_once()
