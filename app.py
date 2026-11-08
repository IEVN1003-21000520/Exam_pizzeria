from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def obtener_conexion():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="pizzeria"
    )

def recalcular_total(cursor, pedido_id):
    """Actualiza pedidos.total_pedido con la suma de los subtotales de detalle_pedidos."""
    cursor.execute(
        """
        UPDATE pedidos
        SET total_pedido = (
            SELECT COALESCE(SUM(subtotal), 0)
            FROM detalle_pedidos
            WHERE pedido_id = %s
        )
        WHERE pedido_id = %s
        """,
        (pedido_id, pedido_id)
    )

@app.route('/api/pedidos', methods=['GET'])
def obtener_pedidos():
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT pedido_id AS id, nombre_cliente, telefono, direccion, total_pedido FROM pedidos")
        pedidos = cursor.fetchall()
        
        for pedido in pedidos:
            cursor.execute(
                "SELECT tamano, ingredientes, num_pizza AS cantidad, subtotal FROM detalle_pedidos WHERE pedido_id = %s", 
                (pedido['id'],)
            )
            pedido['pizzas'] = cursor.fetchall()

        cursor.close()
        conexion.close()
        return jsonify(pedidos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos', methods=['POST'])
def crear_pedido():
    try:
        data = request.get_json()
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        cursor.execute(
            "INSERT INTO pedidos (nombre_cliente, direccion, telefono, fecha_pedido, total_pedido) VALUES (%s, %s, %s, NOW(), 0)",
            (data['nombre_cliente'], data['direccion'], data['telefono'])
        )
        pedido_id = cursor.lastrowid
        
        for pizza in data.get('pizzas', []):
            cursor.execute(
                "INSERT INTO detalle_pedidos (pedido_id, tamano, ingredientes, num_pizza, subtotal) VALUES (%s, %s, %s, %s, %s)",
                (pedido_id, pizza['tamano'], pizza['ingredientes'], pizza['cantidad'], pizza['subtotal'])
            )
        
        recalcular_total(cursor, pedido_id)
            
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({'mensaje': 'Pedido creado con éxito', 'id': pedido_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos/<int:id>', methods=['PUT'])
def actualizar_pedido(id):
    try:
        data = request.get_json()
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        cursor.execute(
            "UPDATE pedidos SET nombre_cliente = %s, direccion = %s, telefono = %s WHERE pedido_id = %s",
            (data['nombre_cliente'], data['direccion'], data['telefono'], id)
        )
        
        cursor.execute("DELETE FROM detalle_pedidos WHERE pedido_id = %s", (id,))
        
        for pizza in data.get('pizzas', []):
            cursor.execute(
                "INSERT INTO detalle_pedidos (pedido_id, tamano, ingredientes, num_pizza, subtotal) VALUES (%s, %s, %s, %s, %s)",
                (id, pizza['tamano'], pizza['ingredientes'], pizza['cantidad'], pizza['subtotal'])
            )
        
        recalcular_total(cursor, id)
            
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({'mensaje': 'Pedido actualizado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos/<int:id>', methods=['DELETE'])
def eliminar_pedido(id):
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM detalle_pedidos WHERE pedido_id = %s", (id,))
        cursor.execute("DELETE FROM pedidos WHERE pedido_id = %s", (id,))
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({'mensaje': 'Pedido eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)