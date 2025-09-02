#!/bin/bash

# Script para gerenciar a aplicação Sistema de Pessoas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções utilitárias
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker e Docker Compose estão instalados
check_requirements() {
    print_info "Verificando pré-requisitos..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
    
    print_success "Pré-requisitos verificados!"
}

# Iniciar aplicação
start_app() {
    print_info "Iniciando aplicação Sistema de Pessoas..."
    
    # Build e start
    docker-compose up -d --build
    
    print_info "Aguardando serviços ficarem prontos..."
    sleep 10
    
    # Verificar status
    if docker-compose ps | grep -q "Up"; then
        print_success "Aplicação iniciada com sucesso!"
        print_info "Frontend: http://localhost:8080"
        print_info "Backend API: http://localhost:5000"
        print_info "PostgreSQL: localhost:5432"
    else
        print_error "Falha ao iniciar alguns serviços. Verifique os logs."
        docker-compose logs
    fi
}

# Parar aplicação
stop_app() {
    print_info "Parando aplicação..."
    docker-compose down
    print_success "Aplicação parada!"
}

# Parar e remover volumes
clean_app() {
    print_warning "Isso irá parar a aplicação e remover TODOS os dados do banco!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Parando e limpando aplicação..."
        docker-compose down -v
        docker system prune -f
        print_success "Aplicação limpa!"
    else
        print_info "Operação cancelada."
    fi
}

# Ver logs
show_logs() {
    if [ -z "$1" ]; then
        print_info "Mostrando logs de todos os serviços..."
        docker-compose logs -f
    else
        print_info "Mostrando logs do serviço: $1"
        docker-compose logs -f "$1"
    fi
}

# Status dos serviços
show_status() {
    print_info "Status dos serviços:"
    docker-compose ps
}

# Reconstruir imagens
rebuild_app() {
    print_info "Reconstruindo aplicação..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Aplicação reconstruída!"
}

# Acessar banco de dados
access_db() {
    print_info "Conectando ao banco de dados PostgreSQL..."
    docker-compose exec postgres psql -U postgres -d pessoas_db
}

# Mostrar help
show_help() {
    echo "Sistema de Pessoas - Script de Gerenciamento"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Iniciar a aplicação"
    echo "  stop      - Parar a aplicação"
    echo "  restart   - Reiniciar a aplicação"
    echo "  clean     - Parar e remover todos os dados"
    echo "  rebuild   - Reconstruir imagens e reiniciar"
    echo "  logs      - Mostrar logs (opcionalmente de um serviço específico)"
    echo "  status    - Mostrar status dos serviços"
    echo "  db        - Acessar banco de dados PostgreSQL"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 logs frontend"
    echo "  $0 db"
}

# Main
case "${1:-help}" in
    "start")
        check_requirements
        start_app
        ;;
    "stop")
        stop_app
        ;;
    "restart")
        stop_app
        sleep 2
        start_app
        ;;
    "clean")
        clean_app
        ;;
    "rebuild")
        check_requirements
        rebuild_app
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "db")
        access_db
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Comando inválido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
