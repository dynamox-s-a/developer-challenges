# Imagem oficial do Playwright que já contém Node.js e todos os browsers/dependências de SO
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de definição de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto (respeitando o .dockerignore)
COPY . .

# Comando padrão para executar os testes
# Usamos o --reporter=html para garantir que o report seja gerado
CMD ["npx", "playwright", "test"]