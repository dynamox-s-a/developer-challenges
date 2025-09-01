# 🛠️ Backend .NET 8 + SQL Server

````markdown

Este é o backend do projeto, desenvolvido em **.NET 8** com **Entity Framework Core** e **SQL Server** para persistência de dados.

---

## 🚀 Get Started

1. Verifique os **pré-requisitos**.  
2. **Clone o repositório**.  
3. **Entre na pasta do backend**.  
4. **Configure a connection string no `appsettings.json`**.  
5. **Execute o script SQL ou rode migrations**.  
6. **Inicie a aplicação** 🚀.  

---

## 📦 Pré-requisitos

- .NET **8.0+**  
- SQL Server (pode ser via **Docker**)  
- Visual Studio ou VS Code  

---

## 📥 Clonando o Repositório

Clone o repositório e entre na pasta do backend:

```bash
git clone https://github.com/Rickccastro/developer-challenges.git
cd developer-challenges/FullStackDevelopmentChallenge
````
---

## ⚙️ Configuração do Banco de Dados

No arquivo `appsettings.json`, configure sua connection string. Exemplo para SQL Server rodando localmente:

```json
"ConnectionStrings": {
  "Connection": "Server=localhost;Database=FullStackDevelopmentChallenge;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> ⚠️ Ajuste **porta, usuário e senha** conforme sua configuração local.

---

## 🗄️ Executando o Script

Execute o script `DynamoScript.sql`, disponível na raiz do projeto, no seu banco de dados para criar a estrutura inicial.
---

## ▶️ Executando a Aplicação

Para rodar a API localmente:

```bash
dotnet run
```

A aplicação ficará disponível em:
👉 [https://localhost:7024](https://localhost:7024)

---

## 🛠️ Build para Produção

Para publicar a aplicação:

```bash
dotnet publish -c Release
```

Os arquivos finais ficarão na pasta:
`bin/Release/net8.0/publish`

---

## 📖 Tecnologias Utilizadas

* ⚙️ .NET 8
* 🗄️ Entity Framework Core
* 🛢️ SQL Server
```
