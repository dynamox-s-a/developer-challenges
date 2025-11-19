import enum

class SensorTypeEnum(str, enum.Enum):
    TCAG = "tcag"
    TCAS = "tcas"
    HFPLUS = "hfplus"
