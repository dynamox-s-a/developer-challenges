import uuid
from tortoise import fields
from tortoise.fields import CASCADE
from tortoise.models import Model

class TimeSeries(Model):
    id = fields.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()))
    name = fields.CharField(max_length=255, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)

    points: fields.ReverseRelation["DataPoint"]

    class Meta: # type: ignore
        table = "time_series"


class DataPoint(Model):
    id = fields.CharField(primary_key=True, max_length=36, default=lambda: str(uuid.uuid4()))
    series: fields.ForeignKeyRelation["TimeSeries"] = fields.ForeignKeyField(
        "models.TimeSeries", related_name="points", on_delete=CASCADE
    )
    timestamp = fields.DatetimeField()
    value = fields.FloatField()

    class Meta: # type: ignore
        table = "data_points"