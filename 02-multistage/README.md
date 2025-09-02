# Hello World Go - Multi-stage Docker Build

Este projeto demonstra o uso de multi-stage builds no Docker com uma aplicação Go simples que imprime "Hello World".

## Estrutura do Projeto

```
.
├── main.go       # Aplicação Go principal
├── go.mod        # Arquivo de módulo Go
├── Dockerfile    # Multi-stage Dockerfile
├── build.sh      # Script para build das imagens
└── README.md     # Este arquivo
```

## Multi-stage Build

O Dockerfile possui 3 estágios:

### Stage 1: Builder (golang:1.21-alpine)
- Compila a aplicação Go
- Gera um binário estático
- Não é incluído na imagem final

### Stage 2: Runtime Alpine (alpine:latest)
- Imagem final usando Alpine Linux
- Inclui shell e utilitários básicos
- Maior em tamanho, mas mais flexível para debug
- Usuário não-root para segurança

### Stage 3: Runtime Distroless (gcr.io/distroless/static:nonroot)
- Imagem final usando Google Distroless
- Apenas o binário e dependências mínimas
- Menor superfície de ataque
- Menor tamanho da imagem

## Como usar

### 1. Build das imagens

Execute o script de build:
```bash
./build.sh
```

Ou build manualmente:

**Versão Alpine:**
```bash
docker build --target runtime-alpine -t hello-world:alpine .
```

**Versão Distroless:**
```bash
docker build --target runtime-distroless -t hello-world:distroless .
```

### 2. Executar as aplicações

**Versão Alpine:**
```bash
docker run --rm hello-world:alpine
```

**Versão Distroless:**
```bash
docker run --rm hello-world:distroless
```

### 3. Comparar tamanhos das imagens

```bash
docker images | grep hello-world
```

## Vantagens de cada abordagem

### Alpine
- ✅ Inclui shell para debug
- ✅ Pacotes adicionais disponíveis
- ✅ Mais familiar para desenvolvimento
- ❌ Maior tamanho da imagem
- ❌ Maior superfície de ataque

### Distroless
- ✅ Menor tamanho da imagem
- ✅ Menor superfície de ataque
- ✅ Melhor para produção
- ❌ Sem shell para debug
- ❌ Limitado para troubleshooting

## Segurança

Ambas as imagens são configuradas para:
- Executar com usuário não-root
- Usar binário estático (sem dependências dinâmicas)
- Minimizar privilégios
