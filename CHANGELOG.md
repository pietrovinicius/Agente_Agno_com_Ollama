# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.1.0] - 2026-01-23

### Adicionado

#### Backend
- **Estrutura do Projeto**: Configuração inicial do Django 5.x com `config` e app `anamnese`.
- **API REST**: Implementação com Django Rest Framework (DRF).
- **IA/Agentes**:
    - Criação de `agents.py` com integração ao framework Agno.
    - Configuração do agente "Assistente Clínico Sênior" usando modelo `llama3.1` via Ollama local.
    - Definição de Schema Pydantic `AnamneseSchema` para estruturação de dados (Texto Melhorado, CID Sugerido, Sintomas).
- **Endpoints**:
    - `POST /api/processar-anamnese/`: Endpoint assíncrono para receber texto bruto e retornar análise estruturada.
- **Assincronismo**: Implementação de suporte `async` com `adrf` (Async Django Rest Framework) para evitar bloqueio da thread principal durante inferência da IA.
- **Testes**: Configuração de `pytest` e `pytest-django` com testes unitários para a API (`tests/test_api.py`), incluindo mocking do agente de IA.
- **Configuração**: Setup de CORS (`django-cors-headers`) para comunicação com o frontend.

#### Frontend
- **Framework**: Criação do projeto com React e Vite.
- **Estilização**: Configuração completa do Tailwind CSS.
- **Interface (UI)**:
    - Tela principal com divisão "Antes" (Input) e "Depois" (Resultado).
    - Componente de `Textarea` para entrada de anamnese.
    - Exibição estruturada dos resultados: Texto revisado, Card de CID-10 e Lista de Sintomas.
    - Feedback visual de "Carregando" durante o processamento.
- **Integração**: Conexão com a API Django via `axios`.

#### DevOps & Documentação
- **Dependências**: Arquivo `requirements.txt` completo.
- **Git**: Configuração de `.gitignore` para Python e Node.js.
- **Documentação**: Criação de `README.md`, `CHANGELOG.md` e `Anotacoes.txt` com instruções de setup.

### Infraestrutura Local & Correções
- **Ollama Local**: Instalação manual do binário do Ollama na pasta `tools/` do projeto.
- **Configuração de Ambiente**: Criação de diretório `ollama_home` para armazenar modelos e dados localmente, contornando restrições de permissão do sistema.
- **Scripts**: Adicionado `start_ollama.sh` para inicialização automática do servidor Ollama com as variáveis de ambiente corretas.
- **Qualidade de Código**: Correções de formatação PEP-8 (imports, espaçamento, linhas em branco) em `agents.py`, `views.py` e `settings.py`.
- **Frontend Build**: Correção de compatibilidade entre Tailwind CSS v4 e PostCSS substituindo o plugin `tailwindcss` por `@tailwindcss/postcss` no arquivo `postcss.config.js`.
- **Agentes**: Correção de `TypeError` na inicialização do `Agent` em `agents.py`, substituindo o parâmetro `response_model` por `output_schema` conforme a API atual do Agno.
