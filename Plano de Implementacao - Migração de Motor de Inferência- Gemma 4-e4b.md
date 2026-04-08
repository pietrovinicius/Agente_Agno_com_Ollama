# Migração de Motor de Inferência: Gemma 4:e4b

Este plano detalha a substituição do modelo `llama3.2` pelo `gemma4:e4b` no Assistente de Anamnese Médica, garantindo a atualização dos scripts de preload e a conformidade com o processo de release (Fase 5 do GEMINI.md).

## User Review Required

> [!IMPORTANT]
> A troca do modelo para `gemma4:e4b` exige que o usuário tenha o modelo baixado no Ollama (`ollama pull gemma4:e4b`) ou que o script de preload consiga realizar o download (se o Ollama estiver configurado para isso).

## Proposed Changes

---

### Backend (Processamento e Agentes)

#### [MODIFY] [agents.py](file:///Volumes/SSD%201tb/Projetos/Agente_Agno_com_Ollama/backend/agents.py)
- Alterar o `id` do modelo de "llama3.2" para "gemma4:e4b".

#### [MODIFY] [preload_model.py](file:///Volumes/SSD%201tb/Projetos/Agente_Agno_com_Ollama/preload_model.py)
- Atualizar o nome do modelo para "gemma4:e4b" no payload de pré-carregamento.

#### [MODIFY] [ingest_knowledge.py](file:///Volumes/SSD%201tb/Projetos/Agente_Agno_com_Ollama/backend/anamnese/management/commands/ingest_knowledge.py)
- Atualizar o comentário referente ao fallback do modelo para consistência (Opcional, mas recomendado para documentação).

---

### Frontend (Interface e Versionamento)

#### [MODIFY] [App.jsx](file:///Volumes/SSD%201tb/Projetos/Agente_Agno_com_Ollama/frontend/src/App.jsx)
- Atualizar a versão exibida na Sidebar de "Professional V2.0" para "Professional V2.1.0".

---

### Processo de Release (Fase 5 - GEMINI.md)

#### [NEW] [2026-04-08-migracao-gemma4.md](file:///Volumes/SSD%201tb/Projetos/Agente_Agno_com_Ollama/changelog/2026-04-08-migracao-gemma4.md)
- Criar a pasta `/changelog` na raiz.
- Detalhar a migração, o padrão M4 e os ganhos esperados (menor latência/melhor precisão técnica).

---

### Versionamento

- Executar `git add .`.
- Commit: `feat: migra motor de inferência para gemma4:e4b`.
- Executar `git push`.

## Verification Plan

### Automated Tests
- N/A (A migração é configuracional, mas validaremos a inicialização via terminal).

### Manual Verification
1.  **Ollama**: `ollama list` para verificar se o modelo existe.
2.  **Backend**: Iniciar Django e verificar se o Agno carrega o modelo correto.
3.  **Frontend**: Verificar se a versão "V2.1.0" aparece no rodapé da Sidebar.
4.  **Integração**: Realizar uma análise de anamnese e verificar o tempo de resposta e qualidade do JSON.
