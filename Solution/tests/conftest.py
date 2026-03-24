import os
import sys
from unittest.mock import MagicMock

# Ambas as linhas devem vir ANTES de qualquer import do pacote `app`,
# pois database.py inicializa o engine em nível de módulo.
#
# - DATABASE_URL: evita o ArgumentError por URL nula.
# - asyncpg mockado: evita ModuleNotFoundError do driver PostgreSQL,
#   que não precisa estar instalado pois get_db é 100% sobrescrito em testes.
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost/testdb")
sys.modules.setdefault("asyncpg", MagicMock())

import pytest
from fastapi.testclient import TestClient

from app import create_app
from app.infra.database import get_db

@pytest.fixture
def client():
    """TestClient com a dependência get_db sobrescrita por um mock.

    Nenhuma conexão real ao banco é feita durante os testes.
    O mock da sessão é injetado; as chamadas ao repositório são mockadas
    individualmente em cada teste.
    """
    app = create_app(testing=True)

    async def override_get_db():
        yield MagicMock()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
