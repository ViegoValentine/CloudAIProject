from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

API_KEY = "5Y4XVt8RxYJ8B1Fh2jUgvbfzSP9GMy8x2vigQozOrgYaClqlhfqkJQQJ99BAACHYHv6XJ3w3AAABACOG6K0w"
ENDPOINT = "https://cloudaiforproject.openai.azure.com/openai/deployments/gpt-4-CloudAIProject/chat/completions?api-version=2024-08-01-preview"

# Funkcja do wysy³ania zapytania
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

    # Wykonanie ¿¹dania
    try:
        response = requests.post(ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
    except requests.RequestException as e:
        return None, f"Nie udalo sie nawiazac polaczenia: {e}"

    # Obs³uga odpowiedzi
    try:
        response_data = response.json()
        if "choices" in response_data and len(response_data["choices"]) > 0:
            return response_data["choices"][0]["message"]["content"], None
        else:
            return "Brak odpowiedzi od modelu.", None
    except json.JSONDecodeError:
        return "Nie udalo sie przetworzyc odpowiedzi serwera.", None

# Endpoint dla zapytañ
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

# Uruchomienie serwera
if __name__ == "__main__":
    app.run(port=5000)
