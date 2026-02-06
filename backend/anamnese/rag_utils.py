import os
import logging
import time
from typing import Dict, Any, Optional

from agno.knowledge import Knowledge
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.knowledge.embedder.ollama import OllamaEmbedder
from agno.knowledge.document import Document

logger = logging.getLogger(__name__)

def get_vector_db() -> Knowledge:
    """
    Retorna uma instância configurada da Knowledge Base (Agno).
    Deve corresponder à configuração usada em agents.py.
    """
    # Using home directory
    db_path = os.path.expanduser("~/.medical_lancedb")
    
    return Knowledge(
        vector_db=LanceDb(
            table_name="medical_knowledge",
            uri=db_path,
            search_type=SearchType.vector,
            embedder=OllamaEmbedder(id="nomic-embed-text", dimensions=768),
        ),
        # Não precisamos re-carregar leitores aqui
    )

def format_anamnese_for_rag(anamnese_data: Dict[str, Any]) -> str:
    """
    Formata os dados da anamnese em um texto estruturado para o vetor DB.
    """
    cid = anamnese_data.get('cid_sugerido', 'N/A')
    texto_original = anamnese_data.get('queixa_original', '')
    texto_melhorado = anamnese_data.get('texto_melhorado', '')
    sintomas = ", ".join(anamnese_data.get('principais_sintomas', []))
    
    content = f"""
CASE STUDY: {cid}
---
SINTOMAS: {sintomas}
QUEIXA ORIGINAL:
{texto_original}

DIAGNÓSTICO VALIDADO E TEXTO CLÍNICO:
{texto_melhorado}
---
    """.strip()
    return content

def ingest_anamnese(anamnese_obj) -> bool:
    """
    Ingere uma anamnese recém-salva no banco vetorial.
    Recebe um objeto Anamnese (Django Model) ou dict compatível.
    """
    try:
        start_time = time.time()
        logger.info(f"Iniciando ingestão vetorial para Anamnese ID: {getattr(anamnese_obj, 'id', 'N/A')}")

        # Extrair dados.
        if hasattr(anamnese_obj, 'conteudo_processado') and anamnese_obj.conteudo_processado:
            processed_data = anamnese_obj.conteudo_processado
        else:
            logger.warning("Anamnese sem conteudo_processado. Pulando ingestão.")
            return False

        # Prepara o conteúdo
        rag_content = format_anamnese_for_rag({
            'cid_sugerido': processed_data.get('cid_sugerido'),
            'principais_sintomas': processed_data.get('principais_sintomas'),
            'texto_melhorado': processed_data.get('texto_melhorado'),
            'queixa_original': getattr(anamnese_obj, 'texto_original', '')
        })

        # Cria Documento Agno
        document = Document(
            content=rag_content,
            meta_data={
                "source": "user_feedback",
                "type": "case_study",
                "anamnese_id": str(getattr(anamnese_obj, 'id', 'unknown')),
                "cid": processed_data.get('cid_sugerido'),
                "timestamp": str(time.time())
            }
        )

        # Upsert no LanceDB
        # Knowledge não tem .upsert(), mas vector_db tem.
        knowledge_base = get_vector_db()
        knowledge_base.vector_db.upsert(documents=[document])

        elapsed = time.time() - start_time
        logger.info(f"Ingestão RAG concluída com sucesso em {elapsed:.2f}s. CID: {processed_data.get('cid_sugerido')}")
        return True

    except Exception as e:
        logger.error(f"Erro na ingestão RAG da anamnese {getattr(anamnese_obj, 'id', 'unknown')}: {str(e)}", exc_info=True)
        return False
