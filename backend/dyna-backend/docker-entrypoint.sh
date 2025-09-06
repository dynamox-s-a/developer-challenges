#!/bin/sh

echo "🚀 Iniciando aplicação Dyna Backend..."


echo "⏳ Aguardando PostgreSQL..."
until nc -z postgres 5432; do
  echo "PostgreSQL ainda não está pronto. Aguardando..."
  sleep 2
done
echo "✅ PostgreSQL está pronto!"


sleep 5


echo "🔍 Verificando estado das migrações..."
MIGRATION_STATUS=$(npx prisma migrate status 2>&1)
echo "$MIGRATION_STATUS"


if echo "$MIGRATION_STATUS" | grep -q "failed\|P3009\|P3005"; then
    echo "⚠️  Detectadas migrações com falha. Resetando banco de dados..."
    if ! npx prisma migrate reset --force; then
        echo "❌ Erro ao resetar banco!"
        exit 1
    fi
    echo "✅ Banco resetado com sucesso!"
else
    
    echo "🔄 Aplicando migrações..."
    if ! npx prisma migrate deploy; then
        echo "⚠️  Falha ao aplicar migrações. Tentando reset..."
        if ! npx prisma migrate reset --force; then
            echo "❌ Erro ao resetar banco!"
            exit 1
        fi
        echo "✅ Banco resetado com sucesso!"
    fi
fi


echo "✅ Verificando status final das migrações..."
npx prisma migrate status


echo "🌱 Executando seed do Prisma..."
if ! npm run seed; then
    echo "❌ Erro ao executar seed!"
    exit 1
fi

echo "✅ Seed executado com sucesso!"


echo "🚀 Iniciando aplicação..."
npm run start