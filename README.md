# 🎟️ Event Management System

Aplicação web desenvolvida como parte de um **teste técnico**, com o objetivo de demonstrar habilidades no desenvolvimento de interfaces modernas, controle de acesso por papéis de usuário e gerenciamento de eventos.

A aplicação permite que **administradores gerenciem eventos** enquanto **leitores podem visualizar as informações disponíveis**.

---

# 🌐 Deploy

A aplicação está disponível em:

https://dyna-eventhub.vercel.app/

---

# 👥 Usuários de Teste

Para facilitar a avaliação do sistema, existem dois usuários pré-configurados:

### 🔑 Admin

Email:

```
admin@events.com
```

Senha:

```
admin123
```

Permissões:

* Criar eventos
* Editar eventos
* Excluir eventos
* Visualizar eventos

---

### 👤 Reader

Email:

```
reader@events.com
```

Senha:

```
reader123
```

Permissões:

* Apenas visualizar eventos

---

# ⚙️ Rodando o projeto localmente

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/olivan94/developer-challenges.git
cd dynamox-event-app
```

---

### 2️⃣ Instalar as dependências

```bash
npm install
```

---

### 3️⃣ Iniciar a aplicação

Em outro terminal:

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3001
```

---

# ⚠️ Observação Importante

Antes de rodar a aplicação, **certifique-se de que está na pasta correta do projeto**, onde está localizado o arquivo:

```
package.json
```

Caso contrário os comandos `npm install` ou `npm run dev` podem não funcionar corretamente.

---

# 🛠️ Tecnologias Utilizadas

* Next.js
* React
* Redux Toolkit
* Material UI
* json-server

---

# 📌 Funcionalidades

* Autenticação de usuário
* Controle de acesso por papel (Admin / Reader)
* Listagem de eventos
* Criação de eventos
* Edição de eventos
* Exclusão de eventos
* Interface responsiva

---

# 📄 Observações

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica.

---
