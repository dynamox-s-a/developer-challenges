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

