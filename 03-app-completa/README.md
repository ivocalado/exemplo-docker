# Sistema de Cadastro de Pessoas

Este é um exemplo completo de aplicação dockerizada com frontend Next.js, backend Flask e banco de dados.

## Arquitetura

- **Frontend**: Aplicação Next.js com servidor que atua como proxy para a API
- **Backend**: API REST em Flask (Python) - apenas acesso interno
- **Banco de dados**: PostgreSQL - apenas acesso interno

## Estrutura do projeto

```
03-app-completa/
├── backend/
│   ├── app.py              # Aplicação Flask
│   ├── requirements.txt    # Dependências Python
│   └── Dockerfile         # Imagem Docker do backend
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx     # Layout principal
│   │       ├── page.tsx       # Página inicial
│   │       ├── cadastro/      # Página de cadastro
│   │       ├── listagem/      # Página de listagem
│   │       └── api/           # API routes do Next.js
│   ├── package.json       # Dependências do Next.js
│   └── Dockerfile         # Imagem Docker do frontend
└── docker-compose.yml     # Orquestração dos serviços
```

## Como executar

### Pré-requisitos
- Docker
- Docker Compose

### Executando a aplicação

1. **Clone ou navegue até o diretório do projeto**
   ```bash
   cd 03-app-completa
   ```

2. **Inicie todos os serviços**
   ```bash
   docker-compose up -d
   ```

3. **Verifique se os serviços estão rodando**
   ```bash
   docker-compose ps
   ```

4. **Acesse a aplicação**
   - Frontend Next.js: http://localhost:3000
   - Backend e PostgreSQL: apenas acesso interno (não expostos)

### Parando a aplicação

```bash
docker-compose down
```

Para remover também os volumes (dados do banco):
```bash
docker-compose down -v
```

## Endpoints da API (através do Next.js)

### Health Check
- **GET** `/api/health` - Verifica se o frontend e backend estão funcionando

### Pessoas
- **POST** `/api/person` - Cadastra uma nova pessoa
  ```json
  {
    "nome": "João Silva",
    "endereco": "Rua das Flores, 123 - São Paulo, SP"
  }
  ```

- **GET** `/api/person` - Lista todas as pessoas cadastradas

## Funcionalidades do Frontend

1. **Menu Principal** (`/`) - Navegação entre as funcionalidades
2. **Cadastro** (`/cadastro`) - Formulário para cadastrar novas pessoas
3. **Listagem** (`/listagem`) - Visualização de todas as pessoas cadastradas

## Tecnologias utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Flask, PostgreSQL, psycopg2, Flask-CORS
- **Infraestrutura**: Docker, Docker Compose
- **Banco de dados**: PostgreSQL 15

## Desenvolvimento

### Logs dos serviços
```bash
# Todos os serviços
docker-compose logs -f

# Apenas o backend
docker-compose logs -f backend

# Apenas o frontend
docker-compose logs -f frontend

# Apenas o banco
docker-compose logs -f postgres
```

### Reconstruir imagens
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Acessar container do banco
```bash
docker-compose exec postgres psql -U postgres -d pessoas_db
```

### Comandos úteis do PostgreSQL
```sql
-- Ver todas as tabelas
\dt

-- Ver estrutura da tabela pessoas
\d pessoas

-- Ver todas as pessoas
SELECT * FROM pessoas;

-- Limpar tabela
TRUNCATE pessoas;
```

## Troubleshooting

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs postgres`
- O backend aguarda o banco ficar disponível (healthcheck)

### Frontend não consegue acessar a API
- As API routes do Next.js fazem proxy para o backend interno
- Verifique os logs do frontend: `docker-compose logs frontend`
- Verifique os logs do backend: `docker-compose logs backend`

### Problemas de build do Next.js
- Limpe o cache: `docker-compose down && docker system prune -f`
- Reconstrua as imagens: `docker-compose build --no-cache`

### Problemas com permissões
No macOS/Linux, se houver problemas de permissão:
```bash
sudo chown -R $USER:$USER .
```

## Melhorias futuras

- [ ] Autenticação e autorização
- [ ] Validação mais robusta no frontend
- [ ] Paginação na listagem
- [ ] Busca e filtros
- [ ] Edição e exclusão de pessoas
- [ ] Backup automático do banco
- [ ] Monitoramento e métricas
- [ ] Testes automatizados
