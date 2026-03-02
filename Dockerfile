FROM python:3.12-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os requisitos primeiro para otimizar o cache do Docker
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto do código do projeto para dentro do container
COPY . .

# Expõe a porta que o FastAPI vai usar
EXPOSE 8000

# Comandos para iniciar a aplicação
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]