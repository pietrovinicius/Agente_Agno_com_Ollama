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

### Melhorias de Design e UX (0.1.1)
- **Novo Layout de Dashboard**: Reestruturação completa da interface para um layout de Dashboard Médico com Sidebar lateral e divisão em duas colunas (Registro Clínico vs Insights IA).
- **Design System Atualizado**: Adoção de paleta profissional `Sky/Slate` (Azul Céu e Cinza) sobre fundo `Gray-50` para maior conforto visual e modernidade.
- **Componentes Avançados**:
    - **Input Interativo**: Campo de texto com label flutuante e estados de foco aprimorados.
    - **Cards de Insights**: Visualização de resultados com bordas laterais coloridas (`border-l-4`) para distinção rápida entre Diagnóstico e Conduta.
    - **Micro-interações**: Feedback visual com ícones `Lucide-React`, animações de pulsação durante processamento e indicadores de status.
- **Produtividade**: Ações rápidas de "Aprovar Sugestão" e "Editar Manualmente" com feedback via Toast Notifications.

### Refinamento Visual "Medical Blue" (0.1.2)
- **Paleta de Cores Premium**: Substituição do "Sky Blue" pelo "Royal Blue" (Azul Médico Profundo) para transmitir maior autoridade e confiança.
- **Interface de Editor Rico**: O campo de anamnese agora simula um editor de texto profissional com barra de ferramentas (Negrito, Itálico, Listas).
- **Botões "New Skeuomorphism"**: Adição de gradientes sutis, sombras coloridas e feedback tátil (clique/hover) nos botões de ação.
- **Tipografia e Espaçamento**: Ajustes finos em pesos de fonte (font-semibold) e espaçamento (whitespace) para melhor legibilidade.
- **Sidebar Destacada**: Adição de sombreamento profundo na barra lateral para melhor separação visual das camadas.

### UX Aprimorada (0.1.3)
- **Formatação de Tempo Inteligente**: O cronômetro de processamento agora exibe o tempo em minutos e segundos (ex: "4m 23s") para durações mais longas, melhorando a legibilidade.

### Persistência e Integração (0.1.4)
- **Backend - Persistência**: Criação do modelo `Anamnese` para salvar históricos no banco de dados SQLite.
- **Backend - API**: Novo endpoint `POST /api/salvar-anamnese/` e rota raiz `/` informativa com status da API.
- **Backend - Admin**: Configuração do Django Admin para visualização, filtro e busca de anamneses processadas.
- **Frontend - Integração**: Conexão do botão "Aprovar Sugestão" com a API de persistência, garantindo que os dados aprovados sejam gravados no banco.
