import time
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent / "backend"))

from agents import get_medical_agent

def test_performance():
    print("Iniciando teste de performance do Agente Clínico...")
    agent = get_medical_agent()
    
    anamnese_texto = "Paciente com suspeita de sepse, pressão baixa e febre."
    
    start_time = time.time()
    response = agent.run(anamnese_texto)
    end_time = time.time()
    
    duration = end_time - start_time
    print(f"\nTempo de inferência: {duration:.2f} segundos")
    print(f"Resposta (Resumo): {response.content.texto_melhorado[:100]}...")
    
    if duration > 15:
        print("ALERTA: Tempo de resposta acima de 15s!")
    else:
        print("SUCESSO: Tempo de resposta aceitável.")

if __name__ == "__main__":
    test_performance()
