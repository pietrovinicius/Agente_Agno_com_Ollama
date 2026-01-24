import time
import requests
import json
from pathlib import Path

# Configurações
API_URL = "http://localhost:8000/api/processar-anamnese/"
FAQ_PATH = Path("FAQ.MD")
TEXTO_TESTE = "Paciente com suspeita de sepse, pressão 9 por 5, temperatura 40º"

def ler_faq():
    if FAQ_PATH.exists():
        return FAQ_PATH.read_text(encoding="utf-8")
    return ""

def testar_inferencia(nome_teste, usar_faq=True):
    print(f"\n--- Iniciando teste: {nome_teste} ---")
    payload = {"texto": TEXTO_TESTE}
    
    # Se quiséssemos testar sem FAQ, teríamos que alterar o backend ou mockar.
    # Como o backend lê o arquivo FAQ.MD, podemos renomeá-lo temporariamente para simular ausência.
    
    if not usar_faq:
        if FAQ_PATH.exists():
            FAQ_PATH.rename("FAQ.MD.bak")
            print("FAQ.MD desabilitado temporariamente.")
    
    try:
        inicio = time.time()
        response = requests.post(API_URL, json=payload)
        fim = time.time()
        
        duracao = fim - inicio
        status = response.status_code
        
        if status == 200:
            dados = response.json()
            print(f"Status: {status}")
            print(f"Duração: {duracao:.2f} segundos")
            print(f"CID Sugerido: {dados.get('cid_sugerido')}")
            # print(f"Texto Melhorado: {dados.get('texto_melhorado')[:50]}...")
        else:
            print(f"Erro: {status} - {response.text}")
            
    except Exception as e:
        print(f"Exceção durante teste: {e}")
        
    finally:
        # Restaurar FAQ se foi movido
        if not usar_faq and Path("FAQ.MD.bak").exists():
            Path("FAQ.MD.bak").rename("FAQ.MD")
            print("FAQ.MD restaurado.")

if __name__ == "__main__":
    print("=== Diagnóstico de Latência do MedAssist AI ===")
    
    # 1. Teste de Cold Start (assumindo que o modelo pode estar descarregado ou será a primeira req)
    testar_inferencia("1. Primeira Chamada (Potencial Cold Start)", usar_faq=True)
    
    # 2. Teste de Warm Start (modelo já deve estar na memória)
    testar_inferencia("2. Segunda Chamada (Warm Start)", usar_faq=True)
    
    # 3. Teste Sem FAQ (para medir impacto do Context Injection)
    testar_inferencia("3. Chamada Sem FAQ.MD", usar_faq=False)
