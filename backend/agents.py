from agno.agent import Agent
from agno.models.ollama import Ollama
from pydantic import BaseModel, Field
from typing import List


# Schema Pydantic conforme solicitado
class AnamneseSchema(BaseModel):
    texto_melhorado: str = Field(..., description="O texto da anamnese corrigido com terminologia médica técnica.")
    cid_sugerido: str = Field(..., description="Apenas o código CID-10 (ex: J00, R51) ou código + nome curto (max 50 chars).")
    principais_sintomas: List[str] = Field(..., description="Lista dos principais sintomas identificados no texto.")


def get_medical_agent():
    """
    Retorna uma instância configurada do Agente Agno.
    """
    # Usando Ollama localmente (localhost:11434 por padrão no Agno)
    return Agent(
        model=Ollama(
            id="llama3.2",
            options={
                "temperature": 0.0,  # Mais determinístico e rápido
                "num_ctx": 2048,     # Contexto menor consome menos RAM/CPU
                "num_predict": 512,  # Limita tokens de saída para evitar respostas longas
                "top_k": 20,         # Reduz espaço de busca
                "top_p": 0.9,
            }
        ),
        description="Você é um Assistente Clínico Sênior experiente e meticuloso.",
        instructions=[
            "Analise o texto bruto da anamnese fornecido.",
            "Reescreva o texto utilizando terminologia médica técnica padrão, "
            "mantendo o sentido original mas com maior formalidade e precisão.",
            "Identifique o código CID-10 mais apropriado para o caso descrito.",
            "Extraia os principais sintomas em uma lista clara.",
            "Não invente informações que não estejam no texto, apenas interprete e formalize."
        ],
        output_schema=AnamneseSchema,
        structured_outputs=True,  # Garante retorno estruturado
    )
