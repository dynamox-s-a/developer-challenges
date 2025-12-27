FROM python:3.12-slim

# Basic Python runtime settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Ensure imports like "from app..." work regardless of the current working directory
ENV PYTHONPATH=/app

WORKDIR /app

# System dependencies (curl is useful for debugging/healthchecks; optional)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
  && rm -rf /var/lib/apt/lists/*

# Create the directory used for the SQLite database inside the container
# (avoids "unable to open database file" when DATABASE_URL points to /data)
RUN mkdir -p /data

# Install Python dependencies (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and tests into the image
COPY app ./app
COPY tests ./tests

# Optional: include docs (nice for portfolio / container inspection)
COPY README.md ./

# Default runtime configuration for the container
# You can override these at runtime with `-e ...`
ENV DATABASE_URL="sqlite:////data/app.db"
ENV MAX_POINTS="200000"

EXPOSE 8000

# Default command runs the API server.
# To run tests instead:
#   docker run --rm -it <image> pytest -q
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
