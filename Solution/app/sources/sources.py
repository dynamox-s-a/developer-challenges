from app.sources.voltage_sources import voltageMeterChinese_001

# Here you should register your meter...

class SourcesFactory:
    """Factory class to create sources."""
    @staticmethod
    def get_source(source_name: str) -> object:
        """Get a source by its name."""
        return {
            'voltageMeterChinese_001': voltageMeterChinese_001
        }.get(source_name, None)
