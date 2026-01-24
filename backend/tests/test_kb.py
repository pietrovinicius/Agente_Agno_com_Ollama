import pytest
import sys
from pathlib import Path

# Adiciona o diretório backend ao path para importação correta
sys.path.append(str(Path(__file__).resolve().parent.parent))

from agents import get_medical_agent, knowledge_content

def test_knowledge_content_loaded():
    """Verifica se o conteúdo do FAQ foi carregado na memória."""
    assert knowledge_content != "", "O conteúdo do FAQ.MD não foi carregado (verifique se FAQ.MD existe)"
    assert "Protocolos Clínicos Críticos" in knowledge_content

def test_agent_has_context_injection():
    """Verifica se o agente recebeu o FAQ nas instruções (Context Injection)."""
    agent = get_medical_agent()
    # As instruções são passadas como lista
    all_instructions_text = "\n".join(agent.instructions)
    
    assert "BASE DE CONHECIMENTO (FAQ.MD)" in all_instructions_text
    assert "Fluxo de Sepse" in all_instructions_text
