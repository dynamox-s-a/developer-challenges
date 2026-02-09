FROM python:3.11-slim

WORKDIR ./src

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# O container do Cronjob apenas roda o script e morre
CMD ["python", "src/cronjob.py"]