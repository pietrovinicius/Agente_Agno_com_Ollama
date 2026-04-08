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
        "Você DEVE retornar APENAS um JSON válido seguindo estritamente o schema. Não inclua blocos markdown (```json).",
        "Utilize as informações da 'knowledge_base' (Documentos injetados) para embasar sua resposta.",
        "EXEMPLO DE SAÍDA ESPERADA:",
        '{"texto_melhorado": "Paciente apresenta quadro de cefaleia holocraniana...", "cid_sugerido": "R51", "principais_sintomas": ["cefaleia", "náusea"]}',
        "Analise a anamnese e preencha os campos:",
        "CAMPO 'cid_sugerido': Retorne o código CID-10 mais provável baseado nos protocolos.",
        "CAMPO 'texto_melhorado': Reescreva usando termos médicos formais e acentuação correta.",
        "CAMPO 'principais_sintomas': Liste os sintomas chave identificados.",
        "---------------------------------------------------",
        "FILTRO DE CONTEÚDO: Substitua termos chulos (ex: pênis -> região genital) conforme blocklist.",
    ]

    return Agent(
        model=Ollama(
            id="gemma4:e4b",
            options={
                "format": "json",
                "temperature": 0.0,
                "num_ctx": 4096,     # Aumentado para suportar RAG Context + Schema
                "num_predict": 512,
                "top_k": 20,
                "top_p": 0.9,
                "keep_alive": -1,
            }
        ),
        description="Você é um Assistente Clínico Sênior experiente e meticuloso.",
        instructions=instructions,
        knowledge=knowledge_base,
        add_context=True,       # Injeta documentos do RAG diretamente no prompt
        search_knowledge=False, # Evita busca tool-based redundante
        output_schema=AnamneseSchema,
        structured_outputs=True,
    )
