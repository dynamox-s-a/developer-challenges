Você pode subir o banco com acessando a pasta do docker-compose.yml (no caso está no back) e rodando o comando:
- docker compose up -d

Após subir o banco, rodar os sqls no Postgree

CREATE SCHEMA IF NOT EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios.usuario (
    id SERIAL PRIMARY KEY,       
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL
);

CREATE SCHEMA IF NOT EXISTS machines;

CREATE TABLE IF NOT EXISTS machines.machine (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL
);

CREATE SCHEMA IF NOT EXISTS points;

CREATE TABLE IF NOT EXISTS points.point (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  machine_id INT REFERENCES machines.machine(id) ON DELETE CASCADE
);


CREATE SCHEMA IF NOT EXISTS sensors;

CREATE TABLE IF NOT EXISTS sensors.sensor (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  point_id INT REFERENCES points.point(id) ON DELETE CASCADE
);

O node precisa estar rodando na porta 3000 para funcionar, ver env.example