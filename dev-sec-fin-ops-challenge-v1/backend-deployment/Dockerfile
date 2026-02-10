FROM python:3.11-slim

WORKDIR /src

# Dependency installation for the backend.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# The backend container runs the Flask application using Gunicorn. Must be accessed through localhost:5000.
CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:5000", "--access-logfile", "-", "--error-logfile", "-", "src.backend:app"]