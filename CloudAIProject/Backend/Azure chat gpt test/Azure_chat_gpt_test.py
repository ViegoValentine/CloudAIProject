from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

API_KEY = "8dHpYueeV5M9ZdKwJTvP1GaBDWpfgr9rXOMLT62I7FuiaiNG5CiGJQQJ99BAACfhMk5XJ3w3AAAAACOGVfoR"
ENDPOINT = "https://hb305-m62kb3mt-swedencentral.cognitiveservices.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-08-01-preview"

def get_ai_response(user_message):
    headers = {
        "Content-Type": "application/json",
        "api-key": API_KEY,
    }
    
    payload = {
        "messages": [
            {
                "role": "system",
                "content": "Jestes asystentem AI, ktory ulatwia uzytkownikom znajdowanie informacji."
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 800
    }

    try:
        response = requests.post(ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
    except requests.RequestException as e:
        return None, f"Nie udalo sie nawiazac polaczenia: {e}"

    try:
        response_data = response.json()
        if "choices" in response_data and len(response_data["choices"]) > 0:
            return response_data["choices"][0]["message"]["content"], None
        else:
            return "Brak odpowiedzi od modelu.", None
    except json.JSONDecodeError:
        return "Nie udalo sie przetworzyc odpowiedzi serwera.", None

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        return jsonify({"error": "Brak wiadomosci."}), 400

    ai_response, error = get_ai_response(user_message)
    if error:
        return jsonify({"error": error}), 500

    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(port=5000)
