# Fragmento de Changelog: Resiliência de RAG e Schema JSON

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer)

## Correções
- **Infraestrutura RAG:** Adicionado modelo `nomic-embed-text` via Ollama para suportar o pipeline de busca semântica em conformidade com as exigências do Agente Agno.
- **Resiliência da API (views.py):** Implementada verificação de tipo para o objeto de resposta da IA. Agora, caso o LLM retorne texto puro em vez de um objeto estruturado, a API responde com `HTTP 422 Unprocessable Entity` em vez de causar um `500 AttributeError`.
- **Otimização de Prompt (agents.py):** Reforçada a instrução sistêmica para o modelo Gemma 4, exigindo saída exclusivamente em JSON e proibindo explicitamente o uso de blocos de código Markdown.
- **Correção de Tool-Calling:** Desativado o parâmetro `search_knowledge=True` que estava induzindo o Gemma 4 a tentar chamar a ferramenta inexistente `google:search`. A busca na base de conhecimento continua ativa através da injeção de contexto automática do Agno.
- **Estabilização de JSON:** Ativado o parâmetro `"format": "json"` nas opções do Ollama, forçando o modelo `gemma4:e4b` a gerar saídas estruturadas nativamente.

## Motivação
O modelo Gemma 4, embora potente, demonstrou maior tendência a escapar do contrato JSON quando comparado ao Llama. Esta atualização garante que o sistema não "quebre" diante de respostas malformadas e que o motor de busca vetorial tenha os embeddings necessários para operar.
