class TimeSeriesNotFoundError(Exception):
    def __init__(self, series_id: str):
        self.series_id = series_id
        super().__init__(f"Time series '{series_id}' not found.")


class TimeSeriesAlreadyExistsError(Exception):
    def __init__(self, name: str):
        self.name = name
        super().__init__(f"A series named '{name}' already exists.")


class InvalidTimeSeriesDataError(Exception):
    def __init__(self, detail: str):
        super().__init__(f"Invalid data: {detail}")
