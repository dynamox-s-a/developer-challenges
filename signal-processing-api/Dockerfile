FROM python:3.13-slim

WORKDIR /code

COPY ./pyproject.toml /code/pyproject.toml

COPY ./app /code/app

COPY ./tests /code/tests

RUN pip install --no-cache-dir --upgrade /code/.

EXPOSE 80

CMD ["fastapi", "run", "app/main.py", "--port", "80"]