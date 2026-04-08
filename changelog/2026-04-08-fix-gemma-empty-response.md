# Fragmento de Changelog: Estabilização de Contexto RAG e Resposta Vazia

**Data:** 2026-04-08
**Autor:** Antigravity (Senior Full Stack Engineer)

## Correções
- **Janela de Contexto:** Aumentada a janela de contexto (`num_ctx`) do modelo Gemma 4 para **4096 tokens**, garantindo espaço suficiente para os documentos recuperados via RAG e para a definição do schema JSON.
- **Injeção de RAG (add_context):** Habilitado o parâmetro `add_context=True` no Agente Agno. Isso força a inclusão dos documentos da base de conhecimento diretamente no prompt caso a busca automática seja bem-sucedida, resolvendo o problema de respostas vazias quando o modelo não "decidia" usar a ferramenta de busca.
- **Few-Shot Prompting:** Refinado o sistema de instruções com um exemplo real de saída JSON. Isso ajuda o modelo `gemma4:e4b` a manter a estrutura esperada mesmo sob alta carga de contexto técnico.
- **Logging de Depuração:** Melhorada a captura de logs na View de processamento para exibir o conteúdo bruto literal (`!r`) da resposta em caso de falha, agilizando diagnósticos de latência ou corte de resposta pelo Ollama.

## Motivação
Identificamos que a desativação da ferramenta de busca (para evitar erros de nome de função) deixou o modelo sem acesso direto ao conhecimento. A injeção via `add_context` somada ao aumento da janela de tokens restaura a inteligência clínica da solução.
