
from http import HTTPStatus


class AppException(Exception):

    error_code: str = "APP_ERROR"
    message: str = "An application error occurred"
    status_code: int = 400

    def __init__(self, message: str | None = None):
        self.message = message or self.__class__.message
        super().__init__(self.message)


# ---------------------------------------------------------------------------
# GENERIC errors
# ---------------------------------------------------------------------------

class InternalServerError(AppException):
    error_code = "INTERNAL_SERVER_ERROR"
    message = "An unexpected internal server error occurred"
    status_code = HTTPStatus.INTERNAL_SERVER_ERROR


class InvalidUUID(AppException):
    error_code = "INVALID_UUID"
    message = "The provided UUID is invalid"
    status_code = HTTPStatus.BAD_REQUEST


# ---------------------------------------------------------------------------
# TIMESERIES errors
# ---------------------------------------------------------------------------

class TimeseriesNotFound(AppException):
    error_code = "TIMESERIES_NOT_FOUND"
    message = "Time series not found"
    status_code = HTTPStatus.NOT_FOUND


class TimeseriesCreateFailed(AppException):
    error_code = "TIMESERIES_CREATE_FAILED"
    message = "Failed to create the time series"
    status_code = HTTPStatus.BAD_REQUEST


class TimeseriesPayloadTooLarge(AppException):
    error_code = "TIMESERIES_PAYLOAD_TOO_LARGE"
    message = "Time series exceeds the maximum allowed size of 1,000,000 data points"
    status_code = HTTPStatus.REQUEST_ENTITY_TOO_LARGE


class TimeseriesDeleteFailed(AppException):
    error_code = "TIMESERIES_DELETE_FAILED"
    message = "Failed to delete the time series"
    status_code = HTTPStatus.BAD_REQUEST


class TimeseriesDataEmpty(AppException):
    error_code = "TIMESERIES_DATA_EMPTY"
    message = "Time series must contain at least one data point"
    status_code = HTTPStatus.UNPROCESSABLE_ENTITY


class TimeseriesDataInvalid(AppException):
    error_code = "TIMESERIES_DATA_INVALID"
    message = "One or more data points have invalid values"
    status_code = HTTPStatus.UNPROCESSABLE_ENTITY


class TimeseriesDuplicateTimestamp(AppException):
    error_code = "TIMESERIES_DUPLICATE_TIMESTAMP"
    message = "A data point with this timestamp already exists in the series"
    status_code = HTTPStatus.CONFLICT


class TimeseriesMetricsFailed(AppException):
    error_code = "TIMESERIES_METRICS_FAILED"
    message = "Failed to compute metrics for the time series"
    status_code = HTTPStatus.INTERNAL_SERVER_ERROR
