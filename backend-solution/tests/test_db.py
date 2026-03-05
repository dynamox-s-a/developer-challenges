from datetime import datetime

from sqlalchemy import select

from app.models import DataPoints, TimeSeries


def test_create_time_series(session):
    new_series = TimeSeries(name='Sensor Temperatura')
    session.add(new_series)
    session.commit()

    series = session.scalar(
        select(TimeSeries).where(TimeSeries.name == 'Sensor Temperatura')
    )

    assert series.id is not None
    assert series.name == 'Sensor Temperatura'
    assert series.created_at is not None


def test_create_time_series_with_data_points(session):
    new_series = TimeSeries(name='Sensor Pressao')
    session.add(new_series)
    session.commit()

    point1 = DataPoints(timestamp=datetime(2026, 3, 4, 10, 0, 0), value=23.5)
    point2 = DataPoints(timestamp=datetime(2026, 3, 4, 10, 1, 0), value=24.1)
    new_series.data_points.append(point1)
    new_series.data_points.append(point2)
    session.commit()

    series = session.scalar(
        select(TimeSeries).where(TimeSeries.id == new_series.id)
    )

    assert len(series.data_points) == int(2)
    assert series.data_points[0].value == float(23.5)
    assert series.data_points[1].value == float(24.1)


def test_create_data_point(session):
    series = TimeSeries(name='Sensor Umidade')
    session.add(series)
    session.commit()

    point = DataPoints(timestamp=datetime(2026, 3, 4, 12, 0, 0), value=65.3)
    series.data_points.append(point)
    session.commit()

    result = session.scalar(
        select(DataPoints).where(DataPoints.series_id == series.id)
    )

    assert result.value == float(65.3)
    assert result.series_id == series.id
    assert result.series.name == 'Sensor Umidade'


def test_delete_series_deletes_data_points(session):
    series = TimeSeries(name='Series para deletar')
    session.add(series)
    session.commit()

    point = DataPoints(timestamp=datetime(2026, 3, 4, 14, 0, 0), value=100.0)
    series.data_points.append(point)
    session.commit()

    series_id = series.id

    session.delete(series)
    session.commit()

    remaining_points = session.scalars(
        select(DataPoints).where(DataPoints.series_id == series_id)
    ).all()

    assert len(remaining_points) == 0
