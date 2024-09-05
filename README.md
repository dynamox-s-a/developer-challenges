Aqui está o `README.md` com a formatação correta fora do bloco de código, para que você possa utilizá-lo diretamente:

---

# **Dynamax Full-Stack Developer Challenge**

## **Douglas Pereira - Full Stack Developer**

Aplicação desenvolvida para o **Desafio Full Stack da Dynamox**, com foco em autenticação, gerenciamento de máquinas, monitoramento de ativos e sensores. Este projeto foi construído para demonstrar minhas habilidades como desenvolvedor Full Stack, utilizando tecnologias modernas e boas práticas de desenvolvimento.

---

## **Estrutura Geral do Projeto**

### **1. Autenticação e Controle de Acesso**

A autenticação do usuário é realizada por **JSON Web Token (JWT)**, garantindo acesso seguro às áreas restritas.

- **Página de Login** (`/login`):  
  Aqui, o usuário insere seu e-mail e senha. Após a autenticação bem-sucedida, o usuário é redirecionado para a página de **Gerenciamento de Máquinas**.
  
- **Página de Registro** (`/register`):  
  Permite que novos usuários se registrem informando nome, sobrenome, e-mail e senha. Após o registro, o usuário é redirecionado para o login.

### **2. Dashboard Principal - Gerenciamento de Máquinas**

- **Página Inicial** (`/machines`):  
  Esta página exibe todas as máquinas cadastradas no sistema com informações como **Nome**, **Tipo** (Bomba, Ventilador), e **Status** (Ativa, Inativa). Também inclui:
  - **Botão para Adicionar Máquina**: Direciona o usuário para o formulário de cadastro.
  - **Ver Detalhes**: Leva o usuário à página de monitoramentos da máquina.

- **Adicionar Máquina** (`/machines/new`):  
  Formulário que permite inserir uma nova máquina com **Nome**, **Tipo** e **Status**. A máquina é listada automaticamente após o cadastro.

- **Editar Máquina** (`/machines/edit/:id`):  
  Permite a edição das informações da máquina, com a possibilidade de atualizar **nome**, **tipo** e **status**.

### **3. Gerenciamento de Monitoramentos**

- **Página de Detalhes da Máquina** (`/machines/:id`):  
  Exibe todos os monitoramentos relacionados à máquina selecionada. Cada monitoramento contém informações como **Nome do Monitoramento** e **Status**.

  - **Adicionar Monitoramento** (`/machines/:machineId/add-monitoring`): Permite adicionar um novo monitoramento a uma máquina específica.
  
  - **Editar Monitoramento** (`/machines/:id/monitorings/:monitoringId/edit`): Atualiza as informações de um monitoramento específico.
  
  - **Ver Detalhes do Monitoramento** (`/machines/:id/monitorings/:monitoringId`): Exibe os sensores associados ao monitoramento selecionado.

### **4. Gerenciamento de Sensores**

- **Adicionar Sensor** (`/machines/:id/monitorings/:monitoringId/add-sensor`):  
  Permite adicionar um sensor a um monitoramento. Inclui campos para **Nome**, **Modelo**, e **Status** do sensor.

- **Editar Sensor** (`/machines/:id/monitorings/:monitoringId/sensors/:sensorId/edit`):  
  Permite editar as informações de um sensor, com atualização de **nome** e **status**.

### **5. Visualização e Organização de Dados**

- **Paginação e Ordenação**:  
  A aplicação suporta a visualização de máquinas e monitoramentos com paginação, exibindo 5 itens por página, e possibilitando ordenar as colunas por **Nome**, **Tipo**, **Status**, e **Data de Modificação**.
  
- **Navegação Facilitada**:  
  Todas as páginas contam com breadcrumbs para facilitar a navegação entre diferentes seções da aplicação.

### **6. Controle de Sessão**

- **Rotas Privadas**: Apenas usuários autenticados com um token JWT podem acessar áreas restritas. Se o token expirar ou for inválido, o usuário é redirecionado para o login.
- **Redirecionamento Automático**: Usuários autenticados são redirecionados para o painel de controle, enquanto usuários não autenticados são levados à página de login.

---

## **Tecnologias Utilizadas**

### **Front-End**
- **React.js**: Framework para construção de interfaces de usuário.
- **TypeScript**: Garantindo tipagem estática para maior segurança no código.
- **Material UI**: Biblioteca de componentes estilizados e responsivos.
- **React Router**: Gerenciamento de rotas e navegação.
- **Redux**: Gerenciamento de estado global.

### **Back-End**
- **Node.js**: Ambiente JavaScript no servidor.
- **Express.js**: Framework para criação de APIs RESTful.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenamento.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB.
- **JWT (JSON Web Token)**: Controle de sessão e autenticação segura.

### **Outros**
- **NX Workspace**: Monorepo para gerenciar front-end e back-end de forma escalável.
- **Axios**: Cliente HTTP para fazer requisições assíncronas.
- **Cypress**: Testes end-to-end simulando interações de usuário.
- **Heroku**: Plataforma de nuvem onde a aplicação foi implantada.

---

## **Futuras Implementações**

### **1. Monitoramento em Tempo Real**
- Implementação de uma funcionalidade que permita monitoramento de dados em tempo real usando **WebSockets**. Isso permitirá que o usuário visualize em tempo real o status dos sensores e das máquinas, com atualizações automáticas.

### **2. Dashboard Analítico**
- Criação de uma página de **dashboard analítico** para fornecer insights visuais sobre o desempenho e o status dos ativos monitorados ao longo do tempo. Isso incluiria gráficos e relatórios.

### **3. Alertas e Notificações**
- Desenvolvimento de um sistema de alertas que notificará o usuário em caso de falhas ou comportamentos anormais nos ativos monitorados. As notificações podem ser enviadas por e-mail ou via SMS.

### **4. Integração com APIs de IoT**
- Conectar a aplicação com APIs de dispositivos IoT para capturar dados diretamente dos sensores em campo, permitindo uma maior integração e automação do monitoramento dos ativos.

### **5. Gestão de Equipes e Permissões**
- Adicionar uma funcionalidade para gestão de equipes, onde diferentes níveis de acesso e permissões possam ser atribuídos aos usuários, permitindo que gestores tenham controle sobre suas equipes e o monitoramento das máquinas.

---

## **Deploy e Instruções para Uso**

### **1. Configuração Local**
- Clone o repositório:  
  `git clone https://github.com/douglas-pereira/dynamax`
  
- Instale as dependências:  
  `npm install`
  
- Configure o arquivo `.env` com suas variáveis de ambiente:
  ```bash
  MONGO_URI=<Sua URI MongoDB>
  JWT_SECRET=<Seu segredo JWT>
  REACT_APP_API_URL=<Sua URL local>
  PORT=5000
  ```

- Execute a aplicação:  
  `npx nx serve dynamax`.

### **2. Deploy no Heroku**
A aplicação foi implantada no Heroku e está acessível através do seguinte link:  
[**Dynamax Full Stack App**](https://dynamax-13e4b3075752.herokuapp.com/).

---

## **Testes e Qualidade**

### **Testes E2E com Cypress**
A aplicação foi testada utilizando o **Cypress** para garantir a integridade do fluxo de usuário, desde o login até o gerenciamento de sensores. Para executar os testes:
```bash
npx cypress open
```

### **Testes Unitários**
Pretendemos adicionar testes unitários usando **Jest** para garantir a robustez das funções críticas tanto no front-end quanto no back-end.

---

## **Conclusão**

O projeto Dynamax foi desenvolvido para proporcionar um gerenciamento eficiente de ativos monitorados. A aplicação é fácil de usar, com interfaces simples e intuitivas, e está preparada para futuras expansões. Cada funcionalidade foi cuidadosamente implementada, garantindo um sistema escalável e seguro.

Agradeço pela oportunidade de participar deste desafio e estou aberto para discutir melhorias e soluções técnicas.

---
