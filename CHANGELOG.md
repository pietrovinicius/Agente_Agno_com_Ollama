# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Unreleased]

### Adicionado
- **Backend**:
    - Configuração inicial do projeto Django (`config`) e aplicação `anamnese`.
    - Configuração do `settings.py` com CORS e DRF.
    - Implementação de `agents.py` com Agente Agno conectado ao Ollama (Llama 3.1).
    - Definição do schema Pydantic `AnamneseSchema` para saída estruturada.
    - Endpoint API `POST /api/processar-anamnese/` assíncrono para processamento de texto.
    - Utilização de `adrf` (Async Django Rest Framework) para suporte real a views assíncronas.
    - Configuração de testes com `pytest` e `pytest-django`.
    - Testes unitários para a API (`tests/test_api.py`) com mock do agente de IA.

- **Frontend**:
    - Criação do projeto React com Vite.
    - Configuração do Tailwind CSS para estilização.
    - Instalação de dependências: `axios`, `lucide-react`.
    - Implementação da interface de usuário (`App.jsx`) com:
        - Área de texto para entrada da anamnese bruta.
        - Botão de processamento.
        - Exibição do resultado (Texto Melhorado, CID-10, Sintomas) lado a lado.
        - Feedback visual de carregamento e erros.

### Dependências
- Python: `django`, `djangorestframework`, `django-cors-headers`, `agno`, `pydantic`, `pytest`, `pytest-django`, `ollama`, `adrf`.
- Node.js: `react`, `vite`, `tailwindcss`, `axios`, `lucide-react`.

### Observações
- O projeto requer que o Ollama esteja rodando localmente na porta padrão (11434) com o modelo `llama3.1` baixado (`ollama pull llama3.1`).
