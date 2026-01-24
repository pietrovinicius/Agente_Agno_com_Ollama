import requests
import time
import sys

def preload():
    print("--- Pré-carregando Modelo Llama 3.2 (3B) ---")
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3.2",
        "prompt": "ping",
        "keep_alive": -1, # Garante que fique na memória
        "stream": False
    }
    
    try:
        start = time.time()
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"Sucesso! Modelo carregado em {time.time() - start:.2f}s")
            return True
        else:
            print(f"Falha: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Erro ao conectar com Ollama: {e}")
        return False

if __name__ == "__main__":
    success = preload()
    sys.exit(0 if success else 1)
