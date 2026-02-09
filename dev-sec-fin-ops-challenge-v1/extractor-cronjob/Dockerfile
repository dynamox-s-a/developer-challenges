FROM python:3.11-slim

WORKDIR ./src

# Instalation of dependencies for the cronjob.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cronjob container just runs the script and exits.
CMD ["python", "src/cronjob.py"]