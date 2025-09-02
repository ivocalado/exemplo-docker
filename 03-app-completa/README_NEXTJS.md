# Aplicação Completa com Docker - Next.js + Flask + PostgreSQL

Este projeto demonstra uma aplicação completa dockerizada usando **Next.js** como frontend com servidor, **Flask** como API backend, e **PostgreSQL** como banco de dados.

## Arquitetura da Aplicação

### 🏗️ Visão Geral
```
[Frontend Next.js] ➜ [API Routes] ➜ [Backend Flask] ➜ [PostgreSQL]
     (Porta 3000)         (Proxy)        (Interno)      (Interno)
```

### 🔒 Segurança e Isolamento
- **Frontend Next.js**: Única aplicação exposta externamente (porta 3000)
- **Backend Flask**: Acesso interno apenas, através do proxy do Next.js
- **PostgreSQL**: Completamente isolado, sem acesso externo
- **Rede Docker**: Comunicação interna via rede `app-network`

## Tecnologias Utilizadas

### Frontend (Next.js 14)
- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilo**: CSS Global
- **Funcionalidades**:
  - Servidor Next.js com API Routes para proxy
  - Interface reativa para cadastro e listagem de pessoas
  - Comunicação com backend via API routes internas

### Backend (Flask)
- **Framework**: Flask (Python)
- **ORM**: SQLAlchemy
- **Banco**: PostgreSQL
- **Funcionalidades**:
  - API REST para CRUD de pessoas
  - Endpoint de health check
  - Migração automática do banco de dados

### Banco de Dados
- **SGBD**: PostgreSQL 15
- **Persistência**: Volume Docker para dados
- **Health Check**: Verificação automática de saúde

## Estrutura do Projeto

```
03-app-completa/
├── frontend/                    # Aplicação Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/            # API Routes (proxy)
│   │   │   │   ├── health/     # Health check
│   │   │   │   └── person/     # CRUD de pessoas
│   │   │   ├── cadastro/       # Página de cadastro
│   │   │   ├── listagem/       # Página de listagem
│   │   │   ├── layout.tsx      # Layout principal
│   │   │   ├── page.tsx        # Página inicial
│   │   │   └── globals.css     # Estilos globais
│   │   └── ...
│   ├── package.json            # Dependências Next.js
│   ├── next.config.js          # Configuração Next.js
│   ├── tsconfig.json           # Configuração TypeScript
│   └── Dockerfile              # Multi-stage build
├── backend/                     # API Flask
│   ├── app.py                  # Aplicação principal
│   ├── requirements.txt        # Dependências Python
│   └── Dockerfile              # Imagem backend
├── docker-compose.yml           # Orquestração dos serviços
├── demo.sh                     # Script de demonstração
└── README.md                   # Este arquivo
```

## Como Executar

### 1. Construir e Iniciar
```bash
# Construir todas as imagens
docker-compose build

# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

### 2. Acessar a Aplicação
- **Frontend**: http://localhost:3000
- **Cadastro**: http://localhost:3000/cadastro  
- **Listagem**: http://localhost:3000/listagem
- **Health Check**: http://localhost:3000/api/health

### 3. Parar a Aplicação
```bash
docker-compose down
```

## Endpoints da API (via Next.js)

### Health Check
```bash
GET /api/health
# Resposta: {"status":"OK","message":"Frontend funcionando!","backend":{...}}
```

### Pessoas
```bash
# Listar pessoas
GET /api/person

# Cadastrar pessoa
POST /api/person
Content-Type: application/json
{
  "nome": "João Silva",
  "email": "joao@example.com", 
  "endereco": "Rua A, 123",
  "idade": 30
}
```

## Recursos da Aplicação

### 🎯 Funcionalidades
- ✅ Cadastro de pessoas com validação
- ✅ Listagem de pessoas cadastradas
- ✅ Interface responsiva e moderna
- ✅ API proxy segura (sem exposição do backend)
- ✅ Persistência de dados no PostgreSQL
- ✅ Health checks automáticos

### 🛡️ Segurança
- ✅ Backend e banco isolados (sem acesso externo)
- ✅ Comunicação interna via rede Docker
- ✅ Proxy de API através do Next.js
- ✅ Validação de dados no frontend e backend

### 🚀 Performance
- ✅ Build otimizado do Next.js (standalone)
- ✅ Multi-stage Docker builds
- ✅ Imagens Alpine Linux (menor tamanho)
- ✅ Cache de dependências

## Diferenças da Arquitetura Anterior

### Antes (HTML + React + API Exposta)
```
[HTML/CSS/JS] ➜ [API Flask:5000] ➜ [PostgreSQL:5432]
   (Nginx:3000)      (Exposta)         (Exposta)
```

### Agora (Next.js + Proxy + Isolamento)
```
[Next.js:3000] ➜ [API Routes] ➜ [Flask:interno] ➜ [PostgreSQL:interno]
   (Exposta)         (Proxy)        (Isolada)       (Isolada)
```

### Vantagens da Nova Arquitetura
1. **Segurança**: Backend e banco não são expostos externamente
2. **Simplicidade**: Uma única porta exposta (3000)
3. **Modernidade**: Next.js 14 com App Router e TypeScript
4. **Proxy Inteligente**: API routes fazem proxy para o backend
5. **Isolamento**: Comunicação interna via rede Docker

## Logs e Monitoramento

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs específicos
docker-compose logs frontend
docker-compose logs backend  
docker-compose logs postgres

# Verificar saúde dos containers
docker-compose ps
```

## Desenvolvimento

Para desenvolvimento local:

```bash
# Frontend (Next.js)
cd frontend
npm install
npm run dev

# Backend (Flask)
cd backend
pip install -r requirements.txt
python app.py
```

## Demonstração

Execute o script de demonstração:

```bash
./demo.sh
```

Este script irá:
1. Construir as imagens Docker
2. Iniciar todos os serviços
3. Aguardar a inicialização
4. Testar os endpoints
5. Exibir informações da aplicação

## Testes de Funcionamento

A aplicação foi testada e está funcionando corretamente:

```bash
# ✅ Health check funcionando
curl http://localhost:3000/api/health

# ✅ Cadastro de pessoa funcionando  
curl -X POST -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@example.com","endereco":"Rua A, 123","idade":30}' \
  http://localhost:3000/api/person

# ✅ Listagem funcionando
curl http://localhost:3000/api/person
```

---

**Status**: ✅ **Aplicação funcionando perfeitamente!**

- Frontend Next.js: ✅ Rodando na porta 3000
- Backend Flask: ✅ Acesso interno apenas  
- PostgreSQL: ✅ Dados persistindo
- API Proxy: ✅ Funcionando corretamente
- Interface Web: ✅ Todas as páginas operacionais
