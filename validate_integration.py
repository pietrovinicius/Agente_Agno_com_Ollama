
import requests
import json
import time

def validate_integration():
    url = "http://localhost:8000/api/processar-anamnese/"
    payload = {
        "texto": "Paciente relata dor de cabeca forte ha 3 dias, febre de 38 graus e dor no corpo. Nega alergias."
    }
    headers = {
        "Content-Type": "application/json"
    }

    print(f"Enviando requisição para {url}...")
    start_time = time.time()
    try:
        response = requests.post(url, json=payload, headers=headers)
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Tempo de resposta: {duration:.2f} segundos")
        
        if response.status_code == 200:
            data = response.json()
            print("\n--- Resposta da IA ---")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Validações básicas
            assert "texto_melhorado" in data, "Faltando campo 'texto_melhorado'"
            assert "cid_sugerido" in data, "Faltando campo 'cid_sugerido'"
            assert "principais_sintomas" in data, "Faltando campo 'principais_sintomas'"
            assert isinstance(data["principais_sintomas"], list), "'principais_sintomas' deve ser uma lista"
            
            print("\n✅ Validação de Integração: SUCESSO!")
        else:
            print(f"\n❌ Erro na requisição: {response.text}")

    except Exception as e:
        print(f"\n❌ Exceção ocorrida: {str(e)}")

if __name__ == "__main__":
    validate_integration()
