FROM python:3.11-slim
WORKDIR /app
COPY extractor.py .
RUN pip install requests
CMD ["python3", "extractor.py"]

