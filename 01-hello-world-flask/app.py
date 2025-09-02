from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/hello', methods=['POST'])
def hello():
    """
    Endpoint que recebe um JSON e o retorna
    """
    try:
        # Verifica se o request contém JSON válido
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        # Obtém o JSON do request
        data = request.get_json()
        
        # Retorna o mesmo JSON recebido
        return jsonify(data), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """
    Endpoint de health check
    """
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


