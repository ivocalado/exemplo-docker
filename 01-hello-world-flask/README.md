# Flask Hello World Application

Uma aplicação Flask simples que expõe um endpoint `/hello` que recebe e retorna dados JSON.

## Funcionalidades

- **POST /hello**: Recebe um JSON no body da requisição e retorna o mesmo JSON
- **GET /health**: Endpoint de health check que retorna status da aplicação

## Estrutura do Projeto

```
.
├── app.py              # Aplicação Flask principal
├── requirements.txt    # Dependências Python
├── Dockerfile         # Configuração Docker
└── README.md          # Este arquivo
```

## Executando Localmente (sem Docker)

### Pré-requisitos
- Python 3.11 ou superior
- pip

### Passos

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Execute a aplicação:
```bash
python app.py
```

A aplicação estará disponível em `http://localhost:5000`

## Executando com Docker

### Pré-requisitos
- Docker instalado

### Passos para Build e Execução

1. **Build da imagem Docker:**
```bash
docker build -t flask-hello-app .
```

2. **Executar o container:**
```bash
docker run -p 5000:5000 flask-hello-app
```

A aplicação estará disponível em `http://localhost:5000`

### Executar em modo detached (background)
```bash
docker run -d -p 5000:5000 --name flask-hello flask-hello-app
```

### Parar o container
```bash
docker stop flask-hello
```

### Remover o container
```bash
docker rm flask-hello
```

## Testando a Aplicação

### Health Check
```bash
curl http://localhost:5000/health
```

### Endpoint Hello (enviando JSON)
```bash
curl -X POST http://localhost:5000/hello \
  -H "Content-Type: application/json" \
  -d '{"nome": "João", "idade": 30, "cidade": "São Paulo"}'
```

Exemplo de resposta:
```json
{
  "nome": "João",
  "idade": 30,
  "cidade": "São Paulo"
}
```

### Exemplo com dados mais complexos
```bash
curl -X POST http://localhost:5000/hello \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": {
      "id": 123,
      "nome": "Maria Silva",
      "email": "maria@email.com"
    },
    "dados": [1, 2, 3, 4, 5],
    "ativo": true
  }'
```

## Comandos Docker Úteis

### Ver logs do container
```bash
docker logs flask-hello
```

### Acessar shell do container
```bash
docker exec -it flask-hello /bin/bash
```

### Listar containers em execução
```bash
docker ps
```

### Listar imagens
```bash
docker images
```

### Remover imagem
```bash
docker rmi flask-hello-app
```
