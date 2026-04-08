# Fragmento de Changelog: Correção de Mapeamento RAG (Active Learning)

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer)

## Correções
- **Mapeamento de Ingestão (rag_utils.py)**: Resolvida a falha onde a ingestão no LanceDB era ignorada por procurar a chave inexistente `conteudo_processado`.
- **Refatoração de Extração**: Implementada função `get_val` para extrair dados de forma resiliente tanto de instâncias do modelo Django quanto de dicionários, utilizando os campos reais (`texto_melhorado`, `cid_sugerido`, `texto_original`).
- **Sincronia de Chaves**: Alinhada a chave `queixa_original` para `texto_original` no formatador do RAG, garantindo que o texto bruto seja devidamente indexado para futuras consultas semânticas.

## Motivação
O RAG (Active Learning) é o coração do aprendizado do sistema. Esta correção garante que cada anamnese aprovada pelo médico alimente imediatamente a base de conhecimento vetorial, melhorando a precisão de sugestões futuras.
