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

    instructions = [
        "ATENÇÃO: Você é um assistente JSON estrito. Responda APENAS no formato solicitado.",
        "Analise a anamnese e utilize a 'knowledge_base' para encontrar códigos CID-10 e protocolos.",
        "CAMPO 'cid_sugerido': Retorne o código encontrado na base de conhecimento mais adequado.",
        "CAMPO 'texto_melhorado': Reescreva usando termos médicos formais.",
        "CAMPO 'principais_sintomas': Liste apenas os sintomas chave.",
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
