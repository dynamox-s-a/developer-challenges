from app.models import TimeSeries


def calculate_metrics(
        timeseries: TimeSeries,
):
    values = timeseries.values

    return {
        "count": len(values),
        "min": min(values),
        "max": max(values),
        "mean": sum(values) / len(values),
    }