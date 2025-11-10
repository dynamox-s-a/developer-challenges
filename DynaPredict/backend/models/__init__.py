
# Package-level imports to ensure all model modules are loaded when
# `import models` is used. This avoids SQLAlchemy mapper initialization
# errors where relationships reference classes defined in other modules
# that haven't been imported yet.
from .user import User  # noqa: F401
from .machine import Machine  # noqa: F401
from .monitoring_point import MonitoringPoint  # noqa: F401
from .sensor import Sensor  # noqa: F401
