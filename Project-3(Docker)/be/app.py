# file: be/app.py

# Import necessary modules from the Flask framework
from flask import Flask, jsonify
from flask_cors import CORS

# Create a Flask web application instance
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the Flask app
CORS(app)

# Define a route '/api/data' that handles GET requests
@app.route('/api/data', methods=['GET'])
def get_data():
    # Sample data to be returned in the response
    data = [
        {'id': 1, 'name': 'Item name from be data 1'},
        {'id': 2, 'name': 'Item name from be data 2'},
        {'id': 3, 'name': 'Item name from be data 3'},
    ]
    # Convert the data to JSON format and return as a response
    return jsonify(data)

# Start the Flask application if this script is executed directly
if __name__ == '__main__':
    # Run the app in debug mode, allowing for automatic code reloading
    # Host the app on '0.0.0.0', making it accessible from any IP address
    # Set the port number to 8000
    app.run(debug=True, host='0.0.0.0', port=8000)
