from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from psycopg2.extras import RealDictCursor
import json

app = Flask(__name__)
CORS(app)  # Permite requests do frontend

# Configuração do banco de dados
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'postgres'),
    'database': os.getenv('DB_NAME', 'pessoas_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres123'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_db_connection():
    """Cria conexão com o banco de dados"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

def init_db():
    """Inicializa o banco de dados criando a tabela pessoas"""
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('''
                CREATE TABLE IF NOT EXISTS pessoas (
                    id SERIAL PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    endereco VARCHAR(200) NOT NULL,
                    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()
            cur.close()
            print("Tabela 'pessoas' criada com sucesso!")
        except Exception as e:
            print(f"Erro ao criar tabela: {e}")
        finally:
            conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return jsonify({'status': 'OK', 'message': 'API funcionando!'})

@app.route('/api/person', methods=['POST'])
def create_person():
    """Endpoint para criar uma nova pessoa"""
    try:
        data = request.get_json()
        
        # Validação dos dados
        if not data or 'nome' not in data or 'endereco' not in data:
            return jsonify({'error': 'Nome e endereço são obrigatórios'}), 400
        
        nome = data['nome'].strip()
        endereco = data['endereco'].strip()
        
        if not nome or not endereco:
            return jsonify({'error': 'Nome e endereço não podem estar vazios'}), 400
        
        # Inserir no banco de dados
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erro de conexão com o banco'}), 500
        
        try:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO pessoas (nome, endereco) VALUES (%s, %s) RETURNING id",
                (nome, endereco)
            )
            person_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            
            return jsonify({
                'message': 'Pessoa criada com sucesso!',
                'id': person_id,
                'nome': nome,
                'endereco': endereco
            }), 201
            
        except Exception as e:
            conn.rollback()
            return jsonify({'error': f'Erro ao salvar pessoa: {str(e)}'}), 500
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/api/person', methods=['GET'])
def list_persons():
    """Endpoint para listar todas as pessoas"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Erro de conexão com o banco'}), 500
        
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT id, nome, endereco, data_criacao FROM pessoas ORDER BY data_criacao DESC")
            pessoas = cur.fetchall()
            cur.close()
            
            # Converter para lista de dicionários
            pessoas_list = []
            for pessoa in pessoas:
                pessoas_list.append({
                    'id': pessoa['id'],
                    'nome': pessoa['nome'],
                    'endereco': pessoa['endereco'],
                    'data_criacao': pessoa['data_criacao'].isoformat() if pessoa['data_criacao'] else None
                })
            
            return jsonify({
                'pessoas': pessoas_list,
                'total': len(pessoas_list)
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Erro ao buscar pessoas: {str(e)}'}), 500
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    print("Inicializando aplicação Flask...")
    print("Tentando conectar ao banco de dados...")
    
    # Tentar inicializar o banco algumas vezes (aguardar PostgreSQL subir)
    import time
    max_retries = 30
    for i in range(max_retries):
        try:
            init_db()
            break
        except Exception as e:
            if i < max_retries - 1:
                print(f"Tentativa {i+1} falhou, tentando novamente em 2 segundos...")
                time.sleep(2)
            else:
                print(f"Não foi possível conectar ao banco após {max_retries} tentativas")
                exit(1)
    
    print("Iniciando servidor Flask na porta 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
