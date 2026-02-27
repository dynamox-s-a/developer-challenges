import enum


class MetricType(str, enum.Enum):
    RMS = "rms"
    PEAK = "peak"
    AVERAGE = "average"
    STD = "standard_deviation"
    KURTOSIS = "kurtosis"
    CREST_FACTOR = "crest_factor"