import os
from pathlib import Path
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.knowledge import Knowledge
from agno.vectordb.lancedb import LanceDb
from agno.knowledge.embedder.ollama import OllamaEmbedder
from pydantic import BaseModel, Field
from typing import List
from django.conf import settings

# Schema Pydantic conforme solicitado
class AnamneseSchema(BaseModel):
    texto_melhorado: str = Field(..., description="O texto da anamnese corrigido com terminologia médica técnica.")
    cid_sugerido: str = Field(..., description="Apenas o código CID-10 (ex: J00, R51) ou código + nome curto (max 50 chars).")
    principais_sintomas: List[str] = Field(..., description="Lista dos principais sintomas identificados no texto.")


def get_medical_agent():
    """
    Retorna uma instância configurada do Agente Agno com RAG (LanceDB).
    """
    # Using home directory to avoid 'Operation not supported' on external drives
    db_path = Path.home() / ".medical_lancedb"
    
    # Configuração da Knowledge Base (RAG)
    vector_db = LanceDb(
        table_name="medical_knowledge",
        uri=str(db_path),
        embedder=OllamaEmbedder(id="nomic-embed-text", dimensions=768),
    )
    
    knowledge_base = Knowledge(
        vector_db=vector_db,
    )

    # Carregar lista de palavras proibidas
    # Define base_dir correctly
    base_dir = Path(settings.BASE_DIR)

    # Carregar lista de palavras proibidas
    try:
        blocklist_path = base_dir.parent / "PALAVROES.MD"
        with open(blocklist_path, "r", encoding="utf-8") as f:
            blocklist = [line.strip() for line in f if line.strip()]
        blocklist_str = ", ".join(blocklist)
    except Exception as e:
        print(f"Erro ao carregar blocklist: {e}")
        blocklist_str = ""

    instructions = [
        "ATENÇÃO: Você é um assistente JSON estrito. Responda APENAS no formato solicitado.",
        "Analise a anamnese e utilize a 'knowledge_base' para encontrar códigos CID-10 e protocolos.",
        "CAMPO 'cid_sugerido': Retorne o código encontrado na base de conhecimento mais adequado.",
        "CAMPO 'texto_melhorado': Reescreva usando termos médicos formais. ATENÇÃO À ACENTUAÇÃO: Garanta que palavras como 'região', 'coração', 'pulmão' tenham o til (~) correto e não 'óo'.",
        "CAMPO 'principais_sintomas': Liste apenas os sintomas chave.",
        "---------------------------------------------------",
        "FILTRO DE CONTEÚDO OBRIGATÓRIO (CRÍTICO):",
        f"Verifique se o texto original contém qualquer uma destas palavras proibidas: [{blocklist_str}].",
        "SE ENCONTRAR QUALQUER UMA DESSAS PALAVRAS, VOCÊ DEVE SUBSTITUÍ-LA IMEDIATAMENTE POR UM TERMO TÉCNICO.",
        "Exemplos de substituição obrigatória:",
        "- 'pénis' ou 'pênis' -> 'região genital' ou 'órgão genital masculino'",
        "- 'xoxota' -> 'região genital feminina'",
        "- 'bosta' -> 'fezes'",
        "JAMAIS repita a palavra proibida no JSON final.",
        "---------------------------------------------------",
    ]

    return Agent(
        model=Ollama(
            id="llama3.2",
            options={
                "temperature": 0.0,
                "num_ctx": 2048,     # Aumentado para acomodar contexto do RAG
                "num_predict": 512,
                "top_k": 20,
                "top_p": 0.9,
                "keep_alive": -1,
            }
        ),
        description="Você é um Assistente Clínico Sênior experiente e meticuloso.",
        instructions=instructions,
        knowledge=knowledge_base,
        search_knowledge=True, # Enable explicit search
        output_schema=AnamneseSchema,
        structured_outputs=True,
    )
