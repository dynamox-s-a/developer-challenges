FROM python:3.14-slim as baseimage

ENV POETRY_VERSION=2.2.1 \
    PATH="/root/.local/bin:$PATH"

RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"
COPY pyproject.toml poetry.lock ./
WORKDIR /
RUN poetry lock
RUN poetry install --no-root --no-interaction

COPY . .
CMD ["poetry", "run", "python", "src/main.py"]