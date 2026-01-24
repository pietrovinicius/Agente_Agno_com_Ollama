from adrf.decorators import api_view
from rest_framework.response import Response
from asgiref.sync import sync_to_async
import logging
import sys
import os

# Add the parent directory to sys.path to allow importing agents if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from agents import get_medical_agent
except ImportError as e:
    # Log the error to help debugging
    logging.error(f"Error importing agents: {e}")
    # Try absolute import if running as package
    try:
        from backend.agents import get_medical_agent
    except ImportError:
        # Re-raise the original error if both fail, to see what's wrong
        raise e

logger = logging.getLogger(__name__)


@api_view(['POST'])
async def processar_anamnese(request):
    """
    Recebe o texto bruto da anamnese e retorna a versão estruturada processada pelo Agente.
    """
    try:
        texto = request.data.get('texto', '')
        if not texto:
            return Response({"erro": "O campo 'texto' é obrigatório."}, status=400)

        logger.info(f"Iniciando processamento de anamnese. Tamanho do texto: {len(texto)}")

        # Inicializa o agente
        agent = get_medical_agent()

        # Executa o agente de forma não bloqueante (threadpool)
        # O Agno (Phidata) .run() é síncrono, então usamos sync_to_async
        # para não bloquear o event loop do Django/ASGI.
        run_response = await sync_to_async(agent.run)(texto)

        # O resultado estruturado estará em run_response.content (instância do Pydantic)
        resultado = run_response.content

        # Retorna os dados serializados
        return Response(resultado.model_dump())

    except Exception as e:
        logger.error(f"Erro ao processar anamnese: {str(e)}", exc_info=True)
        return Response({"erro": "Falha ao processar com IA.", "detalhes": str(e)}, status=500)
