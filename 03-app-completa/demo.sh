#!/bin/bash

# Script de demonstração da aplicação Sistema de Pessoas

echo "======================================"
echo "  Sistema de Pessoas - Demonstração"
echo "======================================"

echo ""
echo "📍 URLs da aplicação:"
echo "   Frontend Next.js: http://localhost:3000"
echo "   Backend e PostgreSQL: acesso apenas interno"
echo ""

echo "🔍 Testando health check da aplicação..."
curl -s http://localhost:3000/api/health | jq '.'

echo ""
echo "📝 Cadastrando uma pessoa de exemplo..."
curl -s -X POST http://localhost:3000/api/person \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria Santos", "endereco": "Av. Paulista, 1000 - São Paulo, SP"}' | jq '.'

echo ""
echo "📋 Listando todas as pessoas cadastradas..."
curl -s http://localhost:3000/api/person | jq '.'

echo ""
echo "✅ Demonstração concluída!"
echo ""
echo "🌐 Acesse http://localhost:3000 no seu navegador para usar a interface web"
echo ""
echo "📖 Para mais comandos, consulte o README.md ou use:"
echo "   ./manage.sh help"
