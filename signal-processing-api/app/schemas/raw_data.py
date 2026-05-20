from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RawDataItem(BaseModel):
    timestamp: datetime
    value: float


class RawDataInput(RawDataItem):
    @field_validator("timestamp")
    @classmethod
    def timestamp_must_have_timezone(cls, value: datetime):
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("timestamp must include timezone")
        return value


class RawDataCreate(BaseModel):
    serial_device: str = Field(..., min_length=1)
    data: list[RawDataInput] = Field(..., min_length=1)

    @field_validator("serial_device")
    @classmethod
    def serial_device_must_not_be_blank(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("serial_device must not be blank")
        return value


class RejectedRawDataItem(BaseModel):
    timestamp: datetime
    reason: str


class RawDataCreateResponse(BaseModel):
    device_id: int
    serial_device: str
    inserted: int
    rejected: int
    details: list[RejectedRawDataItem]


class MetricValuePoint(BaseModel):
    value: float | None
    timestamp: datetime | None


class RawDataMetricsSummary(BaseModel):
    total_records: int
    average_value: float
    max: MetricValuePoint
    min: MetricValuePoint


class RawDataPeriod(BaseModel):
    start_time: datetime
    end_time: datetime


class RawDataMetricsResponse(BaseModel):
    device_id: int
    metrics: RawDataMetricsSummary
    period: RawDataPeriod


class DeleteRawDataResponse(BaseModel):
    success: bool
    deleted_records: int


class ActiveDevicesCountResponse(BaseModel):
    active_devices_count: int


class FullTimeSeriesItem(BaseModel):
    id: int
    timestamp: datetime
    value: float


class FullTimeSeriesResponse(BaseModel):
    device_id: int
    series_data: list[FullTimeSeriesItem]


class DeviceDataResponse(BaseModel):
    device_id: int
    data: list[RawDataItem]


class RawDataResponse(BaseModel):
    id: int
    device_id: int
    timestamp: datetime
    value: float
    created_at: datetime
    model_config =  ConfigDict(from_attributes=True  )

