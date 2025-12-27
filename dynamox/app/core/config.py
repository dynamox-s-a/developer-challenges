import os

# Centralized configuration values for the application.
#
# In small projects, environment variables are a simple and effective way
# to configure runtime behavior without changing code.
#
# MAX_POINTS is a defensive limit to prevent extremely large payloads
# from consuming too much CPU/memory during ingestion.
MAX_POINTS = int(os.getenv("MAX_POINTS", "200000"))
