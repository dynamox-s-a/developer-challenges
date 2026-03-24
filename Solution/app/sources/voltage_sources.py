# This file contains the sources of the signal, voltage meter.

# During the boot of API we could load all the sources in memory, and then we can access them when we need.
# We could expose the configuration of the sources through an endpoint, but for now we will just use it internally to validate the points that are being sent by the user.
class voltageMeterChinese_001:
    """Configuration for source VoltageMeterChinese001."""
    def __init__(self):
        self.name = "VoltageMeterChinese_001"
        self._minValueAcceptable = 210
        self._maxValueAcceptable = 230

    @property
    def minValueAcceptable(self):
        return self._minValueAcceptable

    @property
    def maxValueAcceptable(self):
        return self._maxValueAcceptable