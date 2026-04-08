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

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Anamnese
from .serializers import AnamneseSerializer

logger = logging.getLogger(__name__)


def index(request):
    """
    Rota raiz para verificação de status da API.
    """
    from django.http import JsonResponse
    return JsonResponse({
        "status": "online",
        "message": "Lucas MD IA API v1.0 Rodando",
        "docs": "/api/",
        "admin": "/admin/"
    })


@api_view(['GET'])
async def listar_anamneses(request):
    """
    Retorna a lista de anamneses salvas, ordenadas das mais recentes.
    """
    try:
        # Recupera todas as anamneses ordenadas por data descendente
        queryset = await sync_to_async(lambda: list(Anamnese.objects.all().order_by('-created_at')))()
        serializer = AnamneseSerializer(queryset, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Erro ao listar anamneses: {str(e)}", exc_info=True)
        return Response({"erro": "Falha ao recuperar histórico.", "detalhes": str(e)}, status=500)


@api_view(['POST'])
async def salvar_anamnese(request):
    """
    Salva uma anamnese processada no banco de dados.
    """
    try:
        serializer = AnamneseSerializer(data=request.data)
        if serializer.is_valid():
            # Como estamos em um contexto async, precisamos usar sync_to_async para salvar no DB
            instance = await sync_to_async(serializer.save)()
            
            # Continuous Learning: Ingestão Automática no RAG
            try:
                from .rag_utils import ingest_anamnese
                # Executa a ingestão em thread separada para não bloquear
                await sync_to_async(ingest_anamnese)(instance)
            except Exception as e:
                logger.error(f"Falha na ingestão RAG pós-salvamento: {e}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Erro ao salvar anamnese: {str(e)}", exc_info=True)
        return Response({"erro": "Falha ao salvar anamnese.", "detalhes": str(e)}, status=500)


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
        
        # Higienização de Texto (Gramática e Codificação)
        from .utils import sanitize_text
        if hasattr(resultado, 'texto_melhorado'):
            resultado.texto_melhorado = sanitize_text(resultado.texto_melhorado)

        # Retorna os dados serializados (Validação Robusta v2)
        if isinstance(resultado, str):
            logger.error(f"Falha de Schema LLM: O modelo retornou texto puro em vez de JSON estruturado.")
            logger.error(f"CONTEÚDO BRUTO RECEBIDO: {resultado!r}")
            return Response({
                "erro": "O motor de IA falhou em seguir o contrato de dados estruturados.",
                "conteudo_bruto": resultado
            }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response(resultado.model_dump())

    except Exception as e:
        logger.error(f"Erro ao processar anamnese: {str(e)}", exc_info=True)
        return Response({"erro": "Falha ao processar com IA.", "detalhes": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
async def register_view(request):
    """
    Cria um novo usuário e retorna o token de acesso.
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        name = request.data.get('name')

        if not username or not password:
            return Response({"erro": "Usuário e senha são obrigatórios."}, status=400)

        # Verifica se usuário já existe
        user_exists = await sync_to_async(User.objects.filter(username=username).exists)()
        if user_exists:
            return Response({"erro": "Este nome de usuário já está sendo utilizado."}, status=400)

        # Cria o usuário
        user = await sync_to_async(User.objects.create_user)(
            username=username,
            password=password,
            first_name=name or ""
        )

        # Gera o token
        token, _ = await sync_to_async(Token.objects.get_or_create)(user=user)

        return Response({
            "token": token.key,
            "username": user.username,
            "name": user.first_name
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Erro no cadastro: {str(e)}")
        return Response({"erro": "Falha ao criar conta."}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
async def login_view(request):
    """
    Autentica o usuário e retorna o token de acesso.
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"erro": "Informe usuário e senha."}, status=400)

        user = await sync_to_async(authenticate)(username=username, password=password)

        if user is not None:
            token, _ = await sync_to_async(Token.objects.get_or_create)(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "name": user.first_name
            })
        
        return Response({"erro": "Credenciais inválidas."}, status=401)

    except Exception as e:
        logger.error(f"Erro no login: {str(e)}")
        return Response({"erro": "Falha na autenticação."}, status=500)
