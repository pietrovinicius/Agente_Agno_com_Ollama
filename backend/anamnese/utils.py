import re
import unicodedata

def sanitize_text(text: str) -> str:
    """
    Higieniza o texto gerado pela IA para corrigir artefatos de codificação
    e alucinações gramaticais comuns (ex: 'regióo' -> 'região').
    """
    if not text:
        return ""

    # 1. Normalização Unicode (NFC)
    text = unicodedata.normalize('NFC', text)

    # 2. Correções via Regex (Defense in Depth)
    
    # Caso específico reportado: "regióo", "coraçóo", etc.
    # Padrão: Palavras terminadas em 'óo' ou 'ao' sem til
    # Substitui 'óo' por 'ão' em finais de palavra
    text = re.sub(r'([a-zA-Zç])óo\b', r'\1ão', text, flags=re.IGNORECASE)
    
    # Substitui 'óos' por 'ões' (ex: "regióos" -> "regiões")
    text = re.sub(r'([a-zA-Zç])óos\b', r'\1ões', text, flags=re.IGNORECASE)
    
    # Correção de "pénis" para "pênis" (se o filtro principal falhar)
    text = re.sub(r'\bpénis\b', 'pênis', text, flags=re.IGNORECASE)

    return text.strip()
