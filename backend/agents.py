import os
from pathlib import Path
from agno.agent import Agent
from agno.models.ollama import Ollama
from pydantic import BaseModel, Field
from typing import List


# Schema Pydantic conforme solicitado
class AnamneseSchema(BaseModel):
    texto_melhorado: str = Field(..., description="O texto da anamnese corrigido com terminologia médica técnica.")
    cid_sugerido: str = Field(..., description="Apenas o código CID-10 (ex: J00, R51) ou código + nome curto (max 50 chars).")
    principais_sintomas: List[str] = Field(..., description="Lista dos principais sintomas identificados no texto.")


# Configuração da Knowledge Base (Leitura Singleton)
# Carrega o arquivo FAQ.MD na memória durante a inicialização do módulo
# Motivo: Para arquivos pequenos (<100KB), a injeção direta no contexto (Prompt) é
# ordens de grandeza mais rápida que RAG (Vector Search) e garante que o modelo
# tenha acesso integral aos protocolos críticos sem perda de informação.
BASE_DIR = Path(__file__).resolve().parent.parent
FAQ_PATH = BASE_DIR / "FAQ.MD"

knowledge_content = ""
if FAQ_PATH.exists():
    try:
        knowledge_content = FAQ_PATH.read_text(encoding="utf-8")
    except Exception as e:
        print(f"Erro ao ler KnowledgeBase: {e}")
else:
    print(f"Aviso: Arquivo de Knowledge Base não encontrado em {FAQ_PATH}")


def get_medical_agent():
    """
    Retorna uma instância configurada do Agente Agno.
    """
    instructions = [
        "ATENÇÃO: Você é um assistente JSON estrito. Responda APENAS no formato solicitado.",
        "Analise a anamnese e extraia os dados técnicos.",
        "CAMPO 'cid_sugerido': Retorne APENAS o código (ex: A09, J11). NÃO explique.",
        "CAMPO 'texto_melhorado': Reescreva usando termos médicos formais.",
        "CAMPO 'principais_sintomas': Liste apenas os sintomas chave.",
        "Use o FAQ.MD apenas para consulta de protocolos, não inclua o protocolo na resposta."
    ]

    # Injeta a Base de Conhecimento diretamente nas instruções (Context Injection)
    if knowledge_content:
        instructions.append(f"\n=== BASE DE CONHECIMENTO (FAQ.MD) ===\n{knowledge_content}\n=====================================")

    # Usando Ollama localmente (localhost:11434 por padrão no Agno)
    return Agent(
        model=Ollama(
            id="llama3.2",  # Retornando ao 3B pois o 1B alucina na estruturação do JSON
            options={
                "temperature": 0.0,  # Mais determinístico e rápido
                "num_ctx": 1024,     # Reduzido para 1024 para otimizar uso de memória e velocidade
                "num_predict": 512,  # Limita tokens de saída para evitar respostas longas
                "top_k": 20,         # Reduz espaço de busca
                "top_p": 0.9,
                "keep_alive": -1,    # Mantém o modelo carregado na memória indefinidamente (evita Cold Start)
            }
        ),
        description="Você é um Assistente Clínico Sênior experiente e meticuloso.",
        instructions=instructions,
        output_schema=AnamneseSchema,
        structured_outputs=True,  # Garante retorno estruturado
    )
