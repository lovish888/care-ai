from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import requests
from user_agent import resolve_complaint
from blockchain import log_chat_to_blockchain
import uuid
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
STORAGE_API = "https://rpc-storage-testnet.0g.ai"

def store_chat(wallet, request_id, context, messages):
    metadata = {"wallet": wallet, "request_id": request_id, "context": context, "resolution": messages[-1]["content"]}
    requests.post(f"{STORAGE_API}/kv", json=metadata)
    requests.post(f"{STORAGE_API}/file", json={"request_id": request_id, "chat": messages})

# TODO: Update this logic to stream the outputs
def process_complaint(wallet, request_id, context, complaint):
    messages = resolve_complaint(context, complaint)
    for msg in messages:
        socketio.emit('chat_message', {"request_id": request_id, "message": msg["content"], "role": msg["role"]})
    store_chat(wallet, request_id, context, messages)
    log_chat_to_blockchain(f"{request_id}: {messages[-1]['content']}")

@app.route('/submit', methods=['POST'])
def submit_complaint():
    data = request.json
    wallet = data['wallet']
    context = data['context']
    complaint = data['complaint']
    request_id = str(uuid.uuid4())
    threading.Thread(target=process_complaint, args=(wallet, request_id, context, complaint)).start()
    return jsonify({"request_id": request_id})

@app.route('/history', methods=['GET'])
def get_history():
    wallet = request.args.get('wallet')
    response = requests.get(f"{STORAGE_API}/kv?wallet={wallet}").json()
    return jsonify(response)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)