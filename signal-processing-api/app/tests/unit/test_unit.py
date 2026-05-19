from unittest.mock import MagicMock
from types import SimpleNamespace
from app.service.raw_data_service import RawDataService
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